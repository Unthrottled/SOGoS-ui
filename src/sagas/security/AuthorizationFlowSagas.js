import {
  AuthorizationNotifier,
  AuthorizationRequest,
  AuthorizationRequestHandler,
  AuthorizationRequestResponse,
  GRANT_TYPE_AUTHORIZATION_CODE,
  RedirectRequestHandler,
  TokenRequest
} from "@openid/appauth";
import {NodeCrypto} from '@openid/appauth/built/node_support/';
import {
  createCheckedAuthorizationEvent,
  createLoggedOnAction,
  FAILED_TO_RECEIVE_TOKEN,
  RECEIVED_TOKENS
} from "../../events/SecurityEvents";
import {call, fork, put, race, take} from 'redux-saga/effects'
import {completeAuthorizationRequest} from "../../security/StupidShit";
import {createRequestForInitialConfigurations, FOUND_INITIAL_CONFIGURATION} from "../../events/ConfigurationEvents";
import {fetchTokenSaga} from "./TokenSagas";
import {oAuthConfigurationSaga} from "../configuration/ConfigurationConvienenceSagas";
import type {OAuthConfig} from "../../reducers/ConfigurationReducer";

export function* authorizationGrantSaga() {
  yield call(performAuthorizationGrantFlowSaga, false);
  yield put(createCheckedAuthorizationEvent());
}

export function* loginSaga() {
  yield call(performAuthorizationGrantFlowSaga, true);
}

export function constructAuthorizationRequestHandler(): Promise<AuthorizationRequestHandler> {
  const notifier = new AuthorizationNotifier();
  const authorizationHandler = new RedirectRequestHandler();
  return Promise.resolve(authorizationHandler.setAuthorizationNotifier(notifier));
}

export function performAuthorizationRequest(authorizationHandler: AuthorizationRequestHandler, oauthConfig: OAuthConfig, authorizationRequest: AuthorizationRequest): Promise<void> {
  return Promise.resolve(authorizationHandler.performAuthorizationRequest(oauthConfig, authorizationRequest));
}

// Thanks shitty library API design
export function* performAuthorizationGrantFlowSaga(shouldRequestLogon: boolean) {
  const oauthConfig = yield call(oAuthConfigurationSaga);
  const authorizationHandler: AuthorizationRequestHandler =
    yield call(constructAuthorizationRequestHandler);
  const authorizationResult: AuthorizationRequestResponse =
    yield call(completeAuthorizationRequest, authorizationHandler);
  //todo: handle errors
  if (authorizationResult) {
    const {request, response} = authorizationResult;
    const tokenRequest = yield call(constructAuthorizationCodeGrantRequest, request, response);
    yield call(exchangeAuthorizationGrantForAccessToken, tokenRequest, oauthConfig);
  } else if (shouldRequestLogon) {
    const scope = 'openid profile email';
    yield put(createRequestForInitialConfigurations());
    const {payload: initialConfigurations} = yield take(FOUND_INITIAL_CONFIGURATION);
    const authorizationRequest = new AuthorizationRequest({
      client_id: initialConfigurations.clientID,
      redirect_uri: initialConfigurations.callbackURI,
      scope,
      response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
    }, new NodeCrypto());
    yield call(performAuthorizationRequest, authorizationHandler, oauthConfig, authorizationRequest);
  }
}

export function* constructAuthorizationCodeGrantRequest(request, response): TokenRequest {
  const code = response.code;
  const codeVerifier = request.internal && request.internal.code_verifier;
  yield put(createRequestForInitialConfigurations());
  const {payload: initialConfigurations} = yield take(FOUND_INITIAL_CONFIGURATION);
  return new TokenRequest({
    client_id: initialConfigurations.clientID,
    redirect_uri: initialConfigurations.callbackURI,
    grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
    code,
    extras: {
      code_verifier: codeVerifier
    }
  });
}

export function* exchangeAuthorizationGrantForAccessToken(tokenRequest, oauthConfig) {
  yield fork(fetchTokenSaga, oauthConfig, tokenRequest);
  const {tokenReception} = yield race({
    tokenReception: take(RECEIVED_TOKENS),
    tokenFailure: take(FAILED_TO_RECEIVE_TOKEN),
  });
  // todo: handle token failure at another level
  if (tokenReception) {
    yield put(createLoggedOnAction());
  }
}
