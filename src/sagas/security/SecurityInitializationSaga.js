import {call, fork, select} from 'redux-saga/effects'
import {
  AuthorizationNotifier,
  AuthorizationRequest,
  BaseTokenRequestHandler,
  GRANT_TYPE_AUTHORIZATION_CODE,
  RedirectRequestHandler,
  TokenRequest
} from "@openid/appauth";
import {NodeCrypto} from '@openid/appauth/built/node_support/';
import {needsToLogIn, needsToRefreshToken} from "../../security/OAuth";

function listenToRedirectionResponse(notifier) {
  return new Promise(((resolve, reject) => {
    notifier.setAuthorizationListener((request, response, error) => {
      if (error || !request) {
        reject(error)
      } else {
        resolve({
          request,
          response
        })
      }
    });
  }));
}

function* listenToRedirect(notifier, oauthConfig) {
  try {
    const {request, response} = yield call(() => listenToRedirectionResponse(notifier));
    const code = response.code;
    const codeVerifier = request.internal && request.internal.code_verifier;

    const tokenRequest = new TokenRequest({
      client_id: "sogos-app",
      redirect_uri: 'http://localhost:3000',
      grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
      code,
      extras: {
        code_verifier: codeVerifier
      }
    });

    const tokenResponse = yield call(() => new BaseTokenRequestHandler().performTokenRequest(oauthConfig, tokenRequest));
    console.log(tokenResponse)
  } catch (e) {

  }
}

function* performLogin(oauthConfig) {
  const notifier = new AuthorizationNotifier();
  const authorizationHandler = new RedirectRequestHandler();
  authorizationHandler.setAuthorizationNotifier(notifier);
  yield fork(listenToRedirect, notifier, oauthConfig);
  yield call(() => authorizationHandler.completeAuthorizationRequestIfPossible());
  if (window.location.search.indexOf('state') < 0) {
    const scope = 'openid profile email';
    const authorizationRequest = new AuthorizationRequest({
      client_id: 'sogos-app',
      redirect_uri: 'http://localhost:3000',
      scope,
      response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
    }, new NodeCrypto());
    authorizationHandler.performAuthorizationRequest(oauthConfig, authorizationRequest);
  } else {
    //clean up route
  }
}


function* oauthInitializationSaga(oauthConfig) {
  const {securityState} = yield select();
  if (needsToLogIn(securityState)) {
    yield performLogin(oauthConfig);
  } else if (needsToRefreshToken(securityState)) {

  }
}

export default oauthInitializationSaga;