import {call, select} from 'redux-saga/effects';
import type {InitialConfig} from "../../reducers/ConfigurationReducer";
import {oAuthConfigurationSaga} from "../configuration/ConfigurationConvienenceSagas";

export function* constructRedirectURI(endSessionEndpoint): string {
  const {initial} = yield select(state => state.configuration);
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

export function logoffPreFlightSaga() {
  // do stuff
}

export function pushRedirect(href: string) {
  document.location.href = href;
  return Promise.resolve();
}

export default function* logoutSaga() {
  yield call(logoffPreFlightSaga);
  const {endSessionEndpoint} = yield call(oAuthConfigurationSaga);
  const href = yield call(constructRedirectURI, endSessionEndpoint);
  yield call(pushRedirect, href);
}
