import {performGetWithoutSessionExtension} from '../APISagas';
import {
  createFoundPreviousActivityActivityEvent,
  createInitializedCurrentActivityEvent,
  createResumedStartedNonTimedActivityEvent,
  createResumedStartedTimedActivityEvent,
} from '../../events/ActivityEvents';
import {call, delay, put, race, select, take} from 'redux-saga/effects';
import {RECEIVED_PARTIAL_USER, RECEIVED_USER} from '../../events/UserEvents';
import {selectActivityState, selectNetworkState, selectSecurityState,} from '../../reducers';
import {FOUND_WIFI} from '../../events/NetworkEvents';
import {isOnline} from '../NetworkSagas';
import {
  activitiesEqual,
  Activity,
  ActivityTimedType,
  ActivityType,
  getActivityType,
  getTimedType,
} from '../../types/ActivityTypes';
import {INITIALIZED_SECURITY} from '../../events/SecurityEvents';

export const isTimedActivity = (activity: Activity) =>
  getActivityType(activity) === ActivityType.ACTIVE &&
  getTimedType(activity) !== ActivityTimedType.NONE;

export function* handleNewActivity(activity: Activity) {
  const isTimed = isTimedActivity(activity);
  if (isTimed) {
    yield put(createResumedStartedTimedActivityEvent(activity));
  } else if (activity) {
    yield put(createResumedStartedNonTimedActivityEvent(activity));
  }
}

export const CURRENT_ACTIVITY_URL = '/activity/current';
export const PREVIOUS_ACTIVITY_URL = '/activity/previous';

export function* updateCurrentActivity(attempt: number = 10): any {
  try {
    const {data: activity} = yield call(
      performGetWithoutSessionExtension,
      CURRENT_ACTIVITY_URL,
    );
    const {currentActivity} = yield select(selectActivityState);
    if (!activitiesEqual(currentActivity, activity)) {
      yield call(handleNewActivity, activity);
      return {currentActivity, wasNew: true};
    }
    return {currentActivity, wasNew: false};
  } catch (error) {
    yield call(handleError, attempt);
  }
}

export function* updatePreviousActivity(attempt: number = 10) {
  try {
    const {data: activity} = yield call(
      performGetWithoutSessionExtension,
      PREVIOUS_ACTIVITY_URL,
    );
    yield put(createFoundPreviousActivityActivityEvent(activity));
  } catch (error) {
    if (error.response.status !== 404) {
      yield call(handleError, attempt, updatePreviousActivity);
    }
  }
}

export function* handleError(
  attempt: number,
  functionToRetry = updateCurrentActivity,
) {
  const hasNetwork = yield call(isOnline);
  if (hasNetwork) {
    yield delay(Math.pow(2, attempt) + Math.floor(Math.random() * 1000));
    yield call(functionToRetry, attempt < 13 ? attempt + 1 : 10);
  }
}

export const CURRENT_ACTIVITY_POLL_RATE = 5000;

export function* delayWork() {
  const globalState = yield select();
  const {isOnline: onlineStatus} = selectNetworkState(globalState);
  const {isExpired} = selectSecurityState(globalState);
  if (isExpired) {
    yield take(INITIALIZED_SECURITY); // only going to happen after login, effective permablock
  } else if (onlineStatus) {
    yield delay(CURRENT_ACTIVITY_POLL_RATE);
  } else {
    yield take(FOUND_WIFI);
  }
}

export function* currentActivitySaga() {
  const {partialUser}  = yield race({
    fullUser: take(RECEIVED_USER),
    partialUser: take(RECEIVED_PARTIAL_USER),
  });

  yield call(updatePreviousActivity);
  const {currentActivity, wasNew} = yield call(updateCurrentActivity);
  if (!wasNew) {
    yield put(createInitializedCurrentActivityEvent(currentActivity));
  }

  let isReadOnly = !!partialUser;
  if(isReadOnly) {
    do {
      yield call(updateCurrentActivity);
      yield call(delayWork);
      const {readOnly} = yield select(selectSecurityState)
      isReadOnly = readOnly;
    } while (isReadOnly)
  }
}
