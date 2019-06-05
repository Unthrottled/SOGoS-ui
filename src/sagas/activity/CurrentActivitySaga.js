import {performGet} from "../APISagas";
import {ActivityTimedType, createResumedStartedTimedActivityEvent} from "../../events/ActivityEvents";
import {call, put} from 'redux-saga/effects'


//todo: wrap activity in Activity function that has methods like deez.
const getTimedType = activity => activity.content.timedType || ActivityTimedType.NONE;

export function* currentActivitySaga() {
  try {
    const {data: activity} = yield call(performGet, './api/activity/current');
    if(getTimedType(activity) !== ActivityTimedType.NONE) {
      yield put(createResumedStartedTimedActivityEvent(activity));
    }
  } catch (error) {

  }
}
