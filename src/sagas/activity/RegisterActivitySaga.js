import {performPost} from "../APISagas";
import {
  createCachedActivityEvent,
  createFailureToRegisterStartEvent,
  createRegisteredStartEvent
} from "../../events/ActivityEvents";
import {call, put, select} from 'redux-saga/effects'
import {isOnline} from "../NetworkSagas";
import {selectUserState} from "../../reducers";

export function* registerActivitySaga(action) {
  const {payload: activity} = action;
  const onlineStatus = yield call(isOnline);
  if (onlineStatus) {
    yield activityUploadSaga(activity);
  } else {
    yield activityCacheSaga(activity);
  }
}

export function* activityUploadSaga(activity) {
  try {
    yield call(performPost, './api/activity', activity);
    yield put(createRegisteredStartEvent(activity));
  } catch (error) {
    // todo: handle registry failures.
    yield put(createFailureToRegisterStartEvent({
      error,
      activity
    }));
    yield activityCacheSaga(activity);
  }
}

export function* activityCacheSaga(activity) {
  const {information: {guid}} = yield select(selectUserState);
  yield put(createCachedActivityEvent({
    activity,
    userGUID: guid,
  }))
}
