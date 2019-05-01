import {call, put, select} from 'redux-saga/effects'
import {
  AuthorizationNotifier,
  AuthorizationRequest,
  AuthorizationRequestResponse,
  BaseTokenRequestHandler,
  GRANT_TYPE_AUTHORIZATION_CODE, GRANT_TYPE_REFRESH_TOKEN,
  RedirectRequestHandler,
  TokenRequest, TokenRequestHandler
} from "@openid/appauth";
import {NodeCrypto} from '@openid/appauth/built/node_support/';
import {canRefreshToken, needsToLogIn} from "../../security/OAuth";
import {createTokenReceptionEvent} from "../../actions/SecurityActions";
import type {SecurityState} from "../../reducers/SecurityReducer";


const tokenHandler: TokenRequestHandler = new BaseTokenRequestHandler();

function* getNewTokens(oauthConfig, tokenRequest) {
  const tokenResponse = yield call(() => tokenHandler.performTokenRequest(oauthConfig, tokenRequest));
  yield put(createTokenReceptionEvent(tokenResponse));
}

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

    yield getNewTokens(oauthConfig, tokenRequest);
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
    // todo: clean up route
  }
}

function* refreshTokenSaga(oauthConfig, securityState: SecurityState){
  const refreshTokenRequest = new TokenRequest({
    client_id: 'sogos-app',
    redirect_uri: 'http://localhost:3000',
    grant_type: GRANT_TYPE_REFRESH_TOKEN,
    refresh_token: securityState.refreshToken
  });
  yield getNewTokens(oauthConfig, refreshTokenRequest);
}

function* oauthInitializationSaga(oauthConfig) {
  const {security} = yield select();
  if(canRefreshToken(security)) {
    yield refreshTokenSaga(oauthConfig, security);
  } else if (needsToLogIn(security)) {
    yield performLogin(oauthConfig, security);
  }
}

export default oauthInitializationSaga;