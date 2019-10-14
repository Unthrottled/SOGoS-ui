import {call, put, select} from 'redux-saga/effects'
import {isOnline} from "../NetworkSagas";
import {performDelete, performPost, performPut} from "../APISagas";
import {selectUserState} from "../../reducers";
import {COMPLETED, CREATED, DELETED, UPDATED} from "../../events/ActivityEvents";
import {createCachedDataEvent} from "../../events/UserEvents";
import type {CachedTacticalActivity, TacticalActivity} from "../../types/TacticalModels";
import {createCachedTacticalActivityEvent, createSyncedTacticalActivityEvent} from "../../events/TacticalEvents";

export function* activityCreationSaga({payload}) {
  yield call(activityAPIInteractionSaga, payload, activityCreateSaga, activityUploadToCached);
}

export function* activityChangesSaga({payload}) {
  yield call(activityAPIInteractionSaga, payload, activityUpdateSaga, activityUpdateToCached);
}

export function* activityRankSaga({payload}){

}

export function* activityTerminationSaga({payload}) {
  yield call(activityAPIInteractionSaga, payload, activityDeleteSaga, activityDeleteToCached);
}

export function* activityCompletionSaga({payload}) {
  yield call(activityAPIInteractionSaga, payload, activityCompleteSaga, activityCompleteToCached);
}

export function* activityCreateSaga(activity: TacticalActivity) {
  yield call(activityUploadSaga, activity, performPost, activityUploadToCached);
}

export function* activityUpdateSaga(activity: TacticalActivity) {
  yield call(activityUploadSaga, activity, performPut, activityUpdateToCached);
}

export function* activityDeleteSaga(activity: TacticalActivity) {
  yield call(activityUploadSaga, activity, performDelete, activityDeleteToCached);
}

export function* activityCompleteSaga(activity: TacticalActivity) {
  yield call(activityUploadSaga, activity, performPost, activityCompleteToCached,
    (_activity: TacticalActivity) =>
      `${TACTICAL_ACTIVITIES_URL}/${_activity.id}/complete`);
}

export const activityUploadToCached: (TacticalActivity) => CachedTacticalActivity = activity => ({
  activity,
  uploadType: CREATED,
});

export const activityUpdateToCached: (TacticalActivity) => CachedTacticalActivity = activity => ({
  activity,
  uploadType: UPDATED,
});

export const activityDeleteToCached: (TacticalActivity) => CachedTacticalActivity = activity => ({
  activity,
  uploadType: DELETED,
});

export const activityCompleteToCached: (TacticalActivity) => CachedTacticalActivity = activity => ({
  activity,
  uploadType: COMPLETED,
});

export function* activityAPIInteractionSaga(activity: TacticalActivity,
                                             activitySaga,
                                             cachedTacticalActivityFunction: (TacticalActivity)=>CachedTacticalActivity) {
  const onlineStatus = yield call(isOnline);
  if (onlineStatus) {
    yield call(activitySaga, activity)
  } else {
    yield call(cacheTacticalActivitySaga, cachedTacticalActivityFunction(activity))
  }
}

export const TACTICAL_ACTIVITIES_URL = `/api/tactical/activity`;

export function* activityUploadSaga(activity: TacticalActivity,
                                     apiAction,
                                     cachingFunction: (TacticalActivity) => CachedTacticalActivity,
                                     urlFunction: (TacticalActivity)=> string = __ => TACTICAL_ACTIVITIES_URL) {
  try {
    yield call(apiAction, urlFunction(activity), activity);
    yield put(createSyncedTacticalActivityEvent(activity))
  } catch (e) {
    yield call(cacheTacticalActivitySaga, cachingFunction(activity))
  }
}

export function* cacheTacticalActivitySaga(cachedActivity: CachedTacticalActivity) {
  const {information: {guid}} = yield select(selectUserState);
  yield put(createCachedTacticalActivityEvent({
    userGUID: guid,
    cachedActivity,
  }));
  yield put(createCachedDataEvent());
}
