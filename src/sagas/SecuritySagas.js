import {takeEvery, take, put, fork, all, select} from 'redux-saga/effects'
import {INITIALIZED_APPLICATION} from "../actions/ApplicationLifecycleActions";
import {RECEIVED_OAUTH_CONFIGURATION, requestOAuthConfigurations} from "../actions/ConfigurationActions";
import {needsToLogIn, needsToRefreshToken} from "../security/OAuth";
import {
  AuthorizationNotifier,
  AuthorizationRequest, BaseTokenRequestHandler, GRANT_TYPE_AUTHORIZATION_CODE,
  RedirectRequestHandler, TokenRequest
} from "@openid/appauth";
import { NodeCrypto } from '@openid/appauth/built/node_support/';

function* securityRequestSaga() {
  // Make sure that credentials are up to date
  yield put(requestOAuthConfigurations()); // ask for oauth configurations
  const {payload: oauthConfig} = yield take(RECEIVED_OAUTH_CONFIGURATION); // yay configurations!
  // gather redirection stuff?
  yield oauthInitializationSaga(oauthConfig);
}

function* oauthInitializationSaga(oauthConfig){
  const {securityState} = yield select();
  if(needsToLogIn(securityState)){
    const notifier = new AuthorizationNotifier();
    const authorizationHandler = new RedirectRequestHandler();
    authorizationHandler.setAuthorizationNotifier(notifier);
    notifier.setAuthorizationListener((request, response, error)=>{
      console.log('Authorization request complete ', request, response, error);
      if (response) {
        const code = response.code;
        const codeVerifier = request.internal && request.internal.code_verifier;
        const tokenRequest = new TokenRequest({
          client_id: "sogos-app",
          redirect_uri: 'http://localhost:3000',
          grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
          code,
          refresh_token: undefined,
          extras: {
            code_verifier : codeVerifier
          }
        });
        new BaseTokenRequestHandler().performTokenRequest(oauthConfig, tokenRequest)
          .then(response =>{
            console.log(`Got this shit`, response);
          })
      }
    });
    authorizationHandler.completeAuthorizationRequestIfPossible()
      .then(() => {
        if(window.location.search.indexOf('state') < 0){
          const scope = 'openid profile email';
          const authorizationRequest = new AuthorizationRequest({
            client_id: 'sogos-app',
            redirect_uri: 'http://localhost:3000',
            scope,
            response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
          }, new NodeCrypto());
          authorizationHandler.performAuthorizationRequest(oauthConfig, authorizationRequest);
        }
      })
  } else if(needsToRefreshToken(securityState)){

  }
}

function* listenToStartupEvent(){
  yield takeEvery(INITIALIZED_APPLICATION, securityRequestSaga)
}

function* listenToAppLifecycleEvents() {
  yield fork(listenToStartupEvent);
}

export default function* rootSaga(){
  yield all([
    listenToAppLifecycleEvents()
  ])
}