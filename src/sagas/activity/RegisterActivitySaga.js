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

export function* registerActivitySaga(action) {
  const {payload: activity} = action;
  const onlineStatus = yield call(isOnline);
  if (onlineStatus) {
    yield activityUploadSaga(activity);
  } else {
    yield activityStartCacheSaga(activity);
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
    yield activityStartCacheSaga(activity);
  }
}

export function* activityStartCacheSaga(activity) {
  const {information: {guid}} = yield select(selectUserState);
  yield put(createCachedActivityEvent({
    cachedActivity: {
      activity,
      uploadType: CREATED,
    },
    userGUID: guid,
  }))
}
