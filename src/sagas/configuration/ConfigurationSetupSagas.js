import {call, put} from 'redux-saga/effects'
import {
  createFailedToGetRemoteOAuthConfigurationsEvent,
  createReceivedRemoteOAuthConfigurations
} from "../../events/ConfigurationEvents";
import {AuthorizationServiceConfiguration} from "@openid/appauth";
import {initialConfigurationFetchSaga} from "./InitialConfigurationSagas";
import type {OAuthConfig} from "../../types/ConfigurationModels";

export const fetchConfigurationsFromIssuer = (issuerURI: string): Promise<OAuthConfig> =>
  AuthorizationServiceConfiguration.fetchFromIssuer(issuerURI);

export function* authorizationServiceConfigurationSaga() {
  const initialConfigurations = yield call(initialConfigurationFetchSaga);
  try {
    const openIdEndpoints = yield call(fetchConfigurationsFromIssuer,
      initialConfigurations.openIDConnectURI);
    yield put(createReceivedRemoteOAuthConfigurations(openIdEndpoints));
  } catch (error) {
    yield put(createFailedToGetRemoteOAuthConfigurationsEvent(error));
  }
}
