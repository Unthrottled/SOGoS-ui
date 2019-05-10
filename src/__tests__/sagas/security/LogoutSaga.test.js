import sagaHelper from 'redux-saga-testing';
import {call, put, select} from 'redux-saga/effects';
import logoutSaga, {constructRedirectURI, logoffPreFlightSaga, pushRedirect} from "../../../sagas/security/LogoutSaga";
import {oAuthConfigurationSaga} from "../../../sagas/configuration/ConfigurationConvienenceSagas";
import type {OAuthConfig} from "../../../reducers/ConfigurationReducer";

describe('Logout Saga', () => {
  describe('logoutSaga', () => {
    describe('when authenticated to Keycloak', () => {
      const it = sagaHelper(logoutSaga());
      it('should conduct pre-flight activities', sagaEffect => {
        expect(sagaEffect).toEqual(call(logoffPreFlightSaga));
      });
      it('should ask for OAuth Configurations', sagaEffect => {
        expect(sagaEffect).toEqual(call(oAuthConfigurationSaga));
        const oauthConfiguration: OAuthConfig = {
          endSessionEndpoint: 'http://logthefuckout.com',
        };
        return oauthConfiguration;
      });
      it('should ask for a constructed the redirect URI', sagaEffect => {
        expect(sagaEffect).toEqual(call(constructRedirectURI, 'http://logthefuckout.com'));
        return 'http://logthefuckout.com/log/the/fuck/out?gtfo=now';
      });
      it('should push the new redirect uri', sagaEffect => {
        expect(sagaEffect).toEqual(call(pushRedirect, 'http://logthefuckout.com/log/the/fuck/out?gtfo=now'));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when authenticated to Google', () => {
      it('should ', () => {
        
      });
    });
  });
});
