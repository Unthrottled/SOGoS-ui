import {performPost} from "../APISagas";
import {createFailureToRegisterStartEvent, createRegisteredStartEvent} from "../../events/ActivityEvents";
import {call, put} from 'redux-saga/effects'

export function* registerActivitySaga({payload: activity}) {
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
