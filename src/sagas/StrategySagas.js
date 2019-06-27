import {all, call, put, select, takeEvery} from 'redux-saga/effects'
import {performPost} from "./APISagas";
import {createCachedObjectiveEvent, CREATED_OBJECTIVE, createSyncedObjectiveEvent} from "../events/StrategyEvents";
import {selectUserState} from "../reducers";
import type {Objective} from "../reducers/StrategyReducer";
import {isOnline} from "./NetworkSagas";

export function* objectiveCreationSaga({payload}) {
  const onlineStatus = yield call(isOnline);
  if (onlineStatus) {
    yield call(objectiveUploadSaga, payload)
  } else {
    yield call(cacheObjectiveSaga, payload)
  }
}

export function* objectiveUploadSaga(objective: Objective) {
  try {
    const data = yield call(performPost, `/api/strategy/objectives`, objective);
    yield put(createSyncedObjectiveEvent(data))
  } catch (e) {
    yield call(cacheObjectiveSaga, objective)
  }
}

export function* cacheObjectiveSaga(objective: Objective) {
  const {information: {guid}} = yield select(selectUserState);
  yield put(createCachedObjectiveEvent({
    userGUID: guid,
    objective: objective,
  }))
}

function* listenToActivityEvents() {
  yield takeEvery(CREATED_OBJECTIVE, objectiveCreationSaga);
}

export default function* StrategySagas() {
  yield all([
    listenToActivityEvents(),
  ])
}
