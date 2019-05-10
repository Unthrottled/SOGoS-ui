import sagaHelper from 'redux-saga-testing';
import {call, put, select} from 'redux-saga/effects';
import logoutSaga, {constructRedirectURI, logoffPreFlightSaga, pushRedirect} from "../../../sagas/security/LogoutSaga";
import {oAuthConfigurationSaga} from "../../../sagas/configuration/ConfigurationConvienenceSagas";
import type {ConfigurationState, OAuthConfig} from "../../../reducers/ConfigurationReducer";
import {selectConfigurationState} from "../../../reducers";
import {
  authorizationGrantSaga, constructAuthorizationCodeGrantRequest, exchangeAuthorizationGrantForAccessToken,
  loginSaga,
  performAuthorizationGrantFlowSaga
} from "../../../sagas/security/AuthorizationFlowSagas";

describe('Authorization Flow Sagas', () => {
  describe('authorizationGrantSaga', () => {
    describe('when called', () => {
      const it = sagaHelper(authorizationGrantSaga());

      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
  describe('loginSaga', () => {
    describe('when called', () => {
      const it = sagaHelper(loginSaga());

      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });

  });
  describe('performAuthorizationGrantFlowSaga', () => {
    describe('when told to redirect', () => {
      const it = sagaHelper(performAuthorizationGrantFlowSaga(true));

      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when told not to redirect', () => {
      const it = sagaHelper(performAuthorizationGrantFlowSaga(false));

      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
  describe('constructAuthorizationCodeGrantRequest', () => {
    describe('when given stuff', () => {
      const it = sagaHelper(exchangeAuthorizationGrantForAccessToken({
        'stupid': 'shit'
      }, {
        oauth: 'config'
      }));

      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });

  });
  describe('constructAuthorizationCodeGrantRequest', () => {
    describe('when given code', () => {
      const it = sagaHelper(constructAuthorizationCodeGrantRequest({
        internal: {
          code_verifier: 'STUPID SHIT',
        }
      }, {
        code: 'CATS',
      }));

      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when given no code', () => {

    });
  });
});
