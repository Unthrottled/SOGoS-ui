import {all, call, fork, put, select, take, takeEvery} from "@redux-saga/core/effects";
import {performGet, performPost} from "./APISagas";
import {createCachedDataEvent, createSyncedDataEvent, RECEIVED_USER, REQUESTED_SYNC} from "../events/UserEvents";
import {
  createCachedSettingsEvent,
  createFailureToRegisterPomodoroSettingsEvent,
  createRegisteredPomodoroSettingsEvent,
  createSyncedSettingsEvent,
  createUpdatedPomodoroSettingsEvent,
  UPDATED_POMODORO_SETTINGS, VIEWED_SETTINGS
} from "../events/TacticalEvents";
import {delayWork} from "./activity/CurrentActivitySaga";
import {isOnline} from "./NetworkSagas";
import {selectTacticalState, selectUserState} from "../reducers";
import {FOUND_WIFI} from "../events/NetworkEvents";

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

function* settingsSyncSaga() {
  const globalState = yield select();
  const {information: {guid}} = selectUserState(globalState);
  const {cache} = selectTacticalState(globalState);
  if (guid && cache && cache[guid]) {
    try {
      yield call(performPost, POMODORO_API, cache[guid]);
      yield put(createSyncedSettingsEvent(guid));
      yield put(createSyncedDataEvent());
    } catch (e) {
      // todo: handle non-sychage
    }
  }
}

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

export function* settingsCacheSaga(settings) {
  const {information: {guid}} = yield select(selectUserState);
  yield put(createCachedSettingsEvent({
    cachedSettings: {
      ...settings,
    },
    userGUID: guid,
  }));
  yield put(createCachedDataEvent());
}

function* updatePomodoroSaga({payload}) {
  const onlineStatus = yield call(isOnline);
  if (onlineStatus) {
    yield call(settingsUploadSaga, payload)
  } else {
    yield call(settingsCacheSaga, payload)
  }
}

function* settingsUploadSaga(settings) {
  try {
    yield call(performPost, POMODORO_API, settings);
    yield put(createRegisteredPomodoroSettingsEvent(settings));
  } catch (error) {
    yield put(createFailureToRegisterPomodoroSettingsEvent({
      error,
      settings
    }));
    yield call(settingsCacheSaga, settings)
  }
}


export default function* rootSaga() {
  yield all([
    initializeTacticalSettings(),
    watchForSettingsUpdates(),
  ]);
}