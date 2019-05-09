import sagaHelper from "redux-saga-testing";
import {call, put, take} from 'redux-saga/effects';
import axios from 'axios/index';
import {
  initialConfigurationFetchSaga,
  initialConfigurationResponseSaga
} from "../../../sagas/configuration/InitialConfigurationSagas";
import {createFoundInitialConfigurationsEvent} from "../../../events/ConfigurationEvents";

describe('Initial Configuration Sagas', () => {
  describe('initialConfigurationResponseSaga', () => {
    describe('when initial configuration is requested', () => {
      const it = sagaHelper(initialConfigurationResponseSaga());
      it('should fetch initial configuration', (result) => {
        expect(result instanceof initialConfigurationFetchSaga).toBeTruthy();
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
