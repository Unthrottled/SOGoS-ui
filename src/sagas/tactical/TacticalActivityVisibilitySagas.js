import {call, put, select} from 'redux-saga/effects'
import type {TacticalActivity} from "../../types/TacticalModels";
import {
  createArchivedTacticalActivityEvent,
  createRestoredTacticalActivityEvent,
  createUpdatedTacticalActivityEvent
} from "../../events/TacticalEvents";


export function* tacticalActivityHiddenSaga({payload}) {
  const tacticalActivity: TacticalActivity = {
    ...payload,
    hidden: true,
  };
  delete tacticalActivity.rank;
  yield put(createUpdatedTacticalActivityEvent(tacticalActivity));
  yield put(createArchivedTacticalActivityEvent(tacticalActivity));
}
export function* tacticalActivityShownSaga({payload}) {

  const tacticalActivity: TacticalActivity = {
    ...payload,
    hidden: false,
  };
  yield put(createUpdatedTacticalActivityEvent(tacticalActivity));
  yield put(createRestoredTacticalActivityEvent(tacticalActivity));
}
