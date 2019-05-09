import oauthInitializationSaga from "../../../sagas/security/SecurityInitializationSaga";
import sagaHelper from "redux-saga-testing";
import {put, call, select, take} from 'redux-saga/effects';
import {canRefreshToken, shouldCheckForAuthorizationGrant} from "../../../security/OAuth";
import {
  CHECKED_AUTH,
  createSecurityInitializedEvent,
  requestAuthorizationGrantCheck
} from "../../../events/SecurityEvents";
import {refreshTokenSaga} from "../../../sagas/security/RefreshTokenSagas";

jest.mock('../../../security/OAuth', ()=>({
  canRefreshToken: jest.fn(),
  shouldCheckForAuthorizationGrant: jest.fn(),
}));

describe('Security Initialization Sagas', () => {
  describe('oauthInitializationSaga', () => {
    describe('when the authorization grant should be checked', () => {
      canRefreshToken.mockReturnValueOnce(false);
      shouldCheckForAuthorizationGrant.mockReturnValueOnce(true);
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
      canRefreshToken.mockReturnValueOnce(true);
      shouldCheckForAuthorizationGrant.mockReturnValueOnce(false);
      const it = sagaHelper(oauthInitializationSaga({
        revocationEndpoint: 'http://logthefuckout.com',
      }));
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        return {
          security: {
            accessToken: 'gib the resources b0ss',
          }
        }
      });
      it('should then realize that the token can be refreshed', sagaEffect => {
        expect(sagaEffect).toEqual(call(refreshTokenSaga, {
          revocationEndpoint: 'http://logthefuckout.com'
        }, {
          accessToken: 'gib the resources b0ss',
        }));
      });
      it('should then broadcast that it completed initialization', sagaEffect => {
        expect(sagaEffect).toEqual(put(createSecurityInitializedEvent()));
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when the token can be refreshed and authorization grant should be checked', () => {
      canRefreshToken.mockReturnValueOnce(true);
      shouldCheckForAuthorizationGrant.mockReturnValueOnce(true);
      const it = sagaHelper(oauthInitializationSaga({
        revocationEndpoint: 'http://logthefuckout.com',
      }));
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        return {
          security: {
            accessToken: 'gib the resources b0ss',
          }
        }
      });
      it('should then realize that the token can be refreshed', sagaEffect => {
        expect(sagaEffect).toEqual(call(refreshTokenSaga, {
          revocationEndpoint: 'http://logthefuckout.com',
        }, {
          accessToken: 'gib the resources b0ss',
        }));
      });
      it('should then broadcast that it completed initialization', sagaEffect => {
        expect(sagaEffect).toEqual(put(createSecurityInitializedEvent()));
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when security is all up to date', () => {
      canRefreshToken.mockReturnValueOnce(false);
      shouldCheckForAuthorizationGrant.mockReturnValueOnce(false);
      const it = sagaHelper(oauthInitializationSaga({
        revocationEndpoint: 'http://logthefuckout.com',
      }));
      it('should select global state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        return {
          security: {}
        }
      });
      it('should then realize that security is all up to date and broadcast that it completed initialization', sagaEffect => {
        expect(sagaEffect).toEqual(put(createSecurityInitializedEvent()));
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });
});
