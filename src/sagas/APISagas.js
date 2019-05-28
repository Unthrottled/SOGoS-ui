import {createRequestAccessTokenEvent, FOUND_ACCESS_TOKEN} from "../events/SecurityEvents";
import {call, put, take, select} from 'redux-saga/effects'
import axios from "axios";

export function* performGet<T>(url: String, options = {headers: {}}): T {
  yield put(createRequestAccessTokenEvent());
  const {payload: accessToken} = yield take(FOUND_ACCESS_TOKEN);
  const {user: {information: {guid}}, security: {verificationKey}} = yield select();
  return yield call(axios.get, url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      ...(guid ? ({'User-Identifier': guid,}) : {}),
      ...(verificationKey ? ({'Verification': verificationKey,}) : {}),
    }
  });
}

export function* performOpenGet<T>(url: String, options): T {
  return yield call(axios.get, url, options);
}

export function* performPost<T>(url: String, data, options = {headers: {}}): T {
  yield put(createRequestAccessTokenEvent());
  const {payload: accessToken} = yield take(FOUND_ACCESS_TOKEN);
  const {user: {information: {guid}}, security: {verificationKey}} = yield select();
  return yield call(axios.post, url, data, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      ...(guid ? ({'User-Identifier': guid,}) : {}),
      ...(verificationKey ? ({'Verification': verificationKey,}) : {}),
    }
  });
}
