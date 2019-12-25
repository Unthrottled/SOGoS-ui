import {startTimedActivity} from "../../actions/ActivityActions";
import {ActivityTimedType, ActivityType, RECOVERY} from "../../types/ActivityTypes";
import uuid from "uuid/v4";
import {createCompletedPomodoroEvent} from "../../events/ActivityEvents";
import omit from "lodash/omit";

export function* pomodoroSaga(){
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
