import {all, call, put, takeEvery} from 'redux-saga/effects'
import {performPost} from "./APISagas";
import {
  createFailureToRegisterStartEvent,
  createRegisteredStartEvent,
  STARTED_ACTIVITY
} from "../events/ActivityEvents";

export function* startActivitySaga({payload: activity}) {
  try {
    yield call(performPost, './api/activity/start', activity);
    yield put(createRegisteredStartEvent(activity));
  } catch (error) {
    // todo: handle registry failures.
    yield put(createFailureToRegisterStartEvent({
      error,
      activity
    }));
  }
}

function* listenToActivityEvents() {
  yield takeEvery(STARTED_ACTIVITY, startActivitySaga)
}

export default function* rootSaga() {
  yield all([
    listenToActivityEvents(),
  ])
}
