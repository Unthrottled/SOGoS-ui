import sagaHelper from "redux-saga-testing";
import {call, put} from 'redux-saga/effects';
import {
  fetchTokenSaga,
  fetchTokenWithoutSessionRefreshSaga,
  fetchTokenWithRefreshSaga,
  identityFunction,
  refreshTokenDeleter,
  requestToken
} from "../../../sagas/security/TokenSagas";
import {createTokenFailureEvent, createTokenReceptionEvent} from "../../../events/SecurityEvents";

describe('Token Sagas', () => {
  describe('identityFunction', () => {
    it('should give back what it is given', async () => {
      const input = {
        hazard: 'spaghetti',
        murder: 'spagurder',
        nope: 'rope',
        refreshToken : 'Cheese Boi',
      };
      const result = identityFunction(input);
      expect(result).toEqual({
        hazard: 'spaghetti',
        murder: 'spagurder',
        nope: 'rope',
        refreshToken : 'Cheese Boi',
      });
    });
  });
  describe('refreshTokenDeleter', () => {
    it('should delete refresh token', async () => {
      const input = {
        hazard: 'spaghetti',
        murder: 'spagurder',
        nope: 'rope',
        refreshToken : 'Cheese Boi',
      };
      const result = refreshTokenDeleter(input);
      expect(result).toEqual({
        hazard: 'spaghetti',
        murder: 'spagurder',
        nope: 'rope',
      })
    });
    it('should freak out when has no refresh token to delete', async () => {
      const input = {
        hazard: 'spaghetti',
        murder: 'spagurder',
        nope: 'rope',
      };
      const result = refreshTokenDeleter(input);
      expect(result).toEqual({
        hazard: 'spaghetti',
        murder: 'spagurder',
        nope: 'rope',
      })
    });
  });
  describe('fetchTokenWithRefreshSaga', () => {
    describe('when given the good stuff', () => {
      const it = sagaHelper(fetchTokenWithRefreshSaga({
        authorizationEndpoint: 'http://authy-auth.io'
      }, {
        clientId: 'cool client',
      }));
      it('should delegate with the correct arguments', sagaEffect => {
        expect(sagaEffect).toEqual(
          call(fetchTokenSaga, {
            authorizationEndpoint: 'http://authy-auth.io'
          }, {
            clientId: 'cool client',
          }, identityFunction)
        )
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
  describe('fetchTokenWithoutSessionRefreshSaga', () => {
    describe('when given the good stuff', () => {
      const it = sagaHelper(fetchTokenWithoutSessionRefreshSaga({
        authorizationEndpoint: 'http://authy-auth.io'
      }, {
        clientId: 'cool client',
      }));
      it('should delegate with the correct arguments', sagaEffect => {
        expect(sagaEffect).toEqual(
          call(fetchTokenSaga, {
            authorizationEndpoint: 'http://authy-auth.io'
          }, {
            clientId: 'cool client',
          }, refreshTokenDeleter)
        )
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
  describe('fetchTokenSaga', () => {
    describe('when able to successfully make a request', () => {
      const it = sagaHelper(fetchTokenSaga({
        authorizationEndpoint: 'http://authy-auth.io'
      }, {
        clientId: 'cool client',
      }, identityFunction));
      it('should perform the correct request', sagaEffect => {
        expect(sagaEffect).toEqual(call(requestToken, {
          authorizationEndpoint: 'http://authy-auth.io'
        }, {
          clientId: 'cool client',
        }));
        return 'BRO, DO YOU EVEN LIFT?';
      });
      it('should dispatch the correct event', sagaEffect => {
        expect(sagaEffect).toEqual(put(createTokenReceptionEvent('BRO, DO YOU EVEN LIFT?')));
      });
      it('should then be complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when not able to successfully make a request', () => {
      const it = sagaHelper(fetchTokenSaga({
        authorizationEndpoint: 'http://authy-auth.io'
      }, {
        clientId: 'cool client',
      }));
      it('should perform the correct request', sagaEffect => {
        expect(sagaEffect).toEqual(call(requestToken, {
          authorizationEndpoint: 'http://authy-auth.io'
        }, {
          clientId: 'cool client',
        }));
        return new Error(`SHIT'S BROKE, YO.`);
      });
      it('should dispatch the correct event', sagaEffect => {
        expect(sagaEffect).toEqual(
          put(createTokenFailureEvent({
            tokenRequest: {
              clientId: 'cool client',
            },
            error: `SHIT'S BROKE, YO.`
          })));
      });
      it('should then be complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
