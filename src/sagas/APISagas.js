import {FOUND_ACCESS_TOKEN, requestAccessToken} from "../actions/SecurityActions";
import {call, put, take} from 'redux-saga/effects'
import axios from "axios";

export function* performGet(url: String, options = {headers: {}}) {
  yield put(requestAccessToken());
  const {payload: accessToken} = yield take(FOUND_ACCESS_TOKEN);
  return yield call(() => axios.get(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    }
  }));

}