import {all, call, fork, put, take, takeEvery} from 'redux-saga/effects'
import {performGet, performPost} from "./APISagas";
import {
  createFailureToRegisterStartEvent,
  createRegisteredStartEvent,
  createResumedStartedTimedActivityEvent,
  createStartedActivityEvent,
  STARTED_ACTIVITY
} from "../events/ActivityEvents";
import {LOGGED_ON} from "../events/SecurityEvents";
import uuid from 'uuid/v4';
import {RECEIVED_USER} from "../events/UserEvents";

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
  yield all([
    take(LOGGED_ON),
    take(RECEIVED_USER),
  ]);
  yield startActivitySaga(createStartedActivityEvent({
    name: "LOGGED_ON",
    uuid: uuid(),
  }));
}

export function* currentActivitySaga() {
  try {
    const {data: activity} = yield call(performGet, './api/activity/current');
    yield put(createResumedStartedTimedActivityEvent(activity));
  } catch (error) {

  }
}

export function* activityLogoutSaga() {
  yield startActivitySaga(createStartedActivityEvent({
    name: "LOGGED_OFF",
    uuid: uuid()
  }))
}

function* listenToActivityEvents() {
  yield takeEvery(STARTED_ACTIVITY, startActivitySaga);
  yield fork(activityLogonSaga);
  yield takeEvery(RECEIVED_USER, currentActivitySaga);
}

export default function* rootSaga() {
  yield all([
    listenToActivityEvents(),
  ])
}
