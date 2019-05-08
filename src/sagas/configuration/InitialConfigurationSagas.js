import {performOpenGet} from "../APISagas";
import {
  createFoundInitialConfigurationsEvent,
  createReceivedInitialConfigurationsEvent, RECEIVED_INITIAL_CONFIGURATION
} from "../../events/ConfigurationEvents";
import {put, select, take} from 'redux-saga/effects'

/**
 * Gets the configurations from the backend to know what authorization server to talk to.
 */
export function* initialConfigurationSaga() {
  try {
    const {data} = yield performOpenGet('./configurations');
    yield put(createReceivedInitialConfigurationsEvent(data));// save in state from now on.
  } catch (e) {

  }
}

export function* initialConfigurationFetchSaga() {
  const {initial} = yield select(state => state.configuration);
  if (!initial.callbackURI) {
    const {payload: backendConfigurations} = yield take(RECEIVED_INITIAL_CONFIGURATION);
    return backendConfigurations;
  }
  return initial
}


export function* initialConfigurationResponseSaga(){
  const initialConfigurations = yield initialConfigurationFetchSaga();
  yield put(createFoundInitialConfigurationsEvent(initialConfigurations));
}
