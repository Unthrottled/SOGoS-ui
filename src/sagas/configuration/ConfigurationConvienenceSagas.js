import {put, take} from 'redux-saga/effects'
import {
  createRequestForInitialConfigurations, FOUND_INITIAL_CONFIGURATION,
  RECEIVED_OAUTH_CONFIGURATION,
  requestOAuthConfigurations
} from "../../events/ConfigurationEvents";
import type {InitialConfig, OAuthConfig} from "../../types/ConfigurationModels";

export function* oauthConfigurationSaga(): OAuthConfig {
  yield put(requestOAuthConfigurations()); // ask for oauth configurations
  const {payload: oauthConfig} = yield take(RECEIVED_OAUTH_CONFIGURATION); // yay configurations!
  return oauthConfig;
}

export function* initialConfigurationSaga(): InitialConfig {
  yield put(createRequestForInitialConfigurations());
  const {payload: initialConfigurations} = yield take(FOUND_INITIAL_CONFIGURATION);
  return initialConfigurations
}
