import {takeEvery, put, fork, select, all, take} from 'redux-saga/effects'
import {
  fetchOAuthConfigurations, RECEIVED_OAUTH_CONFIGURATION,
  REQUESTED_OAUTH_CONFIGURATION,
  requestOAuthConfigurations
} from "../events/ConfigurationEvents";
import type {OauthConfig} from "../reducers/ConfigurationReducer";

// todo: this feels weird
export function* oAuthConfigurationSaga(): OauthConfig {
  yield put(requestOAuthConfigurations()); // ask for oauth configurations
  const {payload: oauthConfig} = yield take(RECEIVED_OAUTH_CONFIGURATION); // yay configurations!
  return oauthConfig;
}


function* securityRequestSaga() {
  const { initial } = yield select(state=> state.configuration);

  yield put(fetchOAuthConfigurations(initial.openIDConnectURI)) //todo: handle failures.
}

function* listenToConfigurationEvent(){
  yield takeEvery(REQUESTED_OAUTH_CONFIGURATION, securityRequestSaga)
}

function* listenToApplicationEvents() {
  yield fork(listenToConfigurationEvent);
}

export default function* rootSaga(){
  yield all([
    listenToApplicationEvents()
  ])
}
