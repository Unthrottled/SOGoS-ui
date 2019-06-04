import {createStartedActivityEvent} from "../../events/ActivityEvents";
import uuid from "uuid/v4";
import {registerActivitySaga} from "./RegisterActivitySaga";

export function* activityLogoutSaga() {
  yield registerActivitySaga(createStartedActivityEvent({
    name: "LOGGED_OFF",
    uuid: uuid()
  }))
}
