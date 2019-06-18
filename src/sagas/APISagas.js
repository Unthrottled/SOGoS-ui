import {call, select, take} from 'redux-saga/effects'
import {buffers, END, eventChannel} from 'redux-saga';
import axios from "axios";
import oboe from 'oboe';

import {accessTokenWithoutSessionExtensionSaga, accessTokenWithSessionExtensionSaga} from "./security/AccessTokenSagas";

export const createStreamChannel = ({url, method, headers, body}) => {
  return eventChannel(statusObserver => {
    const requestStream = oboe({
      url,
      method,
      headers,
      body,
      'cached': false,
      'withCredentials': true
    }).done((jsonThingo: any) => {
      statusObserver(jsonThingo);
    }).fail((error: any) => {
      //todo: error handling
      console.log('Error streaming', error);
      statusObserver(END);
    }).on('end', () => {
      statusObserver(END);
    });
    return () => requestStream.abort();
  }, buffers.expanding())
};

export function* performStreamedGet<T>(url: String, options = {headers: {}}): T[] {
  const headers = yield call(createHeaders, accessTokenWithSessionExtensionSaga, options);
  const streamChannel = yield call(createStreamChannel, {
    url,
    method: 'GET',
    headers,
    body: '',
  });
  const aggregate = [];
  try {
    while (true) {
      const itemChunk = yield take(streamChannel);
      aggregate.unshift(itemChunk);
    }
  } finally {
    return aggregate; //dis dumb
  }
}

export function* createHeaders(accessTokenSaga, options = {headers: {}}) {
  const accessToken = yield call(accessTokenSaga);
  const {user: {information: {guid}}, security: {verificationKey}} = yield select();
  return {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
    ...(guid ? ({'User-Identifier': guid,}) : {}),
    ...(verificationKey ? ({'Verification': verificationKey,}) : {}),
  };
}

export function* performGetWithToken(url, options, accessTokenSaga) {
  const headers = yield call(createHeaders, accessTokenSaga, options);
  return yield call(axios.get, url, {
    ...options,
    headers
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
  const headers = yield call(createHeaders, accessTokenWithSessionExtensionSaga, options);
  return yield call(axios.post, url, data, {
    ...options,
    headers,
  });
}
