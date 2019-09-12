import {performGetWithoutSessionExtension} from "../APISagas";
import {
  createFoundPreviousActivityActivityEvent,
  createResumedStartedNonTimedActivityEvent,
  createResumedStartedTimedActivityEvent
} from "../../events/ActivityEvents";
import {call, delay, put, select, take} from 'redux-saga/effects'
import {RECEIVED_USER} from "../../events/UserEvents";
import {selectActivityState, selectNetworkState, selectSecurityState} from "../../reducers";
import {FOUND_WIFI} from "../../events/NetworkEvents";
import {isOnline} from "../NetworkSagas";
import {
  activitiesEqual,
  ActivityTimedType,
  ActivityType,
  getActivityType,
  getTimedType
} from "../../types/ActivityModels";
import {INITIALIZED_SECURITY} from "../../events/SecurityEvents";

export function* handleNewActivity(activity) {
  const isTimedActivity =
    getActivityType(activity) === ActivityType.ACTIVE &&
    getTimedType(activity) !== ActivityTimedType.NONE;
  if (isTimedActivity) {
    yield put(createResumedStartedTimedActivityEvent(activity));
  } else if(activity) {
    yield put(createResumedStartedNonTimedActivityEvent(activity));
  }
}

export const CURRENT_ACTIVITY_URL = '/api/activity/current';
export const PREVIOUS_ACTIVITY_URL = '/api/activity/previous';

export function* updateCurrentActivity(attempt: number = 10) {
  try {
    const {data: activity} = yield call(performGetWithoutSessionExtension, CURRENT_ACTIVITY_URL);
    const {currentActivity} = yield select(selectActivityState);
    if (!activitiesEqual(currentActivity, activity)) {
      yield call(handleNewActivity, activity);
    }
  } catch (error) {
    yield call(handleError, attempt)
  }
}

export function* updatePreviousActivity(attempt: number = 10) {
  try {
    const {data: activity} = yield call(performGetWithoutSessionExtension, PREVIOUS_ACTIVITY_URL);
    yield put(createFoundPreviousActivityActivityEvent(activity));
  } catch (error) {
    console.log('aww shit', error);
    yield call(handleError, attempt, updatePreviousActivity)
  }
}

export function* handleError(attempt: number, fundi = updateCurrentActivity) {
  const hasNetwork = yield call(isOnline);
  if (hasNetwork) {
    yield delay(Math.pow(2, attempt) + Math.floor(Math.random() * 1000));
    yield call(fundi, attempt < 13 ? attempt + 1 : 10)
  }
}

export const CURRENT_ACTIVITY_POLL_RATE = 1000;

export function* delayWork() {
  const globalState = yield select();
  const {isOnline} = selectNetworkState(globalState);
  const {isExpired} = selectSecurityState(globalState);
  if (isExpired) {
    yield take(INITIALIZED_SECURITY);// only going to happen after login, effective permablock
  } else if (isOnline) {
    yield delay(CURRENT_ACTIVITY_POLL_RATE);
  } else {
    yield take(FOUND_WIFI);
  }
}

export function* currentActivitySaga() {
  yield take(RECEIVED_USER);
  yield call(updatePreviousActivity);
  while (true) {
    yield call(updateCurrentActivity);
    yield call(delayWork);
  }
}
