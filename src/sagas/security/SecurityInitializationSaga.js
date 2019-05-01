import {call, put, select} from 'redux-saga/effects'
import {
  AuthorizationNotifier,
  AuthorizationRequest,
  AuthorizationRequestResponse,
  BaseTokenRequestHandler,
  GRANT_TYPE_AUTHORIZATION_CODE,
  RedirectRequestHandler,
  TokenRequest
} from "@openid/appauth";
import {NodeCrypto} from '@openid/appauth/built/node_support/';
import {needsToLogIn, needsToRefreshToken} from "../../security/OAuth";
import {createTokenReceptionEvent} from "../../actions/SecurityActions";

function* getThatTokenYo(request, response, oauthConfig) {
  try {
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
    yield put(createTokenReceptionEvent(tokenResponse));
  } catch (e) {

  }
}

function* performLogin(oauthConfig) {
  const notifier = new AuthorizationNotifier();
  const authorizationHandler = new RedirectRequestHandler();
  authorizationHandler.setAuthorizationNotifier(notifier);
  const authorizationResult: AuthorizationRequestResponse =
    yield call(() => authorizationHandler.completeAuthorizationRequest());
  if (!authorizationResult) {
    const scope = 'openid profile email';
    const authorizationRequest = new AuthorizationRequest({
      client_id: 'sogos-app',
      redirect_uri: 'http://localhost:3000',
      scope,
      response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
    }, new NodeCrypto());
    authorizationHandler.performAuthorizationRequest(oauthConfig, authorizationRequest);
  } else {
    const {request, response} = authorizationResult;
    yield getThatTokenYo(request, response, oauthConfig)
  }
}


function* oauthInitializationSaga(oauthConfig) {
  const {securityState} = yield select();
  if (needsToLogIn(securityState)) {
    yield performLogin(oauthConfig, securityState);
  } else if (needsToRefreshToken(securityState)) {

  }
}

export default oauthInitializationSaga;