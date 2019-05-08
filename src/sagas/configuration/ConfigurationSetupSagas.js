import {call, put} from 'redux-saga/effects'
import {
  createReceivedRemoteOAuthConfigurations,
  failedToGetRemoteOAuthConfigurations
} from "../../events/ConfigurationEvents";
import {AuthorizationServiceConfiguration} from "@openid/appauth";
import {initialConfigurationFetchSaga} from "./InitialConfigurationSagas";


export function* authorizationServiceConfigurationSaga() {
  const initialConfigurations = yield initialConfigurationFetchSaga();
  try {
    const openIdEndpoints = yield call(() =>
      AuthorizationServiceConfiguration.fetchFromIssuer(initialConfigurations.openIDConnectURI));
    yield put(createReceivedRemoteOAuthConfigurations(openIdEndpoints));
  } catch (error) {
    yield put(failedToGetRemoteOAuthConfigurations(error));
  }
}
