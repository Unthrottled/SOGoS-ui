import {all, call, put, take, takeEvery} from "@redux-saga/core/effects";
import {performGet, performOpenGet, performPost} from "./APISagas";
import {LOGGED_ON} from "../events/SecurityEvents";
import {RECEIVED_USER} from "../events/UserEvents";
import {
  createFailureToRegisterPomodoroSettingsEvent, createRegisteredPomodoroSettingsEvent,
  createUpdatedPomodoroSettingsEvent,
  UPDATED_POMODORO_SETTINGS
} from "../events/TacticalEvents";
import {delayWork} from "./activity/CurrentActivitySaga";
import {createFailureToRegisterStartEvent, createRegisteredStartEvent} from "../events/ActivityEvents";
import {ACTIVITY_URL, activityCacheSaga} from "./activity/RegisterActivitySaga";

const POMODORO_API = '/api/tactical/pomodoro/settings';

function* fetchSettings() {
  try {
    const {data} = yield call(performGet, POMODORO_API);
    yield put(createUpdatedPomodoroSettingsEvent(data));
  } catch (e) {
    yield call(delayWork);
    yield call(fetchSettings);
  }
}

function* initializeTacticalSettings() {
  yield take(RECEIVED_USER);
  yield call(fetchSettings);
}

function* watchForSettingsUpdates() {
  yield takeEvery(UPDATED_POMODORO_SETTINGS, updatePomodoroSaga)
}

function* updatePomodoroSaga({payload}){
  try {
    yield call(performPost, POMODORO_API, payload);
    yield put(createRegisteredPomodoroSettingsEvent(payload));
  } catch (error) {
    yield put(createFailureToRegisterPomodoroSettingsEvent({
      error,
      payload
    }));
    // todo: cache if offline
    // yield call(activityCacheSaga, activity);
  }
}


export default function* rootSaga() {
  yield all([
    initializeTacticalSettings(),
    watchForSettingsUpdates(),
  ]);
}