import {selectActivityState} from "../../reducers";
import {put, select, take} from 'redux-saga/effects'
import type {ActivityState} from "../../reducers/ActivityReducer";
import {createInitializedPomodoroEvent} from "../../events/ActivityEvents";
import {INITIALIZED_APPLICATION} from "../../events/ApplicationLifecycleEvents";

export const ONE_DAY = 24 * 60 * 60 * 1000;

export function* pomodoroActivityInitializationSaga() {
  yield take(INITIALIZED_APPLICATION);
  const {completedPomodoro}: ActivityState = yield select(selectActivityState);
  const meow = new Date().valueOf();
  const todaysDay = (meow / ONE_DAY);
  const rememberedDay = Math.floor((completedPomodoro.dateCounted / ONE_DAY));
  if(todaysDay !== rememberedDay){
    yield put(createInitializedPomodoroEvent({
      dateCounted: meow,
      count: 0,
    }))
  }

}
