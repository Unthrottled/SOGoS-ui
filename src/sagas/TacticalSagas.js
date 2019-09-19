import {all, call, fork, take, takeEvery} from "@redux-saga/core/effects";
import {RECEIVED_USER, REQUESTED_SYNC} from "../events/UserEvents";
import {CREATED_ACTIVITY, DELETED_ACTIVITY, UPDATED_POMODORO_SETTINGS, VIEWED_SETTINGS} from "../events/TacticalEvents";
import {FOUND_WIFI} from "../events/NetworkEvents";
import {tacticalActivitySyncSaga} from "./tactical/TacticalActivitySyncSaga";
import {
  activityChangesSaga,
  activityCreationSaga,
  activityTerminationSaga
} from "./tactical/TacticalActivityCreationSagas";
import {UPDATED_OBJECTIVE} from "../events/StrategyEvents";
import {fetchSettings, settingsSyncSaga, updatePomodoroSaga} from "./tactical/PomodoroSettingsSagas";

function* initializeTacticalSettings() {
  yield take(RECEIVED_USER);
  yield call(fetchSettings);
  yield fork(settingsSyncSaga);
  yield takeEvery(FOUND_WIFI, settingsSyncSaga);
  yield takeEvery(REQUESTED_SYNC, settingsSyncSaga);
  yield takeEvery(VIEWED_SETTINGS, fetchSettings);
}

function* watchForSettingsUpdates() {
  yield takeEvery(UPDATED_POMODORO_SETTINGS, updatePomodoroSaga)
}

function* listenForTacticalEvents() {
  yield takeEvery(FOUND_WIFI, tacticalActivitySyncSaga);
  yield takeEvery(RECEIVED_USER, tacticalActivitySyncSaga);
  yield takeEvery(REQUESTED_SYNC, tacticalActivitySyncSaga);
  yield takeEvery(CREATED_ACTIVITY, activityCreationSaga);
  yield takeEvery(UPDATED_OBJECTIVE, activityChangesSaga);
  yield takeEvery(DELETED_ACTIVITY, activityTerminationSaga);
}

export default function* rootSaga() {
  yield all([
    initializeTacticalSettings(),
    listenForTacticalEvents(),
    watchForSettingsUpdates(),
  ]);
}
