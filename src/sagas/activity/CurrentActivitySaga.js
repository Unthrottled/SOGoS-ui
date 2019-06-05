import {performGet} from "../APISagas";
import {
  ActivityTimedType,
  ActivityType,
  createResumedStartedNonTimedActivityEvent,
  createResumedStartedTimedActivityEvent
} from "../../events/ActivityEvents";
import {call, delay, put, select, take} from 'redux-saga/effects'
import {RECEIVED_USER} from "../../events/UserEvents";
import {selectActivityState} from "../../reducers";


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

function* updateCurrentActivity() {
  try {
    const {data: activity} = yield call(performGet, './api/activity/current');
    const {currentActivity} = yield select(selectActivityState);
    if (!activitiesEqual(currentActivity, activity)) {
      yield handleNewActivity(activity);
    }
  } catch (error) {

  }
}

export function* currentActivitySaga() {
  yield take(RECEIVED_USER);
  while (true) {
    yield updateCurrentActivity();
    yield delay(1000);
  }
}
