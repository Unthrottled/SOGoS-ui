import {
  AuthorizationServiceConfiguration,
  BaseTokenRequestHandler,
  TokenRequest,
  TokenRequestHandler, TokenResponse
} from "@openid/appauth";
import {createTokenFailureEvent, createTokenReceptionEvent} from "../../events/SecurityEvents";
import {call, put} from 'redux-saga/effects'

const tokenHandler: TokenRequestHandler = new BaseTokenRequestHandler();

export const requestToken = (oauthConfig: AuthorizationServiceConfiguration, tokenRequest: TokenRequest): Promise<TokenResponse> =>
  tokenHandler.performTokenRequest(oauthConfig, tokenRequest);//Because Stateful function ._.

/**
 * Attempts to fetch token from Authorization Server.
 * @param oauthConfig
 * @param tokenRequest
 * @returns
 */
export function* fetchTokenSaga(oauthConfig, tokenRequest) {

  try {
    const tokenResponse = yield call(requestToken, oauthConfig, tokenRequest);
    yield put(createTokenReceptionEvent(tokenResponse));
  } catch (error) {
    yield put(createTokenFailureEvent({
      tokenRequest,
      error: error.message
    }))
  }
}
