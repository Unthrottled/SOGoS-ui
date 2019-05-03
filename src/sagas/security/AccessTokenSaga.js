import {select, put} from 'redux-saga/effects';
import {foundAccessToken} from "../../actions/SecurityActions";

export function* accessTokenSaga() {
  const { security } = yield select();
  console.log(security);
  yield put(foundAccessToken(security.accessToken));
}