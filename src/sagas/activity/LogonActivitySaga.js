import {LOGGED_ON} from "../../events/SecurityEvents";
import {RECEIVED_USER} from "../../events/UserEvents";
import {createStartedActivityEvent} from "../../events/ActivityEvents";
import uuid from "uuid/v4";
import {all, take} from 'redux-saga/effects'
import {registerActivitySaga} from "./RegisterActivitySaga";

export function* activityLogonSaga() {
  yield all([
    take(LOGGED_ON),
    take(RECEIVED_USER),
  ]);
  yield registerActivitySaga(createStartedActivityEvent({
    name: "LOGGED_ON",
    uuid: uuid(),
  }));
}
