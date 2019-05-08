import {all, call, fork, put, select, take, takeEvery} from 'redux-saga/effects'
import {
  createFoundInitialConfigurationsEvent,
  createReceivedInitialConfigurationsEvent,
  createReceivedRemoteOAuthConfigurations,
  failedToGetRemoteOAuthConfigurations,
  RECEIVED_INITIAL_CONFIGURATION,
  RECEIVED_OAUTH_CONFIGURATION,
  RECEIVED_REMOTE_OAUTH_CONFIGURATION,
  receivedOAuthConfigurations,
  REQUESTED_INITIAL_CONFIGURATION,
  REQUESTED_OAUTH_CONFIGURATION,
  requestOAuthConfigurations
} from "../events/ConfigurationEvents";
import type {OauthConfig} from "../reducers/ConfigurationReducer";
import {INITIALIZED_APPLICATION} from "../events/ApplicationLifecycleEvents";
import {performOpenGet} from "./APISagas";
import {AuthorizationServiceConfiguration} from "@openid/appauth";
import {createOauthConfigurationObject} from "../security/StupidShit";

// todo: this feels weird
export function* oAuthConfigurationSaga(): OauthConfig {
  yield put(requestOAuthConfigurations()); // ask for oauth configurations
  const {payload: oauthConfig} = yield take(RECEIVED_OAUTH_CONFIGURATION); // yay configurations!
  return oauthConfig;
}

function* securityRequestSaga() {
  const oauthConfig = yield fetchOAuthConfiguration();
  yield put(receivedOAuthConfigurations(oauthConfig))
}

function* fetchOAuthConfiguration(): OauthConfig {
  const {oauth} = yield select(state => state.configuration);
  if (!oauth.authorizationEndpoint) {
    const {payload} = yield take(RECEIVED_REMOTE_OAUTH_CONFIGURATION);
    return payload;
  } else {
    return createOauthConfigurationObject(oauth);
  }
}

function* initialConfigurationFetchSaga() {
  const {initial} = yield select(state => state.configuration);
  if (!initial.callbackURI) {
    const {payload: backendConfigurations} = yield take(RECEIVED_INITIAL_CONFIGURATION);
    return backendConfigurations;
  }
  return initial
}

function* listenToConfigurationEvent() {
  yield takeEvery(REQUESTED_OAUTH_CONFIGURATION, securityRequestSaga)
}

function* initialConfigurationSaga() {
  try {
    const {data} = yield performOpenGet('./configurations');
    yield put(createReceivedInitialConfigurationsEvent(data));// save in state from now on.
  } catch (e) {

  }
}

function* oauthConfigurationSetupSaga() {
  const initialConfigurations = yield initialConfigurationFetchSaga();
  try {
    const openIdEndpoints = yield call(() =>
      AuthorizationServiceConfiguration.fetchFromIssuer(initialConfigurations.openIDConnectURI));
    yield put(createReceivedRemoteOAuthConfigurations(openIdEndpoints));
  } catch (error) {
    yield put(failedToGetRemoteOAuthConfigurations(error));
  }
}

function* listenToApplicationEvents() {
  yield fork(listenToConfigurationEvent);
  yield takeEvery(INITIALIZED_APPLICATION, initialConfigurationSaga)
}

function* initialConfigurationResponseSaga(){
  const initialConfigurations = yield initialConfigurationFetchSaga();
  yield put(createFoundInitialConfigurationsEvent(initialConfigurations));
}

function* listenToConfigurationRequestEvents(){
  yield takeEvery(REQUESTED_INITIAL_CONFIGURATION, initialConfigurationResponseSaga)
}

export default function* rootSaga() {
  yield all([
    listenToApplicationEvents(),
    fork(oauthConfigurationSetupSaga),
    listenToConfigurationRequestEvents(),
  ])
}
