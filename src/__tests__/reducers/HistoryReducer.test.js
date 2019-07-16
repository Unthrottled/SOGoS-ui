import HistoryReducer, {INITIAL_HISTORY_STATE} from "../../reducers/HistoryReducer";
import {STARTED_ACTIVITY} from "../../events/ActivityEvents";

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
});
