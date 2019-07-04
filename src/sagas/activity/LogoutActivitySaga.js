import {createStartedActivityEvent} from "../../events/ActivityEvents";
import uuid from "uuid/v4";
import {registerActivitySaga} from "./RegisterActivitySaga";
import {call} from 'redux-saga/effects'

export const LOGGED_OFF_ACTIVITY_NAME = "LOGGED_OFF";

export function* activityLogoutSaga() {
  yield call(registerActivitySaga, createStartedActivityEvent({
    name: LOGGED_OFF_ACTIVITY_NAME,
    uuid: uuid()
  }));
}
