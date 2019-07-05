import {performPost} from "../APISagas";
import {
  CREATED,
  createCachedActivityEvent,
  createFailureToRegisterStartEvent,
  createRegisteredStartEvent
} from "../../events/ActivityEvents";
import {call, put, select} from 'redux-saga/effects'
import {isOnline} from "../NetworkSagas";
import {selectUserState} from "../../reducers";
import type {Activity} from "../../events/ActivityEvents";

export function* registerActivitySaga(action) {
  const {payload: activity} = action;
  const onlineStatus = yield call(isOnline);
  if (onlineStatus) {
    yield call(activityUploadSaga, activity);
  } else {
    yield call(activityCacheSaga, activity);
  }
}

export const ACTIVITY_URL = '/api/activity';

export function* activityUploadSaga(activity: Activity) {
  try {
    yield call(performPost, ACTIVITY_URL, activity);
    yield put(createRegisteredStartEvent(activity));
  } catch (error) {
    yield put(createFailureToRegisterStartEvent({
      error,
      activity
    }));
    yield call(activityCacheSaga, activity);
  }
}

export function* activityCacheSaga(activity: Activity) {
  const {information: {guid}} = yield select(selectUserState);
  yield put(createCachedActivityEvent({
    cachedActivity: {
      activity,
      uploadType: CREATED,
    },
    userGUID: guid,
  }))
}
