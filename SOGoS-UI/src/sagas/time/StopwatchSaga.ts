import {call, delay, put, race, select} from 'redux-saga/effects'
import {waitForCurrentActivity} from "./SandsOfTimeSaga";
import {activitiesEqual, Activity} from "../../types/ActivityTypes";
import {selectActivityState} from "../../reducers";
import {createTimeIncrementEvent, createTimeSetEvent} from "../../events/TimeEvents";

export const getTime = (antecedenceTime: number) => Math.floor((new Date().getTime() - antecedenceTime || 0) / 1000);

// todo: on focus update time.

export function* stopWatchSaga(activityThatStartedThis: Activity) {
  yield put(createTimeSetEvent(
    getTime(activityThatStartedThis.content.workStartedWomboCombo ||
    activityThatStartedThis.antecedenceTime))
  );

  let shouldKeepTiming: boolean = false;
  do {
    const before = new Date().valueOf();
    // check to see if current activity is same because could have changed while moving to this next iteration
    const {currentActivity} = yield select(selectActivityState);
    const areActivitiesSame = activitiesEqual(currentActivity, activityThatStartedThis);
    if (areActivitiesSame) {
      yield put(createTimeIncrementEvent());
      const after = new Date().valueOf();
      const waitFor = 1000 - (after - before);
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
