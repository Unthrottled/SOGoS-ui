import {performPost} from '../APISagas';
import {
  createCachedActivityEvent,
  createFailureToRegisterStartEvent,
  createRegisteredStartEvent,
} from '../../events/ActivityEvents';
import {call, put, select} from 'redux-saga/effects';
import {isOnline} from '../NetworkSagas';
import {selectSecurityState, selectUserState} from '../../reducers';
import {Activity} from '../../types/ActivityTypes';
import {createCachedDataEvent} from '../../events/UserEvents';
import {PayloadEvent} from '../../events/Event';
import {EventTypes} from '../../types/EventTypes';
import {SecurityState} from "../../reducers/SecurityReducer";

export function* registerActivitySaga(action: PayloadEvent<Activity>) {
  const {readOnly}: SecurityState = yield select(selectSecurityState);
  if (!readOnly) {
    const {payload: activity} = action;
    const onlineStatus = yield call(isOnline);
    if (onlineStatus) {
      yield call(activityUploadSaga, activity);
    } else {
      yield call(activityCacheSaga, activity);
    }
  }
}

export const ACTIVITY_URL = '/activity';

export function isNotUnAuthorized(error: any) {
  return !error.message || error.message.indexOf('403') < 0;
}

export function* activityUploadSaga(activity: Activity) {
  try {
    yield call(performPost, ACTIVITY_URL, activity);
    yield put(createRegisteredStartEvent(activity));
  } catch (error) {
    yield put(
      createFailureToRegisterStartEvent({
        error,
        activity,
      }),
    );
    if (isNotUnAuthorized(error)) {
      yield call(activityCacheSaga, activity);
    }
  }
}

export function* activityCacheSaga(activity: Activity) {
  const {
    information: {guid},
  } = yield select(selectUserState);
  yield put(
    createCachedActivityEvent({
      cachedActivity: {
        activity,
        uploadType: EventTypes.CREATED,
      },
      userGUID: guid,
    }),
  );
  yield put(createCachedDataEvent());
}
