import {call, put, select} from 'redux-saga/effects'
import type {TacticalActivity} from "../../types/TacticalModels";
import {
  createArchivedTacticalActivityEvent,
  createReRankedTacticalActivitiesEvent,
  createRestoredTacticalActivityEvent,
  createUpdatedTacticalActivityEvent
} from "../../events/TacticalEvents";
import {selectTacticalActivityState} from "../../reducers";
import type {TacticalActivityState} from "../../reducers/TacticalReducer";
import {objectToArray} from "../../miscellanous/Tools";


export function* removalReRankSaga(tacticalActivity) {
  const tacticalActivityState: TacticalActivityState = yield select(selectTacticalActivityState);
  const allTacticalActivites = objectToArray(tacticalActivityState.activities);

  const changedActivities = allTacticalActivites.splice(tacticalActivity.rank + 1, allTacticalActivites.length)
    .map(activity => {
      --activity.rank;
      return activity
    });

  yield put(createReRankedTacticalActivitiesEvent(changedActivities));
}

export function* tacticalActivityHiddenSaga({payload}) {
  const tacticalActivity: TacticalActivity = {
    ...payload,
    hidden: true,
  };

  yield call(removalReRankSaga, tacticalActivity);

  delete tacticalActivity.rank;
  yield put(createUpdatedTacticalActivityEvent(tacticalActivity));
  yield put(createArchivedTacticalActivityEvent(tacticalActivity));
}

export function* tacticalActivityShownSaga({payload}) {

  const tacticalActivity: TacticalActivity = {
    ...payload,
    hidden: false,
  };
  delete tacticalActivity.rank;
  yield put(createUpdatedTacticalActivityEvent(tacticalActivity));
  yield put(createRestoredTacticalActivityEvent(tacticalActivity));
}
