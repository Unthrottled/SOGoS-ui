import {
  CACHED_ACTIVITY,
  RESUMED_NON_TIMED_ACTIVITY,
  RESUMED_TIMED_ACTIVITY,
  STARTED_NON_TIMED_ACTIVITY,
  STARTED_TIMED_ACTIVITY,
  SYNCED_ACTIVITIES
} from "../../events/ActivityEvents";
import activityReducer, {INITIAL_ACTIVITY_STATE} from "../../reducers/ActivityReducer";

describe('Activity Reducer', () => {
  it('should return expected state when give started timed activity', async () => {
    const action = {
      type: STARTED_TIMED_ACTIVITY,
      payload: 'foobar'
    };
    const activityState = activityReducer({
      ...INITIAL_ACTIVITY_STATE,
      currentActivity: 'steve'
    }, action);
    expect(activityState).toEqual({
      "cache": {},
      "currentActivity": "foobar",
      "previousActivity": "steve",
      "shouldTime": true
    });
  });
  it('should return expected state when give resumed timed activity', async () => {
    const action = {
      type: RESUMED_TIMED_ACTIVITY,
      payload: 'foobar'
    };
    const activityState = activityReducer({
      ...INITIAL_ACTIVITY_STATE,
      currentActivity: 'steve'
    }, action);
    expect(activityState).toEqual({
      "cache": {},
      "currentActivity": "foobar",
      "previousActivity": "steve",
      "shouldTime": true
    });
  });
  it('should return expected state when give started non timed activity', async () => {
    const action = {
      type: STARTED_NON_TIMED_ACTIVITY,
      payload: 'foobar'
    };
    const activityState = activityReducer({
      ...INITIAL_ACTIVITY_STATE,
      currentActivity: 'steve'
    }, action);
    expect(activityState).toEqual({
      "cache": {},
      "currentActivity": "foobar",
      "previousActivity": "steve",
      "shouldTime": false
    });
  });
  it('should return expected state when give resumed non timed activity', async () => {
    const action = {
      type: RESUMED_NON_TIMED_ACTIVITY,
      payload: 'foobar'
    };
    const activityState = activityReducer({
      ...INITIAL_ACTIVITY_STATE,
      currentActivity: 'steve'
    }, action);
    expect(activityState).toEqual({
      "cache": {},
      "currentActivity": "foobar",
      "previousActivity": "steve",
      "shouldTime": false
    });
  });

  it('should return expected state when given first cached activity', async () => {
    const action = {
      type: CACHED_ACTIVITY,
      payload: {
        userGUID: 'coolio',
        cachedActivity: 'bruh'
      }
    };
    const activityState = activityReducer({
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
      type: CACHED_ACTIVITY,
      payload: {
        userGUID: 'coolio',
        cachedActivity: 'doth thou even hoist?'
      }
    };
    const activityState = activityReducer({
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
  it('should return expected cache state when given second cached activity', async () => {
    const action = {
      type: SYNCED_ACTIVITIES,
      payload: 'coolio'
    };
    const activityState = activityReducer({
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
      },
      "currentActivity": "steve",
      "previousActivity": {
        "content": {}
      },
      "shouldTime": false
    });
  });
});
