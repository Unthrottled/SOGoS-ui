// import {testSaga} from "redux-saga-test-plan";
import {findUserSaga, requestUserSaga} from "../../sagas/UserSagas";
import {createFailedToGetUserEvent, createReceivedUserEvent} from "../../events/UserEvents";
import sagaHelper from 'redux-saga-testing'
import {performGet} from "../../sagas/APISagas";
import {put, select} from 'redux-saga/effects'
import type {SecurityState} from "../../reducers/SecurityReducer";
import {selectSecurityState} from "../../reducers";

describe('User Sagas', () => {
  describe('findUserSaga', () => {
    describe('when user is not logged in', () => {
      const it = sagaHelper(findUserSaga());
      it('should check security state', sagaEffect => {
        expect(sagaEffect).toEqual(select(selectSecurityState));
        const securityState: SecurityState = {
          isLoggedIn: false
        };
        return securityState;
      });
      it('should then complete', (result) => {
        expect(result).toBeUndefined();
      });
    });

    describe('when user is logged in', () => {
      const it = sagaHelper(findUserSaga());

      it('should check security state', sagaEffect => {
        expect(sagaEffect).toEqual(select(selectSecurityState));
        const securityState: SecurityState = {
          isLoggedIn: true
        };
        return securityState;
      });
      it('should then request user', sagaEffect => {
        expect(sagaEffect instanceof requestUserSaga).toBeTruthy();
      });
      it('should then complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });
  describe('requestUserSaga', () => {
    describe('when an error occurs', () => {
      const it = sagaHelper(requestUserSaga());
      it('should perform a authenticated API response', (result) => {
        expect(result instanceof performGet).toBeTruthy();
        return new Error('YA DUN MESSED UP A-A-RON');
      });
      it('should generate a failed to fetch user event', (result) => {
        expect(result).toEqual(put(createFailedToGetUserEvent(new Error('YA DUN MESSED UP A-A-RON'))))
      });
      it('should then complete', (result) => {
        expect(result).toBeUndefined();
      });
    });

    describe('when all is just', () => {
      const it = sagaHelper(requestUserSaga());
      it('should perform a authenticated API response', (result) => {
        expect(result instanceof performGet).toBeTruthy();
        return {
          data: {
            'I AM': 'BECOME DEATH'
          },
        };
      });
      it('should respond with a found user event', (result) => {
        expect(result).toEqual(put(createReceivedUserEvent({
          'I AM': 'BECOME DEATH',
        })))
      });
      it('should then complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });
});
