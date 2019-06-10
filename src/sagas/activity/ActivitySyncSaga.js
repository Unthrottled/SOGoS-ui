import {select, call} from 'redux-saga/effects'
import {performPost} from "../APISagas";

export function* activitySyncSaga() {
  const {user:{information:{guid}}, activity :{cache}} = yield select();
  if(guid && cache[guid]){
    try{
      yield call(performPost, './api/activity/bulk', cache[guid]);
    } catch (e) {
      console.warn(e);
      // todo: handle non-sychage
    }
  }
}
