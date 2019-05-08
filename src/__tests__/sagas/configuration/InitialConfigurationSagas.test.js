import sagaHelper from 'redux-saga-testing';
import {all, call, fork, put, select, take, takeEvery} from 'redux-saga/effects'
import {fetchOAuthConfiguration, securityRequestSaga} from "../../../sagas/configuration/OAuthConfigurationSagas";
import {
  createFoundInitialConfigurationsEvent,
  createReceivedRemoteOAuthConfigurations,
  RECEIVED_REMOTE_OAUTH_CONFIGURATION,
  receivedOAuthConfigurations
} from "../../../events/ConfigurationEvents";
import {selectConfigurationState} from "../../../reducers";
import {INITIAL_CONFIGURATION_STATE} from "../../../reducers/ConfigurationReducer";
import {createOauthConfigurationObject} from "../../../security/StupidShit";
import {
  initialConfigurationFetchSaga,
  initialConfigurationResponseSaga
} from "../../../sagas/configuration/InitialConfigurationSagas";

describe('Initial Configuration Sagas', () => {
  describe('initialConfigurationResponseSaga', () => {
    describe('when a request for initial Configurations is made', () => {
      const it = sagaHelper(initialConfigurationResponseSaga());
      it('should fetch initial Configurations', sagaEffect => {
        expect(sagaEffect instanceof initialConfigurationFetchSaga).toBeTruthy();
        return {
          'I AM': 'BECOME DEATH',
        }
      });
      it('should create a completion event', sagaEffect => {
        expect(sagaEffect).toEqual(put(createFoundInitialConfigurationsEvent({
          'I AM': 'BECOME DEATH',
        })))
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });
});
