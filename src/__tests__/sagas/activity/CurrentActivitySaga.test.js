import { delay, call, take, put, select} from 'redux-saga/effects'
import sagaHelper from "redux-saga-testing";
import {activityLogonSaga, LOGGED_ON_ACTIVITY_NAME} from "../../../sagas/activity/LogonActivitySaga";
import {INITIALIZED_SECURITY, LOGGED_ON} from "../../../events/SecurityEvents";
import {RECEIVED_USER} from "../../../events/UserEvents";
import {registerActivitySaga} from "../../../sagas/activity/RegisterActivitySaga";
import {createStartedActivityEvent} from "../../../events/ActivityEvents";
import {
  CURRENT_ACTIVITY_POLL_RATE, CURRENT_ACTIVITY_URL,
  currentActivitySaga,
  delayWork, handleError, handleNewActivity,
  updateCurrentActivity
} from "../../../sagas/activity/CurrentActivitySaga";
import type {NetworkState} from "../../../reducers/NetworkReducer";
import type {SecurityState} from "../../../reducers/SecurityReducer";
import {FOUND_WIFI} from "../../../events/NetworkEvents";
import {isOnline} from "../../../sagas/NetworkSagas";
import {performGetWithoutSessionExtension} from "../../../sagas/APISagas";
import {selectActivityState} from "../../../reducers";
import type {Activity} from "../../../types/ActivityModels";

