import {call, select} from 'redux-saga/effects'
import axios from 'axios';
import {accessTokenWithoutSessionExtensionSaga, accessTokenWithSessionExtensionSaga} from "./security/AccessTokenSagas";
import {selectConfigurationState} from "../reducers";
import {ConfigurationState} from "../reducers/ConfigurationReducer";

export function* performStreamedGet<T>(url: string, options = {headers: {}}) {
  const result = yield call(performGet, url, options);
  return result.data;
}

export function* createHeaders(accessTokenSaga: () => any, options = {headers: {}}) {
  const accessToken = yield call(accessTokenSaga);
  const {user: {information: {guid}}, security: {verificationKey}} = yield select();
  return {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
    ...(guid ? ({'User-Identifier': guid,}) : {}),
    ...(verificationKey ? ({'Verification': verificationKey,}) : {}),
  };
}

export function* constructURL(url: String) {
  const {initial: {apiURL}}: ConfigurationState = yield select(selectConfigurationState);
  return `${apiURL || ''}${url}`
}

export function* performGetWithToken(url: string,
                                     options: any,
                                     accessTokenSaga: () => any) {
  const headers = yield call(createHeaders, accessTokenSaga, options);
  const fullURL = yield call(constructURL, url);
  return yield call(axios.get, fullURL, {
    ...options,
    headers
  });
}

export function* performGet(url: string,
                            options = {headers: {}}) {
  return yield call(performGetWithToken, url, options, accessTokenWithSessionExtensionSaga);
}

export function* performGetWithoutSessionExtension(url: string, options = {headers: {}}) {
  return yield call(performGetWithToken, url, options, accessTokenWithoutSessionExtensionSaga);
}

export function* performOpenGet(url: string, options = {headers: {}}) {
  const fullURL = yield call(constructURL, url);
  return yield call(axios.get, fullURL, options);
}

export function* performFullOpenGet(fullURL: string, options = {headers: {}}) {
  return yield call(axios.get, fullURL, options);
}

export function* performPost(url: string, data: any, options = {headers: {}}) {
  const headers = yield call(createHeaders, accessTokenWithSessionExtensionSaga, options);
  const fullURL = yield call(constructURL, url);
  return yield call(axios.post, fullURL, data, {
    ...options,
    headers,
  });
}

export function* performPut(url: string, data: any, options = {headers: {}}) {
  const headers = yield call(createHeaders, accessTokenWithSessionExtensionSaga, options);
  const fullURL = yield call(constructURL, url);
  return yield call(axios.put, fullURL, data, {
    ...options,
    headers,
  });
}

export function* performDelete(url: string, data: any, options = {headers: {}}) {
  const headers = yield call(createHeaders, accessTokenWithSessionExtensionSaga, options);
  const fullURL = yield call(constructURL, url);
  return yield call(axios.delete, fullURL, {
    ...options,
    headers,
    data
  });
}
