import {
  CACHED_ACTIVITY,
  RESUMED_NON_TIMED_ACTIVITY,
  RESUMED_TIMED_ACTIVITY,
  STARTED_NON_TIMED_ACTIVITY,
  STARTED_TIMED_ACTIVITY, SYNCED_ACTIVITIES
} from "../../events/ActivityEvents";
import activityReducer, {INITIAL_ACTIVITY_STATE} from "../../reducers/ActivityReducer";
import StrategyReducer from "../../reducers/StrategyReducer";
import {CACHED_OBJECTIVE, FOUND_OBJECTIVES, SYNCED_OBJECTIVES, UPDATED_OBJECTIVE} from "../../events/StrategyEvents";
import type {StrategyState} from "../../reducers/StrategyReducer";

Array.prototype.flatMap = function(toConcat){
  return this
    .map(a=>toConcat(a))
    .reduce((accum, a)=> accum.concat(a), []);
};

describe('Strategy Reducer', () => {
  it('should return overwritten state when given found objectives', async () => {
    const action = {
      type: FOUND_OBJECTIVES,
      payload: [
        {
          id: '.p.ek',
          valueStatement: 'To Do Cool stuff',
          keyResults: [
            {
              id: 'Sky_Dive',
              valueStatement: 'Sky Dive',
            },
            {
              id: 'Eat_Pant',
              valueStatement: 'Eat Pant',
            },
          ]
        },
        {
          id: 'hdkxhn',
          valueStatement: 'Become Death',
          keyResults: [
            {
              id: 'xktbsue',
              valueStatement: 'Destroy Worlds',
            },
            {
              id: 'cldcglkl',
              valueStatement: 'Harbinger of Doom',
            },
          ]
        },
      ]
    };
    const previousStrategyState : StrategyState = {
      cache : {
        'lemons': [],
      },
      objectives: {
        aoeu: {
          id: 'aoeu',
        }
      },
      keyResults: {
        xkxk: {
          id: 'hxkhuexn',
        }
      }
    };
    const strategyState = StrategyReducer(previousStrategyState, action);
    expect(strategyState).toEqual({
      "cache": {
        "lemons": []
      },
      "keyResults": {
        "Eat_Pant": {
          "id": "Eat_Pant",
          "valueStatement": "Eat Pant"
        },
        "Sky_Dive": {
          "id": "Sky_Dive",
          "valueStatement": "Sky Dive"
        },
        "cldcglkl": {
          "id": "cldcglkl",
          "valueStatement": "Harbinger of Doom"
        },
        "xktbsue": {
          "id": "xktbsue",
          "valueStatement": "Destroy Worlds"
        }
      },
      "objectives": {
        ".p.ek": {
          "id": ".p.ek",
          "keyResults": [
            {
              id: 'Sky_Dive',
              valueStatement: 'Sky Dive',
            },
            {
              id: 'Eat_Pant',
              valueStatement: 'Eat Pant',
            },
          ],
          "valueStatement": "To Do Cool stuff"
        },
        "hdkxhn": {
          "id": "hdkxhn",
          "keyResults": [
            {
              id: 'xktbsue',
              valueStatement: 'Destroy Worlds',
            },
            {
              id: 'cldcglkl',
              valueStatement: 'Harbinger of Doom',
            },
          ],
          "valueStatement": "Become Death"
        }
      }
    });
  });
  it('should return accumulated state when given found objectives', async () => {
    const action = {
      type: UPDATED_OBJECTIVE,
      payload:
        {
          id: 'Biggity Biggity',
          valueStatement: 'Bitch Boy, v2',
          keyResults: [
            {
              id: 'Halfway',
              valueStatement: 'Hauser, v2',
            },
            {
              id: 'Can\'t hear shit',
              valueStatement: 'Cause it keeps getting louder, v2',
            },
          ]
        },
    };
    const previousStrategyState : StrategyState = {
      "cache": {
        "lemons": []
      },
      "keyResults": {
        "Can't hear shit": {
          "id": "Can't hear shit",
          "valueStatement": "Cause it keeps getting louder"
        },
        "Eat_Pant": {
          "id": "Eat_Pant",
          "valueStatement": "Eat Pant"
        },
        "Halfway": {
          "id": "Halfway",
          "valueStatement": "Hauser"
        },
        "Sky_Dive": {
          "id": "Sky_Dive",
          "valueStatement": "Sky Dive"
        },
        "cldcglkl": {
          "id": "cldcglkl",
          "valueStatement": "Harbinger of Doom"
        },
        "xktbsue": {
          "id": "xktbsue",
          "valueStatement": "Destroy Worlds"
        }
      },
      "objectives": {
        ".p.ek": {
          "id": ".p.ek",
          "keyResults": [
            {
              id: 'Sky_Dive',
              valueStatement: 'Sky Dive',
            },
            {
              id: 'Eat_Pant',
              valueStatement: 'Eat Pant',
            },
          ],
          "valueStatement": "To Do Cool stuff"
        },
        "hdkxhn": {
          "id": "hdkxhn",
          "keyResults": [
            {
              id: 'xktbsue',
              valueStatement: 'Destroy Worlds',
            },
            {
              id: 'cldcglkl',
              valueStatement: 'Harbinger of Doom',
            },
          ],
          "valueStatement": "Become Death"
        }
      }
    };
    const strategyState = StrategyReducer(previousStrategyState, action);
    expect(strategyState).toEqual({
      "cache": {
        "lemons": []
      },
      "keyResults": {
        "Can't hear shit": {
          "id": "Can't hear shit",
          "valueStatement": "Cause it keeps getting louder, v2"
        },
        "Eat_Pant": {
          "id": "Eat_Pant",
          "valueStatement": "Eat Pant"
        },
        "Halfway": {
          "id": "Halfway",
          "valueStatement": "Hauser, v2"
        },
        "Sky_Dive": {
          "id": "Sky_Dive",
          "valueStatement": "Sky Dive"
        },
        "cldcglkl": {
          "id": "cldcglkl",
          "valueStatement": "Harbinger of Doom"
        },
        "xktbsue": {
          "id": "xktbsue",
          "valueStatement": "Destroy Worlds"
        }
      },
      "objectives": {
        "Biggity Biggity":         {
          id: 'Biggity Biggity',
          valueStatement: 'Bitch Boy, v2',
          keyResults: [
            {
              id: 'Halfway',
              valueStatement: 'Hauser, v2',
            },
            {
              id: 'Can\'t hear shit',
              valueStatement: 'Cause it keeps getting louder, v2',
            },
          ]
        },
        ".p.ek": {
          "id": ".p.ek",
          "keyResults": [
            {
              id: 'Sky_Dive',
              valueStatement: 'Sky Dive',
            },
            {
              id: 'Eat_Pant',
              valueStatement: 'Eat Pant',
            },
          ],
          "valueStatement": "To Do Cool stuff"
        },
        "hdkxhn": {
          "id": "hdkxhn",
          "keyResults": [
            {
              id: 'xktbsue',
              valueStatement: 'Destroy Worlds',
            },
            {
              id: 'cldcglkl',
              valueStatement: 'Harbinger of Doom',
            },
          ],
          "valueStatement": "Become Death"
        }
      }
    });
  });
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
