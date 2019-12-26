import {select} from "redux-saga/effects";
import {GlobalState, selectActivityState, selectTacticalState} from "../../reducers";
import {Activity} from "../../types/ActivityTypes";

const extractState = (state: GlobalState) => {
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

export function* pomodoroSaga(activityThatStartedThis: Activity) {
  const {
    shouldTime,
    currentActivity,
    previousActivity,
    pomodoroSettings,
    activities,
    numberOfCompletedPomodoro,
  } = yield select(extractState);
  const {antecedenceTime, content: {uuid: activityId, timedType, duration, name}} = currentActivity;
  // const startRecovery = (autoStart: boolean = false) => {
  //   dispetch(startTimedActivity({
  //     name: RECOVERY,
  //     type: ActivityType.ACTIVE,
  //     timedType: ActivityTimedType.TIMER,
  //     duration: (numberOfCompletedPomodoro + 1) % 4 === 0 ?
  //       pomodoroSettings.longRecoveryDuration :
  //       pomodoroSettings.shortRecoveryDuration,
  //     uuid: uuid(),
  //     ...(autoStart ? {
  //       autoStart: true
  //     } : {})
  //   }));
  // };
  //
  // const completedPomodoro = () => {
  //   if (name === RECOVERY) {
  //     resumePreviousActivity(true);
  //   } else {
  //     startRecovery(true);
  //     dispetch(createCompletedPomodoroEvent())
  //   }
  // };
  //
  // function resumePreviousActivity(autoStart: boolean = false) {
  //   dispetch(startTimedActivity({
  //     ...omit(previousActivity.content, ['autoStart']),
  //     ...(previousActivity.content.duration ? {
  //       duration: pomodoroSettings.loadDuration
  //     } : {}),
  //     ...(autoStart ? {
  //       autoStart: true
  //     } : {}),
  //     uuid: uuid(),
  //   }));
  // }
}
