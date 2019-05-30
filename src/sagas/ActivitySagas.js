import {all, call, put, takeEvery} from 'redux-saga/effects'
import {performPost} from "./APISagas";
import {
  createFailureToRegisterStartEvent,
  createRegisteredStartEvent,
  STARTED_ACTIVITY
} from "../events/ActivityEvents";
import {LOGGED_ON} from "../events/SecurityEvents";

export function* startActivitySaga({payload: activity}) {
  try {
    yield call(performPost, './api/activity', activity);
    yield put(createRegisteredStartEvent(activity));
  } catch (error) {
    // todo: handle registry failures.
    yield put(createFailureToRegisterStartEvent({
      error,
      activity
    }));
  }
}

export function* activityLogonSaga() {
  yield put({
    type: 'REGISTERED_LOGON',
  })
}

export function* activityLogoutSaga() {
  yield put({
    type: 'REGISTERED_LOGOUT',
  })
}

function* listenToActivityEvents() {
  yield takeEvery(STARTED_ACTIVITY, startActivitySaga);
  yield takeEvery(LOGGED_ON, activityLogonSaga);
}

export default function* rootSaga() {
  yield all([
    listenToActivityEvents(),
  ])
}
