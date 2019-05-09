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
import {fetchTokenSaga, requestToken} from "../../../sagas/security/TokenSagas";
import {createTokenFailureEvent, createTokenReceptionEvent} from "../../../events/SecurityEvents";

// todo: I am confused
describe('Token Sagas', () => {
  describe('fetchTokenSaga', () => {
    describe('when able to successfully make a request', () => {
      const it = sagaHelper(fetchTokenSaga({
        authorizationEndpoint: 'http://authy-auth.io'
      },{
        clientId: 'cool client',
      }));
      it('should perform the correct request', sagaEffect => {
        expect(sagaEffect).toEqual(call(requestToken, {
          authorizationEndpoint: 'http://authy-auth.io'
        },{
          clientId: 'cool client',
        }));
        return 'BRO, DO YOU EVEN LIFT?';
      });
      it('should dispatch the correct event', sagaEffect => {
        expect(sagaEffect).toEqual(put(createTokenReceptionEvent('BRO, DO YOU EVEN LIFT?')));
      });
      it('should then be complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when not able to successfully make a request', () => {
      const it = sagaHelper(fetchTokenSaga({
        authorizationEndpoint: 'http://authy-auth.io'
      },{
        clientId: 'cool client',
      }));
      it('should perform the correct request', sagaEffect => {
        expect(sagaEffect).toEqual(call(requestToken, {
          authorizationEndpoint: 'http://authy-auth.io'
        },{
          clientId: 'cool client',
        }));
        return new Error(`SHIT'S BROKE, YO.`);
      });
      it('should dispatch the correct event', sagaEffect => {
        expect(sagaEffect).toEqual(
          put(createTokenFailureEvent({
            tokenRequest: {
              clientId: 'cool client',
            },
            error: `SHIT'S BROKE, YO.`
          })));
      });
      it('should then be complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
