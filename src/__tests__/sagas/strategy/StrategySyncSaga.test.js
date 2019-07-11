import {call, put, select} from 'redux-saga/effects'
import sagaHelper from "redux-saga-testing";
import type {UserState} from "../../../reducers/UserReducer";
import {BULK_OBJECTIVE_UPLOAD_URL, strategySyncSaga} from "../../../sagas/strategy/StrategySyncSaga";
import {performPost} from "../../../sagas/APISagas";
import type {StrategyState} from "../../../reducers/StrategyReducer";
import {createSyncedObjectivesEvent} from "../../../events/StrategyEvents";

describe('StrategySyncSaga', () => {
  describe('strategySyncSaga', () => {
    describe('when user has no global identifier and no cache', () => {
      const it = sagaHelper(strategySyncSaga());
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        const userState: UserState = {
          information: {}
        };
        const strategyState: StrategyState = {};
        return {
          user: userState,
          strategy: strategyState,
        }
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when no cache', () => {
      const it = sagaHelper(strategySyncSaga());
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        const userState: UserState = {
          information: {
            guid: 'steve'
          }
        };
        const strategyState: StrategyState = {};
        return {
          user: userState,
          strategy: strategyState,
        }
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when user has nothing cached', () => {
      const it = sagaHelper(strategySyncSaga());
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        const userState: UserState = {
          information: {
            guid: 'steve'
          }
        };
        const strategyState: StrategyState = {
          cache: {}
        };
        return {
          user: userState,
          strategy: strategyState,
        }
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when user has a cache and shit breaks', () => {
      const it = sagaHelper(strategySyncSaga());
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        const userState: UserState = {
          information: {
            guid: 'steve'
          }
        };
        const strategyState: StrategyState = {
          cache: {
            'steve': 'pants',
          }
        };
        return {
          user: userState,
          strategy: strategyState,
        }
      });
      it('should perform a bulk upload', sagaEffect => {
        expect(sagaEffect).toEqual(call(performPost, BULK_OBJECTIVE_UPLOAD_URL, 'pants'));
        return new Error("Shit's broke yo");
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when user has a cache and shit works', () => {
      const it = sagaHelper(strategySyncSaga());
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        const userState: UserState = {
          information: {
            guid: 'steve'
          }
        };
        const strategyState: StrategyState = {
          cache: {
            'steve': 'pants',
          }
        };
        return {
          user: userState,
          strategy: strategyState,
        }
      });
      it('should perform a bulk upload', sagaEffect => {
        expect(sagaEffect).toEqual(call(performPost, BULK_OBJECTIVE_UPLOAD_URL, 'pants'));
        return {};
      });
      it('should create synced activities event', sagaEffect => {
        expect(sagaEffect).toEqual(put(createSyncedObjectivesEvent('steve')));
        return {};
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
