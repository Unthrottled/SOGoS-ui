import {all, call, put, select, take, takeEvery} from "@redux-saga/core/effects";
import {performGet, performOpenGet, performPost} from "./APISagas";
import {LOGGED_ON} from "../events/SecurityEvents";
import {RECEIVED_USER} from "../events/UserEvents";
import {
  createCachedSettingsEvent,
  createFailureToRegisterPomodoroSettingsEvent, createRegisteredPomodoroSettingsEvent,
  createUpdatedPomodoroSettingsEvent,
  UPDATED_POMODORO_SETTINGS
} from "../events/TacticalEvents";
import {delayWork} from "./activity/CurrentActivitySaga";
import {
  createCachedActivityEvent, CREATED,
  createFailureToRegisterStartEvent,
  createRegisteredStartEvent
} from "../events/ActivityEvents";
import {ACTIVITY_URL, activityCacheSaga} from "./activity/RegisterActivitySaga";
import {isOnline} from "./NetworkSagas";
import {selectUserState} from "../reducers";

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

//
export function* settingsCacheSaga(settings) {
  const {information: {guid}} = yield select(selectUserState);
  yield put(createCachedSettingsEvent({
    cachedSettings: {
      settings,
      uploadType: CREATED,
    },
    userGUID: guid,
  }))
}

function* updatePomodoroSaga({payload}){
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