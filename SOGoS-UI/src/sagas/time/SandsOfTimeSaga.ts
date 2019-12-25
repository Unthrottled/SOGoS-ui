import {GlobalState, selectActivityState, selectTacticalState} from "../../reducers";
import {select} from 'redux-saga/effects'
import {startTimedActivity} from "../../actions/ActivityActions";
import {
  ActivityTimedType,
  ActivityType,
  isActivityRecovery,
  isPausedActivity,
  RECOVERY
} from "../../types/ActivityTypes";
import uuid from "uuid/v4";
import {createCompletedPomodoroEvent} from "../../events/ActivityEvents";
import omit from "lodash/omit";

const extractState = (state : GlobalState) => {
  const {currentActivity, previousActivity, shouldTime, completedPomodoro: {count}} = selectActivityState(state);
  const {pomodoro: {settings}, activity: {activities}} = selectTacticalState(state);
  return {
    shouldTime,
    currentActivity,
    previousActivity,
    pomodoroSettings: settings,
    activities,
    numberOfCompletedPomodoro: count
  }
};


export function* sandsOfTimeSaga() {
  // Check to See if I need to start a timer
  const {
    shouldTime,
    currentActivity,
    previousActivity,
    pomodoroSettings,
    activities,
    numberOfCompletedPomodoro,
  } = yield select(extractState);
  const {antecedenceTime, content: {uuid: activityId, timedType, duration, name}} = currentActivity;

  const isTimer = timedType === ActivityTimedType.TIMER;
  const isRecovery = isActivityRecovery(currentActivity);
  const isTimeBarActivity = shouldTime && !isPausedActivity(currentActivity);
  if (isTimeBarActivity) {
    if(isTimer) {
      // pomo
    } else {
      // stopwatch
    }
  }
}

export function* nonSandsOfTimeSaga(){

}
