import { performGetWithoutSessionExtension} from "../APISagas";
import {
  ActivityTimedType,
  ActivityType,
  createResumedStartedNonTimedActivityEvent,
  createResumedStartedTimedActivityEvent
} from "../../events/ActivityEvents";
import {call, delay, put, select, take} from 'redux-saga/effects'
import {RECEIVED_USER} from "../../events/UserEvents";
import {selectActivityState, selectNetworkState} from "../../reducers";
import {FOUND_WIFI} from "../../events/NetworkEvents";
import {isOnline} from "../NetworkSagas";


//todo: wrap activity in Activity function that has methods like deez.
const getActivityContent = activity => activity.content || {};
const getTimedType = activity => getActivityContent(activity).timedType || ActivityTimedType.NONE;
const getActivityType = activity => getActivityContent(activity).type || ActivityType.PASSIVE;
const getId = activity => getActivityContent(activity).uuid;

const activitiesEqual = (currentActivity, activity) => {
  const activityOneId = getId(currentActivity);
  return activityOneId === getId(activity) && !!activityOneId;
};

function* handleNewActivity(activity) {
  if(getActivityType(activity) === ActivityType.ACTIVE && getTimedType(activity) !== ActivityTimedType.NONE){
    yield put(createResumedStartedTimedActivityEvent(activity));
  } else {
    yield put(createResumedStartedNonTimedActivityEvent(activity));
  }
  return undefined;
}

function* updateCurrentActivity(attempt: number = 10) {
  try {
    const {data: activity} = yield call(performGetWithoutSessionExtension, './api/activity/current');
    const {currentActivity} = yield select(selectActivityState);
    if (!activitiesEqual(currentActivity, activity)) {
      yield handleNewActivity(activity);
    }
  } catch (error) {
    yield handleError(attempt)
  }
}

export function* handleError(attempt:number){
  const hasNetwork = yield isOnline();
  if(hasNetwork){
    yield delay(Math.pow(2, attempt) + Math.floor(Math.random() * 1000));
    yield updateCurrentActivity(attempt < 13 ? attempt + 1 : 10)
  }
}

export function* delayWork() {
  const{isOnline} = yield select(selectNetworkState);
  if(isOnline){
    yield delay(1000);
  } else {
    yield take(FOUND_WIFI);
  }
}

export function* currentActivitySaga() {
  yield take(RECEIVED_USER);
  while (true) {
    yield updateCurrentActivity();
    yield delayWork();
  }
}
