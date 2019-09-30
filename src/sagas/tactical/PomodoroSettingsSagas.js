import {call, put, select} from "@redux-saga/core/effects";
import {selectTacticalState, selectUserState} from "../../reducers";
import {
  createCachedSettingsEvent,
  createFailureToRegisterPomodoroSettingsEvent,
  createRegisteredPomodoroSettingsEvent,
  createSyncedSettingsEvent,
  createUpdatedPomodoroSettingsEvent
} from "../../events/TacticalEvents";
import {createCachedDataEvent, createSyncedDataEvent} from "../../events/UserEvents";
import {isOnline} from "../NetworkSagas";
import {performGet, performPost} from "../APISagas";
import {delayWork} from "../activity/CurrentActivitySaga";
import {createShowWarningNotificationEvent} from "../../events/MiscEvents";

export const POMODORO_API = '/api/tactical/pomodoro/settings';

export function* fetchSettings() {
  try {
    const {data} = yield call(performGet, POMODORO_API);
    yield put(createUpdatedPomodoroSettingsEvent(data));
  } catch (e) {
    yield call(delayWork);
    yield call(fetchSettings);
  }
}

export function* settingsSyncSaga() {
  const globalState = yield select();
  const {information: {guid}} = selectUserState(globalState);
  const {pomodoro: {cache}} = selectTacticalState(globalState);
  if (guid && cache && cache[guid]) {
    try {
      yield call(performPost, POMODORO_API, cache[guid]);
      yield put(createSyncedSettingsEvent(guid));
      yield put(createSyncedDataEvent());
    } catch (e) {
      yield put(createShowWarningNotificationEvent("Unable to sync settings! Try again later, please."))
    }
  }
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

export function* updatePomodoroSaga({payload}) {
  const onlineStatus = yield call(isOnline);
  if (onlineStatus) {
    yield call(settingsUploadSaga, payload)
  } else {
    yield call(settingsCacheSaga, payload)
  }
}

export function* settingsUploadSaga(settings) {
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
