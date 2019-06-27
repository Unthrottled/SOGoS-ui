import {all, call, put, takeEvery} from 'redux-saga/effects'
import {performPost} from "./APISagas";
import {CREATED_OBJECTIVE, createSyncedObjectiveEvent} from "../events/StrategyEvents";

export function* objectiveCreationSaga({payload}) {
  try {
    const data = yield call(performPost, `/api/strategy/objectives`, payload);
    yield put(createSyncedObjectiveEvent(data))
  } catch (e) {
    //todo: handle unable to save objective
  }
}

function* listenToActivityEvents() {
  yield takeEvery(CREATED_OBJECTIVE, objectiveCreationSaga);
}

export default function* StrategySagas() {
  yield all([
    listenToActivityEvents(),
  ])
}
