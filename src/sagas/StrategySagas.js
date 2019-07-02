import {all, call, put, select, takeEvery} from 'redux-saga/effects'
import {performPost, performStreamedGet} from "./APISagas";
import {
  createCachedObjectiveEvent,
  CREATED_OBJECTIVE,
  createFetchedObjectivesEvent,
  createSyncedObjectiveEvent
} from "../events/StrategyEvents";
import {selectUserState} from "../reducers";
import type {Objective} from "../reducers/StrategyReducer";
import {isOnline} from "./NetworkSagas";
import {RECEIVED_USER} from "../events/UserEvents";

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

export function* objectiveHistoryFetchSaga() {
  try {
    const data = yield call(performStreamedGet, `/api/strategy/objectives`);
    yield put(createFetchedObjectivesEvent(data))
  } catch (e) {
    //todo: handle unable to get objectives
    console.log('shit broked', e);
  }
}

function* listenToActivityEvents() {
  yield takeEvery(CREATED_OBJECTIVE, objectiveCreationSaga);
  yield takeEvery(RECEIVED_USER, objectiveHistoryFetchSaga);
}

export default function* StrategySagas() {
  yield all([
    listenToActivityEvents(),
  ])
}
