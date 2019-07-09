import {objectiveAPIInteractionSaga, objectiveUpdateSaga, objectiveUpdateToCached} from "./ObjectiveCreationSagas";
import {call, put, select} from 'redux-saga/effects'

export function* objectiveTerminationSaga({payload}) {
  yield call(console.log, 'finna bust a nut')
}
