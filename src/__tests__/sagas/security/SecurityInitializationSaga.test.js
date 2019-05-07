import oauthInitializationSaga from "../../../sagas/security/SecurityInitializationSaga";
import sagaHelper from "redux-saga-testing";
import {put, take, call, select} from 'redux-saga/effects';
import {canRefreshToken, shouldCheckForAuthorizationGrant} from "../../../security/OAuth";
import {
  CHECKED_AUTH,
  createSecurityInitializedEvent,
  requestAuthorizationGrantCheck
} from "../../../events/SecurityEvents";

jest.mock('../../../security/OAuth', ()=>({
  canRefreshToken: jest.fn(),
  shouldCheckForAuthorizationGrant: jest.fn(),
}))

describe('Security Initialization Sagas', () => {
  describe('oauthInitializationSaga', () => {
    describe('when the authorization grant should be checked', () => {
      canRefreshToken.mockReturnValueOnce(false);
      canRefreshToken.mockReturnValueOnce(true);
      const it = sagaHelper(oauthInitializationSaga({
        revocationEndpoint: 'http://logthefuckout.com',
      }));
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        return {
          security: {}
        }
      });
      it('should then request authorization grant', sagaEffect => {
        expect(sagaEffect).toEqual(put(requestAuthorizationGrantCheck({
          revocationEndpoint: 'http://logthefuckout.com',
        })));
      });
      it('should then wait patiently for authorization checked event', sagaEffect => {
        expect(sagaEffect).toEqual(take(CHECKED_AUTH));
      });
      it('should then broadcast that it completed initialization', sagaEffect => {
        expect(sagaEffect).toEqual(put(createSecurityInitializedEvent()));
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when the token can be refreshed', () => {
      const it = sagaHelper(oauthInitializationSaga({
        revocationEndpoint: 'http://logthefuckout.com',
      }));
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when the token can be refreshed and authorization grant should be checked', () => {
      const it = sagaHelper(oauthInitializationSaga({
        revocationEndpoint: 'http://logthefuckout.com',
      }));
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when security is all up to date', () => {
      const it = sagaHelper(oauthInitializationSaga({
        revocationEndpoint: 'http://logthefuckout.com',
      }));
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });
});
