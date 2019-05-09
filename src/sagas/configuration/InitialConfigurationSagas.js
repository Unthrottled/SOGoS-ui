import {performOpenGet} from "../APISagas";
import {
  createFailedToGetInitialConfigurationsEvent,
  createFoundInitialConfigurationsEvent,
  createReceivedInitialConfigurationsEvent, RECEIVED_INITIAL_CONFIGURATION
} from "../../events/ConfigurationEvents";
import {put, select, take, call} from 'redux-saga/effects'
import {selectConfigurationState} from "../../reducers";

/**
 * Gets the configurations from the backend to know what authorization server to talk to.
 */
export function* initialConfigurationSaga() {
  try {
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

export function* initialConfigurationResponseSaga(){
  const initialConfigurations = yield initialConfigurationFetchSaga();
  yield put(createFoundInitialConfigurationsEvent(initialConfigurations));
}
