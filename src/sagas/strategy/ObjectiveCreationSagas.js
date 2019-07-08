import {all, call, fork, put, select, take, takeEvery} from 'redux-saga/effects'
import {isOnline} from "../NetworkSagas";
import type {CachedObjective, Objective} from "../../types/StrategyModels";
import {performPost, performPut} from "../APISagas";
import {createCachedObjectiveEvent, createSyncedObjectiveEvent} from "../../events/StrategyEvents";
import {selectUserState} from "../../reducers";
import {CREATED, UPDATED} from "../../events/ActivityEvents";

export function* objectiveCreationSaga({payload}) {
  const onlineStatus = yield call(isOnline);
  if (onlineStatus) {
    yield call(objectiveCreateSaga, payload)
  } else {
    const cachedObjective: CachedObjective = {
      objective: payload,
      uploadType: CREATED,
    };
    yield call(cacheObjectiveSaga, cachedObjective)
  }
}

export function* objectiveCreateSaga(objective: Objective) {
  yield call(objectiveUploadSaga, objective, performPost);
}

//todo: sharing is caring
export function* objectiveChangesSaga({payload}) {
  const onlineStatus = yield call(isOnline);
  if (onlineStatus) {
    yield call(objectiveUpdateSaga, payload)
  } else {
    const cachedObjective: CachedObjective = {
      objective: payload,
      uploadType: UPDATED,
    };
    yield call(cacheObjectiveSaga, cachedObjective)
  }
}

export function* objectiveUpdateSaga(objective: Objective) {
  yield call(objectiveUploadSaga, objective, performPut);
}

export function* objectiveUploadSaga(objective: Objective, apiAction) {
  try {
    const data = yield call(apiAction, `/api/strategy/objectives`, objective);
    yield put(createSyncedObjectiveEvent(data))
  } catch (e) {
    yield call(cacheObjectiveSaga, objective)
  }
}

//todo: cache objective updates and creations when offline
export function* cacheObjectiveSaga(objective: CachedObjective) {
  const {information: {guid}} = yield select(selectUserState);
  yield put(createCachedObjectiveEvent({
    userGUID: guid,
    objective: objective,
  }))
}
