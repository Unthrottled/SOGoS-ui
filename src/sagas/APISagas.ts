import {call, delay, race, select, take} from 'redux-saga/effects';
import {buffers, END, eventChannel} from 'redux-saga';
import oboe from 'oboe';
import axios from 'axios';
import {accessTokenWithSessionExtensionSaga} from './security/AccessTokenSagas';
import {selectConfigurationState, selectSecurityState, selectUserState} from '../reducers';
import {ConfigurationState} from '../reducers/ConfigurationReducer';
import {UserResponse} from '../types/UserTypes';
import {PayloadEvent} from '../events/Event';
import {RECEIVED_PARTIAL_USER, RECEIVED_USER} from '../events/UserEvents';
import {RECEIVED_PARTIAL_INITIAL_CONFIGURATION} from '../events/ConfigurationEvents';
import {InitialConfig} from '../types/ConfigurationTypes';
import {SecurityState} from "../reducers/SecurityReducer";
import {readTokenFetchSaga} from "./security/ReadTokenSagas";

const SHITS_BROKE_YO: string = "SHIT'S BROKE YO";

type ChannelParameters = { url: string; method: string; headers: any; body: any };
export const createStreamChannel = ({
                                      url,
                                      method,
                                      headers,
                                      body,
                                    }: ChannelParameters) => {
  return eventChannel(statusObserver => {
    const requestStream = oboe({
      url,
      method,
      headers,
      body,
      cached: false,
      withCredentials: true,
    })
      .done((jsonThingo: any) => {
        statusObserver(jsonThingo);
      })
      .fail((error: any) => {
        console.log('Error streaming', error);
        statusObserver(SHITS_BROKE_YO);
        statusObserver(END);
      })
      .on('end', () => {
        statusObserver(END);
      });
    return () => requestStream.abort();
  }, buffers.expanding(100));
};

export function* performStreamedGet<T>(url: String, options = {headers: {}}) {
  const headers = yield call(
    createHeaders,
    accessTokenWithSessionExtensionSaga,
    options,
  );
  const fullURL = yield call(constructURL, url);
  const streamChannel = yield call(createStreamChannel, {
    url: fullURL,
    method: 'GET',
    headers,
    body: '',
  });
  const aggregate = [];
  let error;
  try {
    while (true) {
      const itemChunk = yield take(streamChannel);
      if (itemChunk !== SHITS_BROKE_YO) {
        aggregate.unshift(itemChunk);
      } else {
        error = itemChunk;
      }
    }
  } finally {
    if (!error) {
      return aggregate; //dis dumb
    } else {
      throw new Error('yeet');
    }
  }
}

function* getAuthorizationStuff() {
  const {
    user: {
      information: {guid},
    },
    security: {verificationKey, readOnly},
  } = yield select();
  if (guid && verificationKey) {
    return {guid, verificationKey};
  } else if (guid && readOnly) {
    return {guid}
  }

  const {userEvent, timeout} = yield race({
    userEvent: race({
      fullUser: take(RECEIVED_USER),
      partialUser: take(RECEIVED_PARTIAL_USER),
    }),
    timeout: delay(5000),
  });

  if (timeout) {
    return {
      guid: '',
      verificationKey: '',
    };
  }

  if(userEvent.partialUser) {
    return {
      guid: userEvent.partialUser.payload
    }
  } else {
    const {
      payload: {
        information: {guid: userGuid},
        security: {verificationKey: vK},
      },
    }: PayloadEvent<UserResponse> = userEvent.fullUser;
    return {guid: userGuid, verificationKey: vK};
  }
}

export function* getVerificationStuff(include: boolean = true) {
  if (include) {
    const {guid, verificationKey} = yield call(getAuthorizationStuff);
    return {
      ...(guid ? {'User-Identifier': guid} : {}),
      ...(verificationKey ? {Verification: verificationKey} : {}),
    };
  }

  return {};
}

export function* createHeaders(
  accessTokenSaga: () => any,
  options = {headers: {}},
  includeVerification = true,
) {
  const verificationStuff = yield call(
    getVerificationStuff,
    includeVerification,
  );
  const baseHeaders = {
    ...options.headers,
    ...verificationStuff,
  }

  const {readOnly}: SecurityState = yield select(selectSecurityState);
  if (readOnly) {
    const readToken = yield call(readTokenFetchSaga);
    return {
      ...baseHeaders,
      'Read-Token': readToken
    }
  } else {
    const accessToken = yield call(accessTokenSaga);
    return {
      ...baseHeaders,
      Authorization: `Bearer ${accessToken}`,
    };
  }
}

export function* getConfig() {
  const {
    initial: {apiURL},
  }: ConfigurationState = yield select(selectConfigurationState);
  if (!apiURL) {
    const {
      payload: {apiURL: apiUrl},
    }: PayloadEvent<InitialConfig> = yield take(
      RECEIVED_PARTIAL_INITIAL_CONFIGURATION,
    );
    return apiUrl;
  }
  return apiURL;
}

export function* constructURL(url: String) {
  const apiURL = yield call(getConfig);
  return `${apiURL}${url}`;
}

export function* performGetWithToken(
  url: string,
  options: any,
  accessTokenSaga: () => any,
  includeVerification: boolean = true,
) {
  const headers = yield call(
    createHeaders,
    accessTokenSaga,
    options,
    includeVerification,
  );
  const fullURL = yield call(constructURL, url);
  return yield call(axios.get, fullURL, {
    ...options,
    headers,
  });
}

export function* performGet(url: string, options = {headers: {}}) {
  return yield call(
    performGetWithToken,
    url,
    options,
    accessTokenWithSessionExtensionSaga,
  );
}

export function* performGetWithoutVerification(
  url: string,
  options = {headers: {}},
) {
  return yield call(
    performGetWithToken,
    url,
    options,
    accessTokenWithSessionExtensionSaga,
    false,
  );
}

export function* performGetWithoutSessionExtension(
  url: string,
  options = {headers: {}},
) {
  return yield call(
    performGetWithToken,
    url,
    options,
    accessTokenWithSessionExtensionSaga,
  );
}

export function* performOpenGet(url: string, options = {headers: {}}) {
  const fullURL = yield call(constructURL, url);
  return yield call(axios.get, fullURL, options);
}

export function* performFullOpenGet(fullURL: string, options = {headers: {}}) {
  return yield call(axios.get, fullURL, options);
}

export function* performPost(url: string, data: any, options = {headers: {}}) {
  const headers = yield call(
    createHeaders,
    accessTokenWithSessionExtensionSaga,
    options,
  );
  const fullURL = yield call(constructURL, url);
  return yield call(axios.post, fullURL, data, {
    ...options,
    headers,
  });
}

export function* performPut(url: string, data: any, options = {headers: {}}) {
  const headers = yield call(
    createHeaders,
    accessTokenWithSessionExtensionSaga,
    options,
  );
  const fullURL = yield call(constructURL, url);
  return yield call(axios.put, fullURL, data, {
    ...options,
    headers,
  });
}

export function* performDelete(
  url: string,
  data: any,
  options = {headers: {}},
) {
  const headers = yield call(
    createHeaders,
    accessTokenWithSessionExtensionSaga,
    options,
  );
  const fullURL = yield call(constructURL, url);
  return yield call(axios.delete, fullURL, {
    ...options,
    headers,
    data,
  });
}
