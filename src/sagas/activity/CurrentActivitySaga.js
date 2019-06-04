import {performGet} from "../APISagas";
import {createResumedStartedTimedActivityEvent} from "../../events/ActivityEvents";
import {call, put} from 'redux-saga/effects'

export function* currentActivitySaga() {
  try {
    const {data: activity} = yield call(performGet, './api/activity/current');
    yield put(createResumedStartedTimedActivityEvent(activity));
  } catch (error) {

  }
}
