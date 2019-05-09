import sagaHelper from 'redux-saga-testing';
import {put, select, take, call} from 'redux-saga/effects'
import {
  createFoundInitialConfigurationsEvent,
  createReceivedInitialConfigurationsEvent,
  RECEIVED_INITIAL_CONFIGURATION
} from "../../../events/ConfigurationEvents";
import {selectConfigurationState} from "../../../reducers";
import {INITIAL_CONFIGURATION_STATE} from "../../../reducers/ConfigurationReducer";
import {
  initialConfigurationFetchSaga,
  initialConfigurationResponseSaga
} from "../../../sagas/configuration/InitialConfigurationSagas";

describe('Initial Configuration Sagas', () => {
  describe('initialConfigurationResponseSaga', () => {
    describe('when a request for initial Configurations is made', () => {
      const it = sagaHelper(initialConfigurationResponseSaga());
      it('should fetch initial Configurations', sagaEffect => {
        expect(sagaEffect).toEqual(call(initialConfigurationFetchSaga));
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
  describe('initialConfigurationFetchSaga', () => {
    describe('when it is the first time getting configurations', () => {
      const it = sagaHelper(initialConfigurationFetchSaga());
      it('should fetch configuration state', sagaEffect => {
        expect(sagaEffect).toEqual(select(selectConfigurationState));
        return INITIAL_CONFIGURATION_STATE;
      });
      it('should wait patiently for remote configurations', sagaEffect => {
        expect(sagaEffect).toEqual(take(RECEIVED_INITIAL_CONFIGURATION));
        return createReceivedInitialConfigurationsEvent({
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
      const it = sagaHelper(initialConfigurationFetchSaga());
      it('should fetch configuration state', sagaEffect => {
        expect(sagaEffect).toEqual(select(selectConfigurationState));
        return {
          initial: {
            callbackURI: 'http://holla@yaboi.io'
          }
        };
      });
      it('should use what was stored in state', sagaEffect => {
        expect(sagaEffect).toEqual({
          callbackURI: 'http://holla@yaboi.io'
        });
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });
});
