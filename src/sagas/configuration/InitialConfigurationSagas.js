import {performOpenGet} from "../APISagas";
import {
  createFailedToGetInitialConfigurationsEvent,
  createFoundInitialConfigurationsEvent,
  createReceivedInitialConfigurationsEvent,
  RECEIVED_INITIAL_CONFIGURATION
} from "../../events/ConfigurationEvents";
import {call, put, select, take} from 'redux-saga/effects'
import {selectConfigurationState} from "../../reducers";
import {waitForWifi} from "../NetworkSagas";

/**
 * Gets the configurations from the backend to know what authorization server to talk to.
 */
export function* initialConfigurationSaga() {
  try {
    yield call(waitForWifi);
    const {data} = yield call(performOpenGet, './configurations');
    yield put(createReceivedInitialConfigurationsEvent(data));
  } catch (e) {
    yield put(createFailedToGetInitialConfigurationsEvent(e));
  }
}

export function* initialConfigurationFetchSaga() {
  const {initial} = yield select(selectConfigurationState);
  if (!initial.callbackURI) {
    const {payload: backendConfigurations} = yield take(RECEIVED_INITIAL_CONFIGURATION);
    return backendConfigurations;
  }
  return initial
}

export function* initialConfigurationResponseSaga() {
  const initialConfigurations = yield call(initialConfigurationFetchSaga);
  yield put(createFoundInitialConfigurationsEvent(initialConfigurations));
}
