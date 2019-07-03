import sagaHelper from "redux-saga-testing";
import {call, put} from 'redux-saga/effects';
import {initialConfigurationFetchSaga} from "../../../sagas/configuration/InitialConfigurationSagas";
import {
  createFailedToGetRemoteOAuthConfigurationsEvent,
  createReceivedRemoteOAuthConfigurations
} from "../../../events/ConfigurationEvents";
import type {InitialConfig, OAuthConfig} from "../../../types/ConfigurationModels";
import {
  authorizationServiceConfigurationSaga,
  fetchConfigurationsFromIssuer
} from "../../../sagas/configuration/ConfigurationSetupSagas";

describe('Configuration Setup Sagas', () => {
  describe('authorizationServiceConfigurationSaga', () => {
    describe('when successfully able to talk to authorization server', () => {
      const it = sagaHelper(authorizationServiceConfigurationSaga());
      it('should request initial configurations', sagaEffect => {
        expect(sagaEffect).toEqual(call(initialConfigurationFetchSaga));
        const initialConfig: InitialConfig = {
          openIDConnectURI: 'http://allyourbase.io',
        };
        return initialConfig;
      });
      it('should call the correct authorization server', sagaEffect => {
        expect(sagaEffect).toEqual(call(fetchConfigurationsFromIssuer, 'http://allyourbase.io'));
        const oauthConfig: OAuthConfig = {
          authorizationEndpoint: 'http://auth'
        };
        return oauthConfig;
      });
      it('should dispetch correct event', sagaEffect => {
        expect(sagaEffect).toEqual(put(createReceivedRemoteOAuthConfigurations({
          authorizationEndpoint: 'http://auth'
        })))
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when not able to talk to authorization server', () => {
      const it = sagaHelper(authorizationServiceConfigurationSaga());
      it('should request initial configurations', sagaEffect => {
        expect(sagaEffect).toEqual(call(initialConfigurationFetchSaga));
        const initialConfig: InitialConfig = {
          openIDConnectURI: 'http://allyourbase.io',
        };
        return initialConfig;
      });
      it('should call the correct authorization server', sagaEffect => {
        expect(sagaEffect).toEqual(call(fetchConfigurationsFromIssuer, 'http://allyourbase.io'));
        return new Error(`SHIT'S BROKE, YO.`);
      });
      it('should dispetch correct failure event', sagaEffect => {
        expect(sagaEffect).toEqual(put(createFailedToGetRemoteOAuthConfigurationsEvent(`SHIT'S BROKE, YO.`)))
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
