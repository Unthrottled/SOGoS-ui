import sagaHelper from "redux-saga-testing";
import {call, fork, race, select, take} from 'redux-saga/effects';
import {awaitToken, getOrRefreshAccessToken} from "../../../sagas/security/AccessTokenSagas";
import {oauthConfigurationSaga} from "../../../sagas/configuration/ConfigurationConvienenceSagas";
import {refreshTokenWithReplacementSaga} from "../../../sagas/security/RefreshTokenSagas";
import {FAILED_TO_RECEIVE_TOKEN, RECEIVED_TOKENS} from "../../../events/SecurityEvents";
import {canRefreshEitherTokens, canRefreshToken} from "../../../security/OAuth";

describe('Access Token Sagas', () => {
  describe('accessTokenSagas', () => {
    describe('when token was fetched', () => {

    });

  });
  describe('awaitToken', () => {
    describe('when token was received', () => {
      describe('and token is in right object', () => {
        const it = sagaHelper(awaitToken());
        it('should await token responses', sagaEffect => {
          expect(sagaEffect).toEqual(race({
            tokenReception: take(RECEIVED_TOKENS),
            tokenFailure: take(FAILED_TO_RECEIVE_TOKEN),
          }));
          return {
            tokenReception: {
              payload: {
                accessToken: 'PRINGLES'
              }
            }
          };
        });
        it('should return access token', sagaEffect => {
          expect(sagaEffect).toEqual('PRINGLES');
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined();
        });
      });
      describe('and token is in incorrect object', () => {
        const it = sagaHelper(awaitToken());
        it('should await token responses', sagaEffect => {
          expect(sagaEffect).toEqual(race({
            tokenReception: take(RECEIVED_TOKENS),
            tokenFailure: take(FAILED_TO_RECEIVE_TOKEN),
          }));
          return {
            tokenReception: {
              pineapples: {
                accessToken: 'PRINGLES'
              }
            }
          };
        });
        it('should return nothing :(', sagaEffect => {
          expect(sagaEffect).toBeUndefined();
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined();
        });
      });
    });
    describe('when token was failed to be recovered', () => {
      describe('and token is in correct object', () => {
        const it = sagaHelper(awaitToken());
        it('should await token responses', sagaEffect => {
          expect(sagaEffect).toEqual(race({
            tokenReception: take(RECEIVED_TOKENS),
            tokenFailure: take(FAILED_TO_RECEIVE_TOKEN),
          }));
          return {
            tokenFailure: {
              payload: {
                accessToken: 'PRINGLES'
              }
            }
          };
        });
        it('should return nothing :(', sagaEffect => {
          expect(sagaEffect).toBeUndefined();
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined();
        });
      });
      describe('and token is in incorrect object', () => {
        const it = sagaHelper(awaitToken());
        it('should await token responses', sagaEffect => {
          expect(sagaEffect).toEqual(race({
            tokenReception: take(RECEIVED_TOKENS),
            tokenFailure: take(FAILED_TO_RECEIVE_TOKEN),
          }));
          return {
            tokenFailure: {
              pineapples: {
                accessToken: 'PRINGLES'
              }
            }
          };
        });
        it('should return nothing :(', sagaEffect => {
          expect(sagaEffect).toBeUndefined();
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined();
        });
      });
    });
  });
  describe('getOrRefreshAccessToken', () => {
    describe('when token can be refreshed', () => {
      const it = sagaHelper(getOrRefreshAccessToken(refreshTokenWithReplacementSaga, canRefreshToken));
      it('should request security state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        return {
          security: {
            refreshToken: 'OH YEAH!',
          }
        }
      });
      it('should request OAuth configurations', sagaEffect => {
        expect(sagaEffect).toEqual(call(oauthConfigurationSaga));
        return 'peaches';
      });
      it('should spawn a refresh token worker', sagaEffect => {
        expect(sagaEffect).toEqual(fork(refreshTokenWithReplacementSaga, 'peaches', {
            refreshToken: 'OH YEAH!',
          }
        ));
      });
      it('should await token', sagaEffect => {
        expect(sagaEffect).toEqual(call(awaitToken));
        return 'i am token'
      });
      it('should return token', sagaEffect => {
        expect(sagaEffect).toEqual('i am token');
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when refresh token can be refreshed', () => {
      const it = sagaHelper(getOrRefreshAccessToken(refreshTokenWithReplacementSaga, canRefreshEitherTokens));
      it('should request security state', sagaEffect => {
        expect(sagaEffect).toEqual(select());
        return {
          security: {}
        }
      });
      it('should request OAuth configurations', sagaEffect => {
        expect(sagaEffect).toEqual(call(oauthConfigurationSaga));
        return 'peaches';
      });
      it('should spawn a refresh token worker', sagaEffect => {
        expect(sagaEffect).toEqual(fork(refreshTokenWithReplacementSaga, 'peaches', {

          }
        ));
      });
      it('should await token', sagaEffect => {
        expect(sagaEffect).toEqual(call(awaitToken));
        return 'i am token'
      });
      it('should return token', sagaEffect => {
        expect(sagaEffect).toEqual('i am token');
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when token cannot be refreshed', () => {
      describe('when token is in state', () => {
        const it = sagaHelper(getOrRefreshAccessToken(refreshTokenWithReplacementSaga, canRefreshToken));
        it('should request security state', sagaEffect => {
          expect(sagaEffect).toEqual(select());
          return {
            security: {
              accessToken: 'THE BEST ACCESS TOKEN'
            }
          }
        });
        it('should return stored access token', sagaEffect => {
          expect(sagaEffect).toEqual('THE BEST ACCESS TOKEN');
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined();
        });
      });
      describe('when token is not in state', () => {
        const it = sagaHelper(getOrRefreshAccessToken(refreshTokenWithReplacementSaga, canRefreshToken));
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
});
