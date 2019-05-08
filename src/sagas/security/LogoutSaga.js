import {createLoggedOffEvent} from "../../events/SecurityEvents";
import {put, select} from 'redux-saga/effects';
import type {InitialConfig} from "../../reducers/ConfigurationReducer";
import {oAuthConfigurationSaga} from "../configuration/ConfigurationConvienenceSagas";

function* constructRedirectURI(endSessionEndpoint): string {
  const { initial } = yield select(state => state.configuration);
  return `${endSessionEndpoint}?${getRedirectParameter(initial)}`;
}

const getRedirectParameter = (initialConfig: InitialConfig): string => {
  const queryParameter = getQueryParameter(initialConfig);
  return `${queryParameter}=${initialConfig.callbackURI}`
};

const getQueryParameter = (initialConfig: InitialConfig): string => {
  if(isKeycloak(initialConfig)){
    return 'redirect_uri'
  } else if(isGoogle(initialConfig)){
    return 'continue=https://appengine.google.com/_ah/logout?continue'
  } else {
    // todo: never return null.....
    throw new TypeError('I have not figured out to handle this well....');
  }
};

const isKeycloak = (initialConfiguration: InitialConfig): boolean => {
  return true;
};

const isGoogle = (initialConfiguration: InitialConfig): boolean => {
  return false;
};

export default function* logoutSaga() {
  yield put(createLoggedOffEvent());
  const { endSessionEndpoint }= yield oAuthConfigurationSaga();
  const constructedRedirectURI = yield constructRedirectURI(endSessionEndpoint);
  document.location.href = constructedRedirectURI;
}
