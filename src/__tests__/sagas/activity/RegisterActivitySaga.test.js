import {call, all, take} from 'redux-saga/effects'
import sagaHelper from "redux-saga-testing";
import {activityLogonSaga, LOGGED_ON_ACTIVITY_NAME} from "../../../sagas/activity/LogonActivitySaga";
import {LOGGED_ON} from "../../../events/SecurityEvents";
import {RECEIVED_USER} from "../../../events/UserEvents";
import {
  activityCacheSaga,
  activityUploadSaga,
  registerActivitySaga
} from "../../../sagas/activity/RegisterActivitySaga";
import {createStartedActivityEvent} from "../../../events/ActivityEvents";
import {isOnline} from "../../../sagas/NetworkSagas";


describe('RegisterActivitySagas', () => {
  describe('registerActivitySaga', () => {
    describe('when online', () => {
      const it = sagaHelper(registerActivitySaga({
        payload: 'steve',
      }));
      it('should check to see if app is online', sagaEffect => {
        expect(sagaEffect).toEqual(call(isOnline));
        return true;
      });
      it('should attempt to upload activity', sagaEffect => {
        expect(sagaEffect).toEqual(call(
          activityUploadSaga, 'steve'
        ));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when offline', () => {
      const it = sagaHelper(registerActivitySaga({
        payload: 'steve',
      }));
      it('should check to see if app is online', sagaEffect => {
        expect(sagaEffect).toEqual(call(isOnline));
        return false;
      });
      it('should cache activity', sagaEffect => {
        expect(sagaEffect).toEqual(call(
          activityCacheSaga, 'steve'
        ));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
