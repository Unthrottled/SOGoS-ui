import sagaHelper from "redux-saga-testing";
import {call, put, select, take} from 'redux-saga/effects';
import {
  initialConfigurationFetchSaga,
  initialConfigurationResponseSaga,
  initialConfigurationSaga
} from "../../../sagas/configuration/InitialConfigurationSagas";
import {
  createFailedToGetInitialConfigurationsEvent,
  createFoundInitialConfigurationsEvent,
  createReceivedInitialConfigurationsEvent,
  RECEIVED_INITIAL_CONFIGURATION
} from "../../../events/ConfigurationEvents";
import {selectConfigurationState} from "../../../reducers";
import type {ConfigurationState, InitialConfig} from "../../../reducers/ConfigurationReducer";
import {INITIAL_CONFIGURATION_STATE} from "../../../reducers/ConfigurationReducer";
import {performOpenGet} from "../../../sagas/APISagas";

// todo: I am confused
describe('Initial Configuration Sagas', () => {
  describe('initialConfigurationSaga', () => {
    describe('when able to successfully make a request', () => {
      const it = sagaHelper(initialConfigurationSaga());
      it('should perform the correct request', sagaEffect => {
        expect(sagaEffect).toEqual(call(performOpenGet, './configurations'));
        const initialConfig: InitialConfig = {
          callbackURI: 'http://hollaatyaboi.io',
        };
        return {
          data: {
            ...initialConfig,
          },
        };
      });
      it('should dispatch the correct event', sagaEffect => {
        expect(sagaEffect).toEqual(put(createReceivedInitialConfigurationsEvent({
          callbackURI: 'http://hollaatyaboi.io'
        })));
        return createReceivedInitialConfigurationsEvent({
          'I HAVE NO IDEA': 'WHAT I AM DOING'
        })
      });
      it('should then be complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when not able to successfully make a request', () => {
      const it = sagaHelper(initialConfigurationSaga());
      it('should perform the correct request', sagaEffect => {
        expect(sagaEffect).toEqual(call(performOpenGet, './configurations'));
        return new Error(`SHIT'S BROKE, YO.`);
      });
      it('should dispatch the correct event', sagaEffect => {
        expect(sagaEffect).toEqual(
          put(createFailedToGetInitialConfigurationsEvent(new Error(`SHIT'S BROKE, YO.`))));
      });
      it('should then be complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
  describe('initialConfigurationFetchSaga', () => {
    describe('when it is the first time asking for configurations', () => {
      const it = sagaHelper(initialConfigurationFetchSaga());
      it('should select configuration from state', sagaEffect => {
        expect(sagaEffect).toEqual(select(selectConfigurationState));
        return INITIAL_CONFIGURATION_STATE;
      });
      it('should wait patiently for the initial configuration to be fetched', sagaEffect => {
        expect(sagaEffect).toEqual(take(RECEIVED_INITIAL_CONFIGURATION));
        return createReceivedInitialConfigurationsEvent({
          'I HAVE NO IDEA': 'WHAT I AM DOING'
        })
      });
      it('should return the initial configuration', sagaEffect => {
        expect(sagaEffect).toEqual({
          'I HAVE NO IDEA': 'WHAT I AM DOING'
        });
      });
      it('should then be complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when it is not the first time asking for configurations', () => {
      const it = sagaHelper(initialConfigurationFetchSaga());
      it('should select configuration from state', sagaEffect => {
        expect(sagaEffect).toEqual(select(selectConfigurationState));
        const configurationState: ConfigurationState = {
          initial: {
            openIDConnectURI: 'http://getthatsecurity.yo',
            callbackURI: 'http://getyousum.io',
          }
        };
        return configurationState;
      });
      it('should return the initial configuration from state when callback URI is present', sagaEffect => {
        expect(sagaEffect).toEqual({
          openIDConnectURI: 'http://getthatsecurity.yo',
          callbackURI: 'http://getyousum.io',
        });
      });
      it('should then be complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });

  describe('initialConfigurationResponseSaga', () => {
    describe('when initial configuration is requested', () => {
      const it = sagaHelper(initialConfigurationResponseSaga());
      it('should fetch initial configuration', (result) => {
        expect(result).toEqual(call(initialConfigurationFetchSaga));
        return {
          'IMMA': 'BEE'
        }
      });
      it('should then dispatch the proper event', (result) => {
        expect(result).toEqual(put(createFoundInitialConfigurationsEvent({
          'IMMA': 'BEE'
        })));
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });
});
