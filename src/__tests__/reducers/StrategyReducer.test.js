import {
  CACHED_ACTIVITY,
  RESUMED_NON_TIMED_ACTIVITY,
  RESUMED_TIMED_ACTIVITY,
  STARTED_NON_TIMED_ACTIVITY,
  STARTED_TIMED_ACTIVITY, SYNCED_ACTIVITIES
} from "../../events/ActivityEvents";
import activityReducer, {INITIAL_ACTIVITY_STATE} from "../../reducers/ActivityReducer";
import StrategyReducer from "../../reducers/StrategyReducer";
import {CACHED_OBJECTIVE, SYNCED_OBJECTIVES} from "../../events/StrategyEvents";

describe('Strategy Reducer', () => {
  it('should return expected state when given first cached activity', async () => {
    const action = {
      type: CACHED_OBJECTIVE,
      payload: {
        userGUID: 'coolio',
        objective: 'bruh'
      }
    };
    const activityState = StrategyReducer({
      ...INITIAL_ACTIVITY_STATE,
      currentActivity: 'steve'
    }, action);
    expect(activityState).toEqual({
      "cache": {
        "coolio": [
          "bruh"
        ]
      },
      "currentActivity": "steve",
      "previousActivity": {
        "content": {}
      },
      "shouldTime": false
    });
  });
  it('should return expected state when given second cached activity', async () => {
    const action = {
      type: CACHED_OBJECTIVE,
      payload: {
        userGUID: 'coolio',
        objective: 'doth thou even hoist?'
      }
    };
    const activityState = StrategyReducer({
      "cache": {
        "coolio": [
          "bruh"
        ]
      },
      "currentActivity": "steve",
      "previousActivity": {
        "content": {}
      },
      "shouldTime": false
    }, action);
    expect(activityState).toEqual({
      "cache": {
        "coolio": [
          "bruh", "doth thou even hoist?"
        ]
      },
      "currentActivity": "steve",
      "previousActivity": {
        "content": {}
      },
      "shouldTime": false
    });
  });
  it('should return expected state when given second cached activity', async () => {
    const action = {
      type: SYNCED_OBJECTIVES,
      payload: 'coolio'
    };
    const activityState = StrategyReducer({
      "cache": {
        "coolio": [
          "bruh"
        ]
      },
      "currentActivity": "steve",
      "previousActivity": {
        "content": {}
      },
      "shouldTime": false
    }, action);
    expect(activityState).toEqual({
      "cache": {
        "coolio": []
      },
      "currentActivity": "steve",
      "previousActivity": {
        "content": {}
      },
      "shouldTime": false
    });
  });
});
