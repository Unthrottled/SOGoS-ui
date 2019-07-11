import {call, put, select} from 'redux-saga/effects'
import sagaHelper from "redux-saga-testing";
import type {UserState} from "../../../reducers/UserReducer";
import type {ActivityState} from "../../../reducers/ActivityReducer";
import {activitySyncSaga, BULK_UPLOAD_URL} from "../../../sagas/activity/ActivitySyncSaga";
import {performPost} from "../../../sagas/APISagas";
import {createSyncedActivitiesEvent} from "../../../events/ActivityEvents";

describe('ActivitySyncSaga', () => {
  describe('activitySyncSaga', () => {
    describe('when user has no global identifier and no cache', () => {
      const it = sagaHelper(activitySyncSaga());
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        const userState: UserState = {
          information: {}
        };
        const activityState: ActivityState = {};
        return {
          user: userState,
          activity: activityState,
        }
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when no cache', () => {
      const it = sagaHelper(activitySyncSaga());
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        const userState: UserState = {
          information: {
            guid: 'steve'
          }
        };
        const activityState: ActivityState = {};
        return {
          user: userState,
          activity: activityState,
        }
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when user has nothing cached', () => {
      const it = sagaHelper(activitySyncSaga());
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        const userState: UserState = {
          information: {
            guid: 'steve'
          }
        };
        const activityState: ActivityState = {
          cache: {}
        };
        return {
          user: userState,
          activity: activityState,
        }
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when user has a cache and shit breaks', () => {
      const it = sagaHelper(activitySyncSaga());
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        const userState: UserState = {
          information: {
            guid: 'steve'
          }
        };
        const activityState: ActivityState = {
          cache: {
            'steve': 'pants',
          }
        };
        return {
          user: userState,
          activity: activityState,
        }
      });
      it('should perform a bulk upload', sagaEffect => {
        expect(sagaEffect).toEqual(call(performPost, BULK_UPLOAD_URL, 'pants'));
        return new Error("Shit's broke yo");
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when user has a cache and shit works', () => {
      const it = sagaHelper(activitySyncSaga());
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        const userState: UserState = {
          information: {
            guid: 'steve'
          }
        };
        const activityState: ActivityState = {
          cache: {
            'steve': 'pants',
          }
        };
        return {
          user: userState,
          activity: activityState,
        }
      });
      it('should perform a bulk upload', sagaEffect => {
        expect(sagaEffect).toEqual(call(performPost, BULK_UPLOAD_URL, 'pants'));
        return {};
      });
      it('should create synced activities event', sagaEffect => {
        expect(sagaEffect).toEqual(put(createSyncedActivitiesEvent('steve')));
        return {};
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
