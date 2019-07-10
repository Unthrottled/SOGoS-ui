import {call, put, select} from 'redux-saga/effects'
import {isOnline} from "../NetworkSagas";
import type {CachedObjective, Objective} from "../../types/StrategyModels";
import {performDelete, performPost, performPut} from "../APISagas";
import {createCachedObjectiveEvent, createSyncedObjectiveEvent} from "../../events/StrategyEvents";
import {selectUserState} from "../../reducers";
import {CREATED, DELETED, UPDATED} from "../../events/ActivityEvents";

export function* objectiveCreationSaga({payload}) {
  yield call(objectiveAPIInteractionSaga, payload, objectiveCreateSaga, objectiveUploadToCached);
}

export function* objectiveChangesSaga({payload}) {
  yield call(objectiveAPIInteractionSaga, payload, objectiveUpdateSaga, objectiveUpdateToCached);
}

export function* objectiveTerminationSaga({payload}) {
  yield call(objectiveAPIInteractionSaga, payload, objectiveDeleteSaga, objectiveDeleteToCached);
}

export function* objectiveCreateSaga(objective: Objective) {
  yield call(objectiveUploadSaga, objective, performPost, objectiveUploadToCached);
}

export function* objectiveUpdateSaga(objective: Objective) {
  yield call(objectiveUploadSaga, objective, performPut, objectiveUpdateToCached);
}

export function* objectiveDeleteSaga(objective: Objective) {
  yield call(objectiveUploadSaga, objective, performDelete, objectiveDeleteToCached);
}

export const objectiveUploadToCached: (Objective) => CachedObjective = objective => ({
  objective,
  uploadType: CREATED,
});

export const objectiveUpdateToCached: (Objective) => CachedObjective = objective => ({
  objective,
  uploadType: UPDATED,
});

export const objectiveDeleteToCached: (Objective) => CachedObjective = objective => ({
  objective,
  uploadType: DELETED,
});

export function* objectiveAPIInteractionSaga(objective: Objective,
                                             objectiveSaga,
                                             cachedObjectiveFunction: (Objective)=>CachedObjective){
  const onlineStatus = yield call(isOnline);
  if (onlineStatus) {
    yield call(objectiveSaga, objective)
  } else {
    yield call(cacheObjectiveSaga, cachedObjectiveFunction(objective))
  }
}
export const OBJECTIVES_URL = `/api/strategy/objectives`;

export function* objectiveUploadSaga(objective: Objective, apiAction, cachingFunction: (Objective) => CachedObjective) {
  try {
    yield call(apiAction, OBJECTIVES_URL, objective);
    yield put(createSyncedObjectiveEvent(objective))
  } catch (e) {
    yield call(cacheObjectiveSaga, cachingFunction(objective))
  }
}

export function* cacheObjectiveSaga(objective: CachedObjective) {
  const {information: {guid}} = yield select(selectUserState);
  yield put(createCachedObjectiveEvent({
    userGUID: guid,
    objective,
  }))
}
