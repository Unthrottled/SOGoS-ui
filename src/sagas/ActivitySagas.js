import {all, call, put, takeEvery, fork, take} from 'redux-saga/effects'
import {performPost} from "./APISagas";
import {
  createFailureToRegisterStartEvent,
  createRegisteredStartEvent, createStartedActivityEvent,
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
    antecedenceTime: new Date().getTime(),
    content: {
      name: "LOGGED_ON",
      id: uuid()
    }
  }));
}

export function* activityLogoutSaga() {
  yield startActivitySaga(createStartedActivityEvent({
    antecedenceTime: new Date().getTime(),
    content: {
      name: "LOGGED_ON",
      id: uuid()
    }
  }))
}

function* listenToActivityEvents() {
  yield takeEvery(STARTED_ACTIVITY, startActivitySaga);
  yield fork(activityLogonSaga);
}

export default function* rootSaga() {
  yield all([
    listenToActivityEvents(),
  ])
}
