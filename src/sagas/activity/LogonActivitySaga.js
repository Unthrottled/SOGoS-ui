import {LOGGED_ON} from "../../events/SecurityEvents";
import {RECEIVED_USER} from "../../events/UserEvents";
import {createStartedActivityEvent} from "../../events/ActivityEvents";
import uuid from "uuid/v4";
import {all, call, take} from 'redux-saga/effects'
import {registerActivitySaga} from "./RegisterActivitySaga";

export const LOGGED_ON_ACTIVITY_NAME = "LOGGED_ON";
export function* activityLogonSaga() {
  yield all([
    take(LOGGED_ON),
    take(RECEIVED_USER),
  ]);
  yield call(registerActivitySaga, createStartedActivityEvent({
    name: LOGGED_ON_ACTIVITY_NAME,
    uuid: uuid(),
  }));
}
