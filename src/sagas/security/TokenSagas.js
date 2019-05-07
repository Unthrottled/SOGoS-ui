import {BaseTokenRequestHandler, TokenRequestHandler} from "@openid/appauth";
import {createTokenFailureEvent, createTokenReceptionEvent} from "../../events/SecurityEvents";
import {call, put} from 'redux-saga/effects'

const tokenHandler: TokenRequestHandler = new BaseTokenRequestHandler();

/**
 * Attempts to fetch token from Authorization Server.
 * @param oauthConfig
 * @param tokenRequest
 * @returns
 */
export function* fetchTokenSaga(oauthConfig, tokenRequest) {

  try {
    const tokenResponse = yield call(tokenHandler.performTokenRequest, oauthConfig, tokenRequest);
    yield put(createTokenReceptionEvent(tokenResponse));
  } catch (error) {
    yield put(createTokenFailureEvent({
      tokenRequest,
      error,
    }))
  }
}
