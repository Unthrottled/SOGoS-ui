import sagaHelper from "redux-saga-testing";
import {put, take} from 'redux-saga/effects';
import {refreshTokenRequestSaga} from "../../../sagas/security/RefreshTokenSaga";
import type {InitialConfig} from "../../../reducers/ConfigurationReducer";
import {
  createFoundInitialConfigurationsEvent,
  createRequestForInitialConfigurations,
  FOUND_INITIAL_CONFIGURATION
} from "../../../events/ConfigurationEvents";
import {GRANT_TYPE_REFRESH_TOKEN, TokenRequest} from "@openid/appauth";

describe('Refresh TokenSagas', () => {
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
