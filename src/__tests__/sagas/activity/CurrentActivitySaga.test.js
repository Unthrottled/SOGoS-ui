import { delay, call, take, put, select} from 'redux-saga/effects'
import sagaHelper from "redux-saga-testing";
import {activityLogonSaga, LOGGED_ON_ACTIVITY_NAME} from "../../../sagas/activity/LogonActivitySaga";
import {INITIALIZED_SECURITY, LOGGED_ON} from "../../../events/SecurityEvents";
import {RECEIVED_USER} from "../../../events/UserEvents";
import {registerActivitySaga} from "../../../sagas/activity/RegisterActivitySaga";
import {createStartedActivityEvent} from "../../../events/ActivityEvents";
import {
  CURRENT_ACTIVITY_POLL_RATE,
  currentActivitySaga,
  delayWork,
  updateCurrentActivity
} from "../../../sagas/activity/CurrentActivitySaga";
import type {NetworkState} from "../../../reducers/NetworkReducer";
import type {SecurityState} from "../../../reducers/SecurityReducer";
import {FOUND_WIFI} from "../../../events/NetworkEvents";

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


