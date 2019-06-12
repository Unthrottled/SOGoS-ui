import sagaHelper from "redux-saga-testing";
import {call, fork, put, race, take} from 'redux-saga/effects';
import {refreshTokenRequestSaga, refreshTokenSaga} from "../../../sagas/security/RefreshTokenSagas";
import {
  createFoundInitialConfigurationsEvent,
  createRequestForInitialConfigurations,
  FOUND_INITIAL_CONFIGURATION
} from "../../../events/ConfigurationEvents";
import {GRANT_TYPE_REFRESH_TOKEN, TokenRequest} from "@openid/appauth";
import {
  createExpiredSessionEvent,
  createRequestLogonEvent,
  FAILED_TO_RECEIVE_TOKEN,
  RECEIVED_TOKENS
} from "../../../events/SecurityEvents";
import {fetchTokenSaga, fetchTokenWithRefreshSaga} from "../../../sagas/security/TokenSagas";
import {waitForWifi} from "../../../sagas/NetworkSagas";

describe('Refresh TokenSagas', () => {
  describe('refreshTokenSaga', () => {
    describe('when tokens can be fetched', () => {
      const it = sagaHelper(refreshTokenSaga({
        revocationEndpoint: 'http://logthefuckout.com'
      }, {
        accessToken: 'GIB ME THE RESOURCES'
      }, fetchTokenWithRefreshSaga));
      it('should wait for wifi', sagaEffect => {
        expect(sagaEffect).toEqual(
          call(waitForWifi)
        )
      });
      it('should ask for a constructed refresh token request', sagaEffect => {
        expect(sagaEffect).toEqual(call(refreshTokenRequestSaga, {
          accessToken: 'GIB ME THE RESOURCES',
        }));
        return new TokenRequest({
          grant_type: 'yo butt'
        });
      });
      it('should attempt to fetch token', sagaEffect => {
        expect(sagaEffect).toEqual(fork(fetchTokenWithRefreshSaga, {
          revocationEndpoint: 'http://logthefuckout.com'
        }, new TokenRequest({
          grant_type: 'yo butt'
        })));
      });
      it('should listen for a response', sagaEffect => {
        expect(sagaEffect).toEqual(race({
          successResponse: take(RECEIVED_TOKENS),
          failureResponse: take(FAILED_TO_RECEIVE_TOKEN),
        }));
        return {
          successResponse: 'It worked, yo',
        }
      });
      it('should then complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when tokens cannot be fetched', () => {
      const it = sagaHelper(refreshTokenSaga({
        revocationEndpoint: 'http://logthefuckout.com'
      }, {
        accessToken: 'GIB THE RESOURCES b0SS'
      }, fetchTokenWithRefreshSaga));
      it('should wait for wifi', sagaEffect => {
        expect(sagaEffect).toEqual(
          call(waitForWifi)
        )
      });
      it('should ask for a constructed refresh token request', sagaEffect => {
        expect(sagaEffect).toEqual(call(refreshTokenRequestSaga, {
          accessToken: 'GIB THE RESOURCES b0SS',
        }));
        return new TokenRequest({
          client_id: 'COOL CLIENT'
        });
      });
      it('should attempt to fetch token', sagaEffect => {
        expect(sagaEffect).toEqual(fork(fetchTokenWithRefreshSaga, {
          revocationEndpoint: 'http://logthefuckout.com'
        }, new TokenRequest({
          client_id: 'COOL CLIENT'
        })));
      });
      it('should listen for a response', sagaEffect => {
        expect(sagaEffect).toEqual(race({
          successResponse: take(RECEIVED_TOKENS),
          failureResponse: take(FAILED_TO_RECEIVE_TOKEN),
        }));
        return {
          failureResponse: `SHIT'S BROKE YO`,
        }
      });
      it('should handle error and request logoff', sagaEffect => {
        expect(sagaEffect).toEqual(put(createExpiredSessionEvent()))
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
