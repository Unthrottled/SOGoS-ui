import {takeEvery, take, put, fork, all, select} from 'redux-saga/effects'
import {INITIALIZED_APPLICATION} from "../actions/ApplicationLifecycleActions";
import {RECEIVED_OAUTH_CONFIGURATION, requestOAuthConfigurations} from "../actions/ConfigurationActions";
import {needsToLogIn, needsToRefreshToken} from "../security/OAuth";
import {
  AuthorizationNotifier,
  AuthorizationRequest,
  RedirectRequestHandler
} from "@openid/appauth";

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
      }
    });
    const scope = 'openid profile email';
    const authorizationRequest = new AuthorizationRequest({
      client_id: 'sogos-app',
      redirect_uri: 'http://localhost:3000',
      scope,
      response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
    });
    // authorizationHandler.performAuthorizationRequest(oauthConfig, authorizationRequest);


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