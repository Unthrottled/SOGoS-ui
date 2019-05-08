import sagaHelper from 'redux-saga-testing';
import {all, call, fork, put, select, take, takeEvery} from 'redux-saga/effects'
import {fetchOAuthConfiguration, securityRequestSaga} from "../../../sagas/configuration/OAuthConfigurationSagas";

describe('OAuth Configuration Sagas', () => {
  describe('securityRequestSaga', () => {
    describe('when a request for OAuth Configurations is made', () => {
      const it = sagaHelper(securityRequestSaga());
      it('should fetch OAuth Configurations', sagaEffect => {

      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });
  describe('fetchOAuthConfiguration', () => {
    const it = sagaHelper(fetchOAuthConfiguration());
    it('should fetch configuration state', sagaEffect => {

    });
    it('should complete', (result) => {
      expect(result).toBeUndefined();
    });
  });
});
