import sagaHelper from "redux-saga-testing";
import {put, take} from 'redux-saga/effects';
import {refreshTokenRequestSaga, refreshTokenSaga} from "../../../sagas/security/RefreshTokenSagas";
import {
  createFoundInitialConfigurationsEvent,
  createRequestForInitialConfigurations,
  FOUND_INITIAL_CONFIGURATION
} from "../../../events/ConfigurationEvents";
import {GRANT_TYPE_REFRESH_TOKEN, TokenRequest} from "@openid/appauth";
import {createRequestLogonEvent, createTokenFailureEvent} from "../../../events/SecurityEvents";
import {fetchTokenSaga} from "../../../sagas/security/TokenSagas";

describe('Refresh TokenSagas', () => {
  describe('refreshTokenSaga', () => {
    describe('when tokens can be fetched', () => {
      const it = sagaHelper(refreshTokenSaga({
        revocationEndpoint: 'http://logthefuckout.com'
      },{}));
      it('should ask for a constructed refresh token request', sagaEffect => {
        expect(sagaEffect instanceof refreshTokenRequestSaga).toBeTruthy();
        return new TokenRequest({});
      });
      it('should attempt to fetch token', sagaEffect => {
        expect(sagaEffect instanceof fetchTokenSaga)
      });
      it('should then complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when tokens cannot be fetched', () => {
      const it = sagaHelper(refreshTokenSaga({
        revocationEndpoint: 'http://logthefuckout.com'
      },{}));
      it('should ask for a constructed refresh token request', sagaEffect => {
        expect(sagaEffect instanceof refreshTokenRequestSaga).toBeTruthy();
        return new TokenRequest({
          client_id: 'COOL CLIENT'
        });
      });
      it('should attempt to fetch token', sagaEffect => {
        expect(sagaEffect instanceof fetchTokenSaga);
        return new Error(`SHIT'S BROKE, YO`);
      });
      it('should handle error and request logoff', sagaEffect => {
        expect(sagaEffect).toEqual(put(createRequestLogonEvent({
          revocationEndpoint: 'http://logthefuckout.com'
        })))
      });
      it('should then let you know that it failed to get a token', sagaEffect => {
          expect(sagaEffect).toEqual(put(createTokenFailureEvent(new TokenRequest({
            client_id: 'COOL CLIENT'
          }))));
      });
      it('should then complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });

  describe('refreshTokenRequestSaga', () => {
    describe('when initial configuration can be found', () => {
      const it = sagaHelper(refreshTokenRequestSaga({
        refreshToken: 'I AM REFRESH TOKEN YO'
      }));
      it('should request for initial endpoint configurations', result => {
        expect(result).toEqual(put(createRequestForInitialConfigurations()));
      });
      it('should then wait patiently for initial configurations', sagaEffect => {
        expect(sagaEffect).toEqual(take(FOUND_INITIAL_CONFIGURATION));
        return createFoundInitialConfigurationsEvent({
          clientID: 'COOL CLIENT',
          callbackURI: 'HOLLA AT YA BOI',
        });
      });
      it('should then return a good token request', sagaEffect => {
        expect(sagaEffect).toEqual(new TokenRequest({
          client_id: 'COOL CLIENT',
          redirect_uri: 'HOLLA AT YA BOI',
          grant_type: GRANT_TYPE_REFRESH_TOKEN,
          refresh_token: 'I AM REFRESH TOKEN YO',
        }))
      });
      it('should be done', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
