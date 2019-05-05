import {all, fork, put, select, take, takeEvery} from 'redux-saga/effects'
import {
  createReceivedInitialConfigurationsEvent,
  fetchOAuthConfigurations, RECEIVED_INITIAL_CONFIGURATION,
  RECEIVED_OAUTH_CONFIGURATION,
  REQUESTED_OAUTH_CONFIGURATION,
  requestOAuthConfigurations
} from "../events/ConfigurationEvents";
import type {OauthConfig} from "../reducers/ConfigurationReducer";
import {INITIALIZED_APPLICATION} from "../events/ApplicationLifecycleEvents";
import {performOpenGet} from "./APISagas";

// todo: this feels weird
export function* oAuthConfigurationSaga(): OauthConfig {
  yield put(requestOAuthConfigurations()); // ask for oauth configurations
  const {payload: oauthConfig} = yield take(RECEIVED_OAUTH_CONFIGURATION); // yay configurations!
  return oauthConfig;
}

function* securityRequestSaga() {
  const initial = yield initialConfigurationFetchSaga();
  console.log('initial d', initial)
  yield put(fetchOAuthConfigurations(initial.openIDConnectURI)) //todo: handle failures.
}

function* initialConfigurationFetchSaga() {
  const {initial} = yield select(state => state.configuration);
  if (!initial.callbackURI) {
    const { payload: backendConfigurations } = yield take(RECEIVED_INITIAL_CONFIGURATION);
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
    console.log(data);
    yield put(createReceivedInitialConfigurationsEvent(data));// save in state from now on.
    return data;
  } catch (e) {

  }
}

function* listenToApplicationEvents() {
  yield fork(listenToConfigurationEvent);
  yield takeEvery(INITIALIZED_APPLICATION, initialConfigurationSaga)
}

export default function* rootSaga() {
  yield all([
    listenToApplicationEvents()
  ])
}
