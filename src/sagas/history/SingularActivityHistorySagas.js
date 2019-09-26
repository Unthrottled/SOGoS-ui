import {put, call, select} from "@redux-saga/core/effects";
import type {Activity} from "../../types/ActivityModels";
import {selectHistoryState} from "../../reducers";
import type {HistoryState} from "../../reducers/HistoryReducer";
import {createUpdatedFullFeedEvent} from "../../events/HistoryEvents";


export function* apiBeforeCapstoneSaga({payload}){
  const activity: Activity = payload;
  const historyState: HistoryState = yield select(selectHistoryState);
  yield put(createUpdatedFullFeedEvent({
    activities: [
      ...historyState.fullFeed,
      activity
    ],
    between: {
      to: historyState.fullHistoryRange.to,
      from: activity.antecedenceTime,
    }
  }));
}

export function* addActivityAfter(activity) {
  const historyState: HistoryState = yield select(selectHistoryState);
  yield put(createUpdatedFullFeedEvent({
    activities: [
      activity,
      ...historyState.fullFeed
    ],
    between: {
      from: historyState.fullHistoryRange.from,
      to: activity.antecedenceTime,
    }
  }));
}

export function* apiAfterCapstoneSaga({payload}){
  const activity: Activity = payload;
  yield call(addActivityAfter, activity);
}

export function* currentActivityHistorySaga({payload}) {
  yield call(addActivityAfter, payload);
}
