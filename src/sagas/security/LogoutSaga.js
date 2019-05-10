import {call, put, select} from 'redux-saga/effects';
import type {InitialConfig} from "../../reducers/ConfigurationReducer";
import {oAuthConfigurationSaga} from "../configuration/ConfigurationConvienenceSagas";
import {selectConfigurationState} from "../../reducers";
import {createLoggedOffEvent} from "../../events/SecurityEvents";

export function* constructRedirectURI(): string {
  const {endSessionEndpoint} = yield call(oAuthConfigurationSaga);
  const {initial} = yield select(selectConfigurationState);
  return `${endSessionEndpoint}?${getRedirectParameter(initial)}`;
}

const getRedirectParameter = (initialConfig: InitialConfig): string => {
  const queryParameter = getQueryParameter(initialConfig);
  return `${queryParameter}=${initialConfig.callbackURI}`
};

const getQueryParameter = (initialConfig: InitialConfig): string => {
  if (isKeycloak(initialConfig)) {
    return 'redirect_uri'
  } else {
    return 'continue=https://appengine.google.com/_ah/logout?continue'
  }
};

const isKeycloak = (initialConfiguration: InitialConfig): boolean => {
  return initialConfiguration && initialConfiguration.provider === 'KEYCLOAK';
};

export function* logoffPreFlightSaga() {
  // do stuff

  yield put(createLoggedOffEvent());// wipe state
}

export function pushRedirect(href: string) {
  document.location.href = href;
  return Promise.resolve();
}

export default function* logoutSaga() {
  yield call(logoffPreFlightSaga);
  const href = yield call(constructRedirectURI);
  yield call(pushRedirect, href);
}
