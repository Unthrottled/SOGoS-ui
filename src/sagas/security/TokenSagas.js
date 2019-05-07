import {BaseTokenRequestHandler, TokenRequestHandler} from "@openid/appauth";
import {createTokenReceptionEvent} from "../../events/SecurityEvents";
import {call, put} from 'redux-saga/effects'

const tokenHandler: TokenRequestHandler = new BaseTokenRequestHandler();

/**
 * Attempts to fetch token from Authorization Server.
 * @param oauthConfig
 * @param tokenRequest
 * @returns
 * @throws Runtime Exception Be wary (for now)
 */
export function* fetchTokenSaga(oauthConfig, tokenRequest) {
  // todo: refracture to catch exception and dispatch token failure event
  const tokenResponse = yield call(tokenHandler.performTokenRequest, oauthConfig, tokenRequest);
  yield put(createTokenReceptionEvent(tokenResponse));
}
