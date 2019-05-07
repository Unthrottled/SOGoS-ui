import oauthInitializationSaga from "../../../sagas/security/SecurityInitializationSaga";
import sagaHelper from "redux-saga-testing";
import {put, take, call} from 'redux-saga/effects';

describe('Security Initialization Sagas', () => {
  describe('oauthInitializationSaga', () => {
    describe('when the authorization grant should be checked', () => {
      const it = sagaHelper(oauthInitializationSaga({
        revocationEndpoint: 'http://logthefuckout.com',
      }));
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when the token can be refreshed', () => {
      const it = sagaHelper(oauthInitializationSaga({
        revocationEndpoint: 'http://logthefuckout.com',
      }));
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when the token can be refreshed and authorization grant should be checked', () => {
      const it = sagaHelper(oauthInitializationSaga({
        revocationEndpoint: 'http://logthefuckout.com',
      }));
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when security is all up to date', () => {
      const it = sagaHelper(oauthInitializationSaga({
        revocationEndpoint: 'http://logthefuckout.com',
      }));
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });
});
