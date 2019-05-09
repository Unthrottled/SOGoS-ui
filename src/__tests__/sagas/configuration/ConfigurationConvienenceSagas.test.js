import sagaHelper from "redux-saga-testing";
import {put, take} from 'redux-saga/effects';
import {
  createReceivedOAuthConfigurations,
  RECEIVED_OAUTH_CONFIGURATION,
  requestOAuthConfigurations
} from "../../../events/ConfigurationEvents";
import {oAuthConfigurationSaga} from "../../../sagas/configuration/ConfigurationConvienenceSagas";

describe('Configuration Convenience Sagas', () => {
  describe('oAuthConfigurationSaga', () => {
    describe('when requesting configuration', () => {
      const it = sagaHelper(oAuthConfigurationSaga());
      it('should request OAuth configurations', sagaEffect => {
        expect(sagaEffect).toEqual(put(requestOAuthConfigurations()));
      });
      it('should wait patiently for the resulting response', sagaEffect => {
        expect(sagaEffect).toEqual(take(RECEIVED_OAUTH_CONFIGURATION));
        return createReceivedOAuthConfigurations({
          authorizationEndpoint: 'http://authy-auth.io',
        })
      });
      it('should return the correct OAuth Config', sagaEffect => {
        expect(sagaEffect).toEqual({
          authorizationEndpoint: 'http://authy-auth.io',
        });
      });
      it('should then complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });

});
