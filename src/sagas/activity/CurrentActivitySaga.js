import {performGetWithoutSessionExtension} from "../APISagas";
import {
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

export function* handleError(attempt: number) {
  const hasNetwork = yield call(isOnline);
  if (hasNetwork) {
    yield delay(Math.pow(2, attempt) + Math.floor(Math.random() * 1000));
    yield call(updateCurrentActivity, attempt < 13 ? attempt + 1 : 10)
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
  // while (true) {
  //   yield call(updateCurrentActivity);
  //   yield call(delayWork);
  // } uuid:4ff4c234-81b3-4549-b6c4-39b3a7affc02
  // uuid:68096c97-7cc6-4e0b-90e8-5b4e7a7f5e7c
}
