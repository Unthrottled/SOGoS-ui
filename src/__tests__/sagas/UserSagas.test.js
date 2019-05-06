// import {testSaga} from "redux-saga-test-plan";
import {findUserSaga} from "../../sagas/UserSagas";
import {createFailedToGetUserEvent, createReceivedUserEvent} from "../../events/UserEvents";
import sagaHelper from 'redux-saga-testing'
import {performGet} from "../../sagas/APISagas";
import {put} from 'redux-saga/effects'

describe('User Sagas', () => {

  describe('findUserSaga', () => {
    describe('when an error occurs', () => {
      const it = sagaHelper(findUserSaga());
      it('should perform a authenticated API response', (result) => {
        expect(result instanceof performGet).toBeTruthy();
        return new Error('YA DUN MESSED UP A-A-RON');
      });
      it('should generate a failed to fetch user event', (result) => {
        expect(result).toEqual(put(createFailedToGetUserEvent(new Error('YA DUN MESSED UP A-A-RON'))))
      });
    });

    describe('when all is just', () => {
      const it = sagaHelper(findUserSaga());
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
    });
  });
});
