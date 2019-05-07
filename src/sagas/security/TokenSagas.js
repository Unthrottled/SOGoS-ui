import {BaseTokenRequestHandler, TokenRequestHandler} from "@openid/appauth";
import {createTokenReceptionEvent} from "../../events/SecurityEvents";
import {call, put} from 'redux-saga/effects'

const tokenHandler: TokenRequestHandler = new BaseTokenRequestHandler();

export function* fetchTokenSaga(oauthConfig, tokenRequest) {
  const tokenResponse = yield call(() => tokenHandler.performTokenRequest(oauthConfig, tokenRequest));
  yield put(createTokenReceptionEvent(tokenResponse));
}
