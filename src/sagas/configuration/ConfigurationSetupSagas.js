import {call, put} from 'redux-saga/effects'
import {createReceivedRemoteOAuthConfigurations} from "../../events/ConfigurationEvents";
import {initialConfigurationFetchSaga} from "./InitialConfigurationSagas";
import type {InitialConfig, OAuthConfig} from "../../types/ConfigurationModels";

export function* authorizationServiceConfigurationSaga() {
  const initialConfigurations: InitialConfig = yield call(initialConfigurationFetchSaga);
  const oAuthConfigs: OAuthConfig = {
    authorizationEndpoint: initialConfigurations.authorizationEndpoint,
    endSessionEndpoint: initialConfigurations.logoutEndpoint,
    tokenEndpoint: initialConfigurations.tokenEndpoint,
    userInfoEndpoint: initialConfigurations.userInfoEndpoint,
  };
  yield put(createReceivedRemoteOAuthConfigurations(oAuthConfigs));
}
