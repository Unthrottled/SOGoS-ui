import {FOUND_ACCESS_TOKEN, requestAccessToken} from "../actions/SecurityActions";
import {put, take, call} from 'redux-saga/effects'
import axios from "axios";

export function* performGet(url: String, options = {headers: {}}) {
  yield put(requestAccessToken());
  const {payload: accessToken} = yield take(FOUND_ACCESS_TOKEN);
  const response = yield call(()=>axios.get(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    }
  } ));
  console.log(response);
  return response;

}