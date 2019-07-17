import HistoryReducer, {INITIAL_HISTORY_STATE} from "../../reducers/HistoryReducer";
import {RESUMED_NON_TIMED_ACTIVITY, RESUMED_TIMED_ACTIVITY, STARTED_ACTIVITY} from "../../events/ActivityEvents";
import {RECEIVED_HISTORY} from "../../events/HistoryEvents";

describe('History Reducer', () => {
  it('should return initial state when given nothing', async () => {
    const historyState = HistoryReducer();
    expect(historyState).toEqual(INITIAL_HISTORY_STATE);
  });
  it('should return expected state when given started activity action and initial state', async () => {
    const action = {
      type: STARTED_ACTIVITY,
      payload: 'NEW THING',
    };
    const historyState = HistoryReducer(INITIAL_HISTORY_STATE, action);
    expect(historyState).toEqual({
      activityFeed: [
        'NEW THING',
      ]
    });
  });
  it('should return expected state when given started activity action and some state', async () => {
    const action = {
      type: STARTED_ACTIVITY,
      payload: 'NEW THING',
    };
    const historyState = HistoryReducer({
      activityFeed: [
        'OLD THING',
      ]
    }, action);
    expect(historyState).toEqual({
      activityFeed: [
        'NEW THING',
        'OLD THING',
      ]
    });
  });
  it('should return expected state when given resumed timed activity action and some state', async () => {
    const action = {
      type: RESUMED_TIMED_ACTIVITY,
      payload: 'NEW THING',
    };
    const historyState = HistoryReducer({
      activityFeed: [
        'OLD THING',
      ]
    }, action);
    expect(historyState).toEqual({
      activityFeed: [
        'NEW THING',
        'OLD THING',
      ]
    });
  });
  it('should return expected state when given resumed non timed activity action and some state', async () => {
    const action = {
      type: RESUMED_NON_TIMED_ACTIVITY,
      payload: 'NEW THING',
    };
    const historyState = HistoryReducer({
      activityFeed: [
        'OLD THING',
      ]
    }, action);
    expect(historyState).toEqual({
      activityFeed: [
        'NEW THING',
        'OLD THING',
      ]
    });
  });
  it('should return expected state when given received history from backend action and some state', async () => {
    const action = {
      type: RECEIVED_HISTORY,
      payload: ['NEW THING1','NEW THING2','NEW THING3',],
    };
    const historyState = HistoryReducer({
      activityFeed: [
        'OLD THING',
      ]
    }, action);
    expect(historyState).toEqual({
      activityFeed: [
        'NEW THING1',
        'NEW THING2',
        'NEW THING3',
        'OLD THING',
      ]
    });
  });
});
