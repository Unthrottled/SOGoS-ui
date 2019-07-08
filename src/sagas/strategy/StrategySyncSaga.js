import {call, put, select} from 'redux-saga/effects'
import {performPost} from "../APISagas";
import {selectStrategyState, selectUserState} from "../../reducers";
import {createSyncedObjectivesEvent} from "../../events/StrategyEvents";

export const BULK_OBJECTIVE_UPLOAD_URL = '/api/strategy/objectives/bulk';

export function* strategySyncSaga() {
  const globalState = yield select();
  const {information: {guid}} = selectUserState(globalState);
  const {cache} = selectStrategyState(globalState);
  console.log(cache);
  if (guid && cache && cache[guid]) {
    try {
      yield call(performPost, BULK_OBJECTIVE_UPLOAD_URL, cache[guid]);
      yield put(createSyncedObjectivesEvent(guid))
    } catch (e) {
      // todo: handle non-sychage
    }
  }
}
