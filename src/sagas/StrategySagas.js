import {all, fork, take, takeEvery} from 'redux-saga/effects'
import {CREATED_OBJECTIVE, UPDATED_OBJECTIVE, VIEWED_OBJECTIVES} from "../events/StrategyEvents";
import {RECEIVED_USER} from "../events/UserEvents";
import {objectiveChangesSaga, objectiveCreationSaga} from "./strategy/ObjectiveCreationSagas";
import {objectiveHistoryFetchSaga, objectiveObservationSaga} from "./strategy/ObjectiveSagas";
import {FOUND_WIFI} from "../events/NetworkEvents";
import {strategySyncSaga} from "./strategy/StrategySyncSaga";

export function* objectiveObservationInitializationSaga() {
  const {foundUser} = yield all({
    askedForObjectives: take(VIEWED_OBJECTIVES),
    foundUser: take(RECEIVED_USER),
  });
  yield fork(objectiveHistoryFetchSaga, foundUser);
  yield takeEvery(VIEWED_OBJECTIVES, objectiveObservationSaga);
}

function* listenToActivityEvents() {
  yield takeEvery(CREATED_OBJECTIVE, objectiveCreationSaga);
  yield takeEvery(UPDATED_OBJECTIVE, objectiveChangesSaga);
  yield takeEvery(FOUND_WIFI, strategySyncSaga);
  yield takeEvery(RECEIVED_USER, strategySyncSaga);
  yield fork(objectiveObservationInitializationSaga);
}

export default function* StrategySagas() {
  yield all([
    listenToActivityEvents(),
  ])
}
