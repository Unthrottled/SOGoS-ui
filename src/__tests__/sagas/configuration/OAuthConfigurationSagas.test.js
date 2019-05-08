import sagaHelper from 'redux-saga-testing';
import {put, select, take} from 'redux-saga/effects'
import {fetchOAuthConfiguration, securityRequestSaga} from "../../../sagas/configuration/OAuthConfigurationSagas";
import {
  createReceivedRemoteOAuthConfigurations,
  RECEIVED_REMOTE_OAUTH_CONFIGURATION,
  receivedOAuthConfigurations
} from "../../../events/ConfigurationEvents";
import {selectConfigurationState} from "../../../reducers";
import {INITIAL_CONFIGURATION_STATE} from "../../../reducers/ConfigurationReducer";
import {createOauthConfigurationObject} from "../../../security/StupidShit";

describe('OAuth Configuration Sagas', () => {
  describe('securityRequestSaga', () => {
    describe('when a request for OAuth Configurations is made', () => {
      const it = sagaHelper(securityRequestSaga());
      it('should fetch OAuth Configurations', sagaEffect => {
        expect(sagaEffect instanceof fetchOAuthConfiguration).toBeTruthy();
        return {
          'I AM': 'BECOME DEATH',
        }
      });
      it('should create a completion event', sagaEffect => {
        expect(sagaEffect).toEqual(put(receivedOAuthConfigurations({
          'I AM': 'BECOME DEATH',
        })))
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });
  describe('fetchOAuthConfiguration', () => {
    describe('when it is the first time getting configurations', () => {
      const it = sagaHelper(fetchOAuthConfiguration());
      it('should fetch configuration state', sagaEffect => {
        expect(sagaEffect).toEqual(select(selectConfigurationState));
        return INITIAL_CONFIGURATION_STATE;
      });
      it('should wait patiently for remote configurations', sagaEffect => {
        expect(sagaEffect).toEqual(take(RECEIVED_REMOTE_OAUTH_CONFIGURATION));
        return createReceivedRemoteOAuthConfigurations({
          'HEY': 'MONIKA'
        });
      });
      it('should return configuration', sagaEffect => {
        expect(sagaEffect).toEqual({
          'HEY': 'MONIKA',
        });
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when it is not the first time getting configurations', () => {
      const it = sagaHelper(fetchOAuthConfiguration());
      it('should fetch configuration state', sagaEffect => {
        expect(sagaEffect).toEqual(select(selectConfigurationState));
        return {
          oauth: {
            authorizationEndpoint: 'http://logthefuckon.com'
          }
        };
      });
      it('should use what was stored in state', sagaEffect => {
        expect(sagaEffect.toJson()).toEqual(createOauthConfigurationObject({
          authorizationEndpoint: 'http://logthefuckon.com'
        }).toJson());
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });
});
