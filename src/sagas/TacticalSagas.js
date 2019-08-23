import {all, call, put, take} from "@redux-saga/core/effects";
import {performGet, performOpenGet} from "./APISagas";
import {LOGGED_ON} from "../events/SecurityEvents";
import {RECEIVED_USER} from "../events/UserEvents";
import {createUpdatedPomodoroSettingsEvent} from "../events/TacticalEvents";
import {delayWork} from "./activity/CurrentActivitySaga";

function* fetchSettings() {
  try {
    const {data} = yield call(performGet, '/api/tactical/pomodoro/settings');
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

export default function* rootSaga() {
  yield all([
    initializeTacticalSettings(),
  ]);
}