import {select, put, fork, take} from 'redux-saga/effects';
import {createFoundAccessTokenEvent, RECEIVED_TOKENS} from "../../events/SecurityEvents";
import {canRefreshToken} from "../../security/OAuth";
import {oAuthConfigurationSaga} from "../ConfigurationSagas";
import {refreshTokenSaga} from "./RefreshTokenSagas";
import {TokenResponse} from "@openid/appauth";

export function* accessTokenSagas() {
  const accessToken = yield getOrRefreshAccessToken();
  yield put(createFoundAccessTokenEvent(accessToken));
}

function* getOrRefreshAccessToken(){
  const { security } = yield select();
  if(canRefreshToken(security)){
    const oAuthConfiguration = yield oAuthConfigurationSaga();
    yield fork(refreshTokenSaga, oAuthConfiguration, security);
    // todo: handle sad case of not able to get token
    const tokenResponse: TokenResponse = take(RECEIVED_TOKENS); // hurray new token!
    return tokenResponse.accessToken;
  } else {
    return security.accessToken
  }
}
