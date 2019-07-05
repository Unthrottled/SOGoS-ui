import {call, put, all, take} from 'redux-saga/effects'
import sagaHelper from "redux-saga-testing";
import {activityLogonSaga, LOGGED_ON_ACTIVITY_NAME} from "../../../sagas/activity/LogonActivitySaga";
import {LOGGED_ON} from "../../../events/SecurityEvents";
import {RECEIVED_USER} from "../../../events/UserEvents";
import {
  ACTIVITY_URL,
  activityCacheSaga,
  activityUploadSaga,
  registerActivitySaga
} from "../../../sagas/activity/RegisterActivitySaga";
import {
  createFailureToRegisterStartEvent,
  createRegisteredStartEvent,
  createStartedActivityEvent
} from "../../../events/ActivityEvents";
import {isOnline} from "../../../sagas/NetworkSagas";
import {performPost} from "../../../sagas/APISagas";


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
  describe('activityUploadSaga', () => {
    describe('when able to connect with backend', () => {
      const it = sagaHelper(activityUploadSaga('steve'));
      it('should talk to the API', sagaEffect => {
        expect(sagaEffect).toEqual(call(performPost, ACTIVITY_URL, 'steve'));
      });
      it('should create expected event', sagaEffect => {
        expect(sagaEffect).toEqual(put(createRegisteredStartEvent('steve')));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when not able to connect with backend', () => {
      const it = sagaHelper(activityUploadSaga('steve'));
      it('should talk to the API', sagaEffect => {
        expect(sagaEffect).toEqual(call(performPost, ACTIVITY_URL, 'steve'));
        return new Error('Shit aint gunna work');
      });
      it('should create expected event', sagaEffect => {
        expect(sagaEffect).toEqual(put(createFailureToRegisterStartEvent({
          error: new Error('Shit aint gunna work'),
          activity: 'steve'
        })));
      });
      it('should cache activity', sagaEffect => {
        expect(sagaEffect).toEqual(call(activityCacheSaga, 'steve'));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