describe('Current Activity Sagas', () => {
  describe('currentActivitySaga', () => {
    describe('when run', () => {
      const it = sagaHelper(currentActivitySaga());
      it('should wait for user deetz', sagaEffect => {
        expect(sagaEffect).toEqual(take(RECEIVED_USER));
      });
      it('should update current activity', sagaEffect => {
        expect(sagaEffect).toEqual(call(updateCurrentActivity));
      });
      it('should delay', sagaEffect => {
        expect(sagaEffect).toEqual(call(delayWork));
      });
      //Repeat Forever
    });
  });
  describe('updateCurrentActivity', () => {
    describe('when given no parameters', () => {
      describe('and an error happens', () => {
        const it = sagaHelper(updateCurrentActivity());
        it('should try to get current activity and not extend the session', sagaEffect => {
          expect(sagaEffect).toEqual(call(performGetWithoutSessionExtension, CURRENT_ACTIVITY_URL));
          return new Error('Shit broked yo');
        });
        it('should handle the error', sagaEffect => {
          expect(sagaEffect).toEqual(call(handleError, 10))
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined()
        });
      });
      describe('and current activities are the same', () => {
        const it = sagaHelper(updateCurrentActivity());
        it('should try to get current activity and not extend the session', sagaEffect => {
          expect(sagaEffect).toEqual(call(performGetWithoutSessionExtension, CURRENT_ACTIVITY_URL));
          const activity: Activity = {
            content : {
              uuid: 'best activity'
            }
          };
          return {
            data: activity,
          };
        });
        it('should select current activity state', sagaEffect => {
          expect(sagaEffect).toEqual(select(selectActivityState));
          const activity: Activity = {
            content : {
              uuid: 'best activity'
            }
          };
          return {
            currentActivity: activity
          }
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined()
        });
      });
      describe('and current activities are not the same', () => {
        const it = sagaHelper(updateCurrentActivity());
        it('should try to get current activity and not extend the session', sagaEffect => {
          expect(sagaEffect).toEqual(call(performGetWithoutSessionExtension, CURRENT_ACTIVITY_URL));
          const activity: Activity = {
            content : {
              uuid: 'best activity'
            }
          };
          return {
            data: activity,
          };
        });
        it('should select current activity state', sagaEffect => {
          expect(sagaEffect).toEqual(select(selectActivityState));
          const activity: Activity = {
            content : {
              uuid: 'bustin'
            }
          };
          return {
            currentActivity: activity
          }
        });
        it('should dispatch new activity event', sagaEffect => {
          const activity: Activity = {
            content : {
              uuid: 'best activity'
            }
          };
          expect(sagaEffect).toEqual(call(handleNewActivity, activity))
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined()
        });
      });
      describe('and current activities are not the same missing id', () => {
        const it = sagaHelper(updateCurrentActivity());
        it('should try to get current activity and not extend the session', sagaEffect => {
          expect(sagaEffect).toEqual(call(performGetWithoutSessionExtension, CURRENT_ACTIVITY_URL));
          const activity: Activity = {
            content : {
              uuid: 'best activity'
            }
          };
          return {
            data: activity,
          };
        });
        it('should select current activity state', sagaEffect => {
          expect(sagaEffect).toEqual(select(selectActivityState));
          const activity: Activity = {
            content : {
            }
          };
          return {
            currentActivity: activity
          }
        });
        it('should dispatch new activity event', sagaEffect => {
          const activity: Activity = {
            content : {
              uuid: 'best activity'
            }
          };
          expect(sagaEffect).toEqual(call(handleNewActivity, activity))
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined()
        });
      });
      describe('and current activities are not the same missing content', () => {
        const it = sagaHelper(updateCurrentActivity());
        it('should try to get current activity and not extend the session', sagaEffect => {
          expect(sagaEffect).toEqual(call(performGetWithoutSessionExtension, CURRENT_ACTIVITY_URL));
          const activity: Activity = {
            content : {
              uuid: 'best activity'
            }
          };
          return {
            data: activity,
          };
        });
        it('should select current activity state', sagaEffect => {
          expect(sagaEffect).toEqual(select(selectActivityState));
          const activity: Activity = {
          };
          return {
            currentActivity: activity
          }
        });
        it('should dispatch new activity event', sagaEffect => {
          const activity: Activity = {
            content : {
              uuid: 'best activity'
            }
          };
          expect(sagaEffect).toEqual(call(handleNewActivity, activity))
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined()
        });
      });
      describe('and current activities are not the same missing activity', () => {
        const it = sagaHelper(updateCurrentActivity());
        it('should try to get current activity and not extend the session', sagaEffect => {
          expect(sagaEffect).toEqual(call(performGetWithoutSessionExtension, CURRENT_ACTIVITY_URL));
          const activity: Activity = {
            content : {
              uuid: 'best activity'
            }
          };
          return {
            data: activity,
          };
        });
        it('should select current activity state', sagaEffect => {
          expect(sagaEffect).toEqual(select(selectActivityState));
          return {
          }
        });
        it('should dispatch new activity event', sagaEffect => {
          const activity: Activity = {
            content : {
              uuid: 'best activity'
            }
          };
          expect(sagaEffect).toEqual(call(handleNewActivity, activity))
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined()
        });
      });
    });
  });
  describe('handleError', () => {
    describe('when offline', () => {
      const it = sagaHelper(handleError());
      it('should see if app is online', sagaEffect => {
        expect(sagaEffect).toEqual(call(isOnline));
        return false;
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when online', () => {
      const it = sagaHelper(handleError(10));
      it('should see if app is online', sagaEffect => {
        expect(sagaEffect).toEqual(call(isOnline));
        return true;
      });
      it('should wait for some time', sagaEffect => {
        expect(sagaEffect.payload.fn).toEqual(delay().payload.fn);
        return true;
      });
      it('should update current activity', sagaEffect => {
        expect(sagaEffect).toEqual(call(updateCurrentActivity, 11));
        return true;
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when online and has tried 3 times', () => {
      const it = sagaHelper(handleError(13));
      it('should see if app is online', sagaEffect => {
        expect(sagaEffect).toEqual(call(isOnline));
        return true;
      });
      it('should wait for some time', sagaEffect => {
        expect(sagaEffect.payload.fn).toEqual(delay().payload.fn);
        return true;
      });
      it('should update current activity', sagaEffect => {
        expect(sagaEffect).toEqual(call(updateCurrentActivity, 10));
        return true;
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
  describe('delayWork', () => {
    describe('when expired', () => {
      const it = sagaHelper(delayWork());
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        const network: NetworkState = {
          isOnline: true,
        };
        const security: SecurityState = {
          isExpired: true,
        };
        return {
          network,
          security
        }
      });
      it('should wait for security initialization', sagaEffect => {
        expect(sagaEffect).toEqual(take(INITIALIZED_SECURITY));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when offline and expired', () => {
      const it = sagaHelper(delayWork());
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        const network: NetworkState = {
          isOnline: false,
        };
        const security: SecurityState = {
          isExpired: true,
        };
        return {
          network,
          security
        }
      });
      it('should wait for security initialization', sagaEffect => {
        expect(sagaEffect).toEqual(take(INITIALIZED_SECURITY));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when offline and not expired', () => {
      const it = sagaHelper(delayWork());
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        const network: NetworkState = {
          isOnline: false,
        };
        const security: SecurityState = {
          isExpired: false,
        };
        return {
          network,
          security
        }
      });
      it('should wait for security initialization', sagaEffect => {
        expect(sagaEffect).toEqual(take(FOUND_WIFI));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when online and not expired', () => {
      const it = sagaHelper(delayWork());
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        const network: NetworkState = {
          isOnline: true,
        };
        const security: SecurityState = {
          isExpired: false,
        };
        return {
          network,
          security
        }
      });
      it('should wait for security initialization', sagaEffect => {
        expect(sagaEffect).toEqual(delay(CURRENT_ACTIVITY_POLL_RATE));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});


