import {selectActivityState} from "../../reducers";
import {all, call, fork, put, select, take, takeEvery} from 'redux-saga/effects'
import type {ActivityState} from "../../reducers/ActivityReducer";
import {createInitializedPomodoroEvent} from "../../events/ActivityEvents";
import {INITIALIZED_APPLICATION} from "../../events/ApplicationLifecycleEvents";

const ONE_DAY = 24 * 60 * 60 * 1000;

export function* pomodoroActivityInitializationSaga() {
  yield take(INITIALIZED_APPLICATION);
  const {completedPomodoro}: ActivityState = yield select(selectActivityState);
  const meow = new Date().valueOf();
  const todaysDay = (meow / ONE_DAY) >>> 1;
  const rememberedDay = (completedPomodoro.dateCounted / ONE_DAY) >>> 1;
  if(todaysDay !== rememberedDay){
    yield put(createInitializedPomodoroEvent({
      dateCounted: meow,
      count: 0,
    }))
  }

}
