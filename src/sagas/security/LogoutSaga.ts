import {call, put, select} from 'redux-saga/effects';
import {InitialConfig, OAuthConfig} from '../../types/ConfigurationTypes';
import {
  initialConfigurationSaga,
  oauthConfigurationSaga,
} from '../configuration/ConfigurationConvienenceSagas';
import {createLoggedOffEvent} from '../../events/SecurityEvents';
import {activityLogoutSaga} from '../activity/LogoutActivitySaga';
import {SecurityState} from "../../reducers/SecurityReducer";
import {selectSecurityState} from "../../reducers";

export function* constructRedirectURI() {
  const {endSessionEndpoint}: OAuthConfig = yield call(oauthConfigurationSaga);
  const initialConfig = yield call(initialConfigurationSaga);
  const {idToken}: SecurityState = yield select(selectSecurityState)
  return `${endSessionEndpoint}?${getRedirectParameter(initialConfig, idToken || '')}`;
}

const getIdTokenIfNecessary = (initialConfig: InitialConfig, idToken: string): string => {
  if (isOkta(initialConfig)) {
    return `id_token_hint=${idToken}&`;
  } else {
    return '';
  }
};

const getClientIfNecessary = (initialConfig: InitialConfig): string => {
  if (isCognito(initialConfig)) {
    return `client_id=${initialConfig.clientID}&`;
  } else {
    return '';
  }
};

const getRedirectParameter = (initialConfig: InitialConfig, idToken: string): string => {
  const queryParameter = getQueryParameter(initialConfig);
  return `${getClientIfNecessary(initialConfig)}${getIdTokenIfNecessary(initialConfig, idToken)}${queryParameter}=${
    encodeURI(initialConfig.callbackURI||'')
  }`;
};

const getQueryParameter = (initialConfig: InitialConfig): string => {
  if (isKeycloak(initialConfig)) {
    return 'redirect_uri';
  } else if(isOkta(initialConfig)){
    return 'post_logout_redirect_uri';
  } else{
    return 'logout_uri';
  }
};

const isKeycloak = (initialConfiguration: InitialConfig): boolean => {
  return initialConfiguration && initialConfiguration.provider === 'KEYCLOAK';
};

const isOkta = (initialConfiguration: InitialConfig): boolean => {
  return initialConfiguration && initialConfiguration.provider === 'OKTA';
};

const isCognito = (initialConfiguration: InitialConfig): boolean => {
  return initialConfiguration && initialConfiguration.provider === 'COGNITO';
};

export function* logoffPreFlightSaga() {
  // do stuff
  yield call(activityLogoutSaga);
  yield put(createLoggedOffEvent()); // wipe state
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
