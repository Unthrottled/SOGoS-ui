import {call, select} from 'redux-saga/effects'
import axios from "axios";
import {
  accessTokenWithoutSessionExtensionSaga,
  accessTokenWithSessionExtensionSaga
} from "./security/AccessTokenSagas";

export function* performGetWithToken(url, options, accessTokenSaga) {
  const accessToken = yield call(accessTokenSaga);
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

export function* performGet<T>(url: String, options = {headers: {}}): T {
  return yield call(performGetWithToken, url, options, accessTokenWithSessionExtensionSaga);
}

export function* performGetWithoutSessionExtension<T>(url: String, options = {headers: {}}): T {
  return yield call(performGetWithToken, url, options, accessTokenWithoutSessionExtensionSaga);
}

export function* performOpenGet<T>(url: String, options): T {
  return yield call(axios.get, url, options);
}

export function* performPost<T>(url: String, data, options = {headers: {}}): T {
  const accessToken = yield call(accessTokenWithSessionExtensionSaga);
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
