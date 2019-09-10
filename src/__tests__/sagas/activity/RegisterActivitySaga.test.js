import {call, put, select} from 'redux-saga/effects'
import sagaHelper from "redux-saga-testing";
import {
  ACTIVITY_URL,
  activityCacheSaga,
  activityUploadSaga,
  registerActivitySaga
} from "../../../sagas/activity/RegisterActivitySaga";
import {
  createCachedActivityEvent,
  CREATED,
  createFailureToRegisterStartEvent,
  createRegisteredStartEvent
} from "../../../events/ActivityEvents";
import {isOnline} from "../../../sagas/NetworkSagas";
import {performPost} from "../../../sagas/APISagas";
import {selectUserState} from "../../../reducers";
import type {UserState} from "../../../reducers/UserReducer";
import {createCachedDataEvent, createSyncedDataEvent} from "../../../events/UserEvents";


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
  describe('activityCacheSaga', () => {
    describe('when called', () => {
      const it = sagaHelper(activityCacheSaga('steve'));
      it('should select user state', sagaEffect => {
        expect(sagaEffect).toEqual(select(selectUserState));
        const userState: UserState = {
          information: {
            guid: 'beans'
          }
        };
        return userState;
      });
      it('should create expected event', sagaEffect => {
        expect(sagaEffect).toEqual(put(createCachedActivityEvent({
          cachedActivity: {
            activity: 'steve',
            uploadType: CREATED,
          },
          userGUID: 'beans'
        })));
      });
      it('should create cached data event', sagaEffect => {
        expect(sagaEffect).toEqual(put(createCachedDataEvent()));
        return {};
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
