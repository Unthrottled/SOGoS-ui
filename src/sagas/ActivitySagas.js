import {all, fork, takeEvery} from 'redux-saga/effects'
import {STARTED_ACTIVITY} from "../events/ActivityEvents";
import {activityLogonSaga} from "./activity/LogonActivitySaga";
import {currentActivitySaga} from "./activity/CurrentActivitySaga";
import {registerActivitySaga} from "./activity/RegisterActivitySaga";


function* listenToActivityEvents() {
  yield takeEvery(STARTED_ACTIVITY, registerActivitySaga);
  yield fork(activityLogonSaga);
  yield fork(currentActivitySaga);
}

export default function* rootSaga() {
  yield all([
    listenToActivityEvents(),
  ])
}
