import {GlobalState, selectActivityState} from "../../reducers";
import {call, fork, race, select, take} from 'redux-saga/effects'
import {ActivityTimedType, isPausedActivity} from "../../types/ActivityTypes";
import {INITIALIZED_CURRENT_ACTIVITY, STARTED_TIMED_ACTIVITY} from "../../events/ActivityEvents";
import {pomodoroSaga} from "./PomodoroSaga";
import {stopWatchSaga} from "./StopwatchSaga";

const extractState = (state: GlobalState) => {
  const {shouldTime} = selectActivityState(state);
  return {
    shouldTime,
  }
};

export function* sandsOfTimeSaga() {
  do {
    const currentActivity = yield call(waitForCurrentActivity);
    const {
      shouldTime,
    } = yield select(extractState);
    const {content: {timedType}} = currentActivity;
    const isTimer = timedType === ActivityTimedType.TIMER;
    const isTimeBarActivity = shouldTime && !isPausedActivity(currentActivity);
    if (isTimeBarActivity) {
      if (isTimer) {
        yield fork(pomodoroSaga, currentActivity);
      } else {
        yield fork(stopWatchSaga, currentActivity)
      }
    }
  } while (true);
}

export function* waitForCurrentActivity() {
  const {
    firstActivity,
    userActivity
  } = yield race({
    firstActivity: take(INITIALIZED_CURRENT_ACTIVITY),
    userActivity: take(STARTED_TIMED_ACTIVITY)
  });

  return firstActivity ? firstActivity.payload : userActivity.payload
}
