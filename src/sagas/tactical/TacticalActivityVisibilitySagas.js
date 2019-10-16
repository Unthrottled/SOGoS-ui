import {call, put, select} from 'redux-saga/effects'
import type {TacticalActivity} from "../../types/TacticalModels";
import {createUpdatedTacticalActivityEvent} from "../../events/TacticalEvents";


export function* tacticalActivityHiddenSaga({payload}) {
  const tacticalActivity: TacticalActivity = {
    ...payload,
    hidden: true,
  };

  yield put(createUpdatedTacticalActivityEvent(tacticalActivity));
}
export function* tacticalActivityShownSaga({payload}) {

  const tacticalActivity: TacticalActivity = {
    ...payload,
    hidden: false,
  };

  yield put(createUpdatedTacticalActivityEvent(tacticalActivity));
}
