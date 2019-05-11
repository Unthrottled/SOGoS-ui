import sagaHelper from 'redux-saga-testing';
import {call, put, select} from 'redux-saga/effects';
import logoutSaga, {constructRedirectURI, logoffPreFlightSaga, pushRedirect} from "../../../sagas/security/LogoutSaga";
import {oauthConfigurationSaga} from "../../../sagas/configuration/ConfigurationConvienenceSagas";
import type {ConfigurationState, OAuthConfig} from "../../../reducers/ConfigurationReducer";
import {selectConfigurationState} from "../../../reducers";

describe('Logout Saga', () => {
  describe('constructRedirectURI', () => {
    describe('when authenticated to Keycloak', () => {
      const it = sagaHelper(constructRedirectURI());
      it('should ask for OAuth Configurations', sagaEffect => {
        expect(sagaEffect).toEqual(call(oauthConfigurationSaga));
        const oauthConfiguration: OAuthConfig = {
          endSessionEndpoint: 'http://logthefuckout.com',
        };
        return oauthConfiguration;
      });
      it('should ask for configuration state', sagaEffect => {
        expect(sagaEffect).toEqual(select(selectConfigurationState));
        const configurationState: ConfigurationState = {
          initial: {
            provider: 'KEYCLOAK',
            callbackURI: 'https://lemons.io',
          }
        };
        return configurationState;
      });
      it('should return expected constructed uri', sagaEffect => {
        expect(sagaEffect).toEqual('http://logthefuckout.com?redirect_uri=https://lemons.io');
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when authenticated to Google', () => {
      const it = sagaHelper(constructRedirectURI());
      it('should ask for OAuth Configurations', sagaEffect => {
        expect(sagaEffect).toEqual(call(oauthConfigurationSaga));
        const oauthConfiguration: OAuthConfig = {
          endSessionEndpoint: 'http://google.com/log/the/fuck/out',
        };
        return oauthConfiguration;
      });
      it('should ask for configuration state', sagaEffect => {
        expect(sagaEffect).toEqual(select(selectConfigurationState));
        const configurationState: ConfigurationState = {
          initial: {
            provider: 'GOOGLE',
            callbackURI: 'https://lemons.io',
          }
        };
        return configurationState;
      });
      it('should return expected constructed uri', sagaEffect => {
        expect(sagaEffect).toEqual('http://google.com/log/the/fuck/out?continue=https://appengine.google.com/_ah/logout?continue=https://lemons.io');
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when authenticated to Potato', () => {
      const it = sagaHelper(constructRedirectURI());
      it('should ask for OAuth Configurations', sagaEffect => {
        expect(sagaEffect).toEqual(call(oauthConfigurationSaga));
        const oauthConfiguration: OAuthConfig = {
          endSessionEndpoint: 'http://potato.io/log/the/fuck/out',
        };
        return oauthConfiguration;
      });
      it('should ask for configuration state', sagaEffect => {
        expect(sagaEffect).toEqual(select(selectConfigurationState));
        const configurationState: ConfigurationState = {
          initial: {
            provider: 'POTATO',
            callbackURI: 'https://lemons.io',
          }
        };
        return configurationState;
      });
      it('should return expected constructed uri', sagaEffect => {
        expect(sagaEffect).toEqual('http://potato.io/log/the/fuck/out?continue=https://appengine.google.com/_ah/logout?continue=https://lemons.io');
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when authenticated to Nothing', () => {
      const it = sagaHelper(constructRedirectURI());
      it('should ask for OAuth Configurations', sagaEffect => {
        expect(sagaEffect).toEqual(call(oauthConfigurationSaga));
        const oauthConfiguration: OAuthConfig = {
        };
        return oauthConfiguration;
      });
      it('should ask for configuration state', sagaEffect => {
        expect(sagaEffect).toEqual(select(selectConfigurationState));
        const configurationState: ConfigurationState = {
          initial: {
          }
        };
        return configurationState;
      });
      it('should return expected constructed uri', sagaEffect => {
        expect(sagaEffect).toEqual('undefined?continue=https://appengine.google.com/_ah/logout?continue=undefined');
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });

  });

  describe('logoutSaga', () => {
    describe('when authenticated', () => {
      const it = sagaHelper(logoutSaga());
      it('should conduct pre-flight activities', sagaEffect => {
        expect(sagaEffect).toEqual(call(logoffPreFlightSaga));
      });
      it('should ask for a constructed the redirect URI', sagaEffect => {
        expect(sagaEffect).toEqual(call(constructRedirectURI));
        return 'http://logthefuckout.com/log/the/fuck/out?gtfo=now';
      });
      it('should push the new redirect uri', sagaEffect => {
        expect(sagaEffect).toEqual(call(pushRedirect, 'http://logthefuckout.com/log/the/fuck/out?gtfo=now'));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
