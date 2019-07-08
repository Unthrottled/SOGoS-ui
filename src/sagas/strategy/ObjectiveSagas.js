import {call, put} from 'redux-saga/effects'
import {performStreamedGet} from "../APISagas";
import {createFetchedObjectivesEvent} from "../../events/StrategyEvents";

export const OBJECTIVES_URL = `/api/strategy/objectives`;

export function* objectiveHistoryFetchSaga() {
  try {
    const data = yield call(performStreamedGet, OBJECTIVES_URL);
    yield put(createFetchedObjectivesEvent(data))
  } catch (e) {
    //todo: handle unable to get objectives
    console.log('shit broked', e);
  }
}

export function* objectiveObservationSaga() {
  yield call(console.log, 'Viewed Objectives Again');
}
