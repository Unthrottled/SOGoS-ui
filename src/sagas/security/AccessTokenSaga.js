import {select, put, fork, take} from 'redux-saga/effects';
import {foundAccessToken, RECEIVED_TOKENS} from "../../events/SecurityActions";
import {canRefreshToken} from "../../security/OAuth";
import {oAuthConfigurationSaga} from "../ConfigurationSagas";
import {refreshTokenSaga} from "./RefreshTokenSaga";
import {TokenResponse} from "@openid/appauth";

export function* accessTokenSaga() {
  const accessToken = yield getOrRefreshAccessToken();
  yield put(foundAccessToken(accessToken));
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
