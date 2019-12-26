import {call, delay, put, race, select} from 'redux-saga/effects'
import {waitForCurrentActivity} from "./SandsOfTimeSaga";
import {activitiesEqual, Activity} from "../../types/ActivityTypes";
import {selectActivityState} from "../../reducers";
import {createTimeIncrementEvent} from "../../events/TimeEvents";

// todo: on focus update time.

export function* stopWatchSaga(activityThatStartedThis: Activity) {
  console.log("finna busta nut, stopwatch");

  let shouldKeepTiming: boolean = false;

  do {
    const before = new Date().valueOf();
    yield put(createTimeIncrementEvent());
    // check to see if current activity is same because could have changed while moving to this next iteration
    const {currentActivity} = yield select(selectActivityState);
    const areActivitiesSame = activitiesEqual(currentActivity, activityThatStartedThis);
    if (areActivitiesSame) {
      const after = new Date().valueOf();
      const waitFor = 1000 - (after - before);
      console.log(waitFor);
      const {
        newCurrentActivity,
      } = yield race({
        currentActivity: call(waitForCurrentActivity),
        timeElapsed: delay(waitFor < 0 ? 0 : waitFor),
      });
      shouldKeepTiming = !newCurrentActivity;
    } else {
      shouldKeepTiming = false
    }
  } while (shouldKeepTiming)
}
