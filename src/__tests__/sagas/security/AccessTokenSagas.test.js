import sagaHelper from "redux-saga-testing";
import {select, call, put ,fork, take} from 'redux-saga/effects';
import {getOrRefreshAccessToken} from "../../../sagas/security/AccessTokenSagas";
import {oAuthConfigurationSaga} from "../../../sagas/configuration/ConfigurationConvienenceSagas";
import {refreshTokenSaga} from "../../../sagas/security/RefreshTokenSagas";

describe('Access Token Sagas', () => {
  describe('accessTokenSagas', () => {

  });
  describe('getOrRefreshAccessToken', () => {
    describe('when token can be refreshed', () => {
        const it = sagaHelper(getOrRefreshAccessToken());
        it('should request security state', sagaEffect => {
          expect(sagaEffect).toEqual(select());
          return {
            security: {
              refreshToken: 'OH YEAH!',
            }
          }
        });
      it('should request OAuth configurations', sagaEffect => {
        expect(sagaEffect).toEqual(call(oAuthConfigurationSaga))
        return 'peaches';
      });
      it('should spawn a refresh token worker', sagaEffect => {
          expect(sagaEffect).toEqual(fork(refreshTokenSaga, 'peaches', {
              refreshToken: 'OH YEAH!',
            }
          ));
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined();
        });
    });
    describe('when token cannot be refreshed', () => {
      const it = sagaHelper(getOrRefreshAccessToken());
      it('should request security state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        return {
          security: {}
        }
      });
      it('should return undefined access token', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
