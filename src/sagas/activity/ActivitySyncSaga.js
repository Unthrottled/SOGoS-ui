import {select, call, put} from 'redux-saga/effects'
import {performPost} from "../APISagas";
import {createSyncedActivitiesEvent} from "../../events/ActivityEvents";

export function* activitySyncSaga() {
  const {user:{information:{guid}}, activity :{cache}} = yield select();
  if(guid && cache[guid]){
    try{
      yield call(performPost, '/api/activity/bulk', cache[guid]);
      yield put(createSyncedActivitiesEvent(guid))
    } catch (e) {
      // todo: handle non-sychage
    }
  }
}
