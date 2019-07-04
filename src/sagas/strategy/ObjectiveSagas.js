import {all, call, fork, put, select, take, takeEvery} from 'redux-saga/effects'
import {performStreamedGet} from "../APISagas";
import {createFetchedObjectivesEvent} from "../../events/StrategyEvents";


export function* objectiveHistoryFetchSaga() {
  try {
    const data = yield call(performStreamedGet, `/api/strategy/objectives`);
    yield put(createFetchedObjectivesEvent(data))
  } catch (e) {
    //todo: handle unable to get objectives
    console.log('shit broked', e);
  }
}

export function* objectiveObservationSaga() {
  yield call(console.log, 'Viewed Objectives Again');
}
