import sagaHelper from 'redux-saga-testing';
import {call, put, take} from 'redux-saga/effects';
import {
  authorizationGrantSaga,
  constructAuthorizationCodeGrantRequest,
  exchangeAuthorizationGrantForAccessToken,
  loginSaga,
  performAuthorizationGrantFlowSaga
} from "../../../sagas/security/AuthorizationFlowSagas";
import {createCheckedAuthorizationEvent} from "../../../events/SecurityEvents";
import {
  createReceivedInitialConfigurationsEvent,
  createRequestForInitialConfigurations,
  FOUND_INITIAL_CONFIGURATION
} from "../../../events/ConfigurationEvents";

describe('Authorization Flow Sagas', () => {
  describe('authorizationGrantSaga', () => {
    describe('when called', () => {
      const it = sagaHelper(authorizationGrantSaga());
      it('should perform non-login authorization grant check', sagaEffect => {
        expect(sagaEffect).toEqual(call(performAuthorizationGrantFlowSaga, false));
      });
      it('should broadcast completeness', sagaEffect => {
        expect(sagaEffect).toEqual(put(createCheckedAuthorizationEvent()));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
  describe('loginSaga', () => {
    describe('when called', () => {
      const it = sagaHelper(loginSaga());
      it('should perform non-login authorization grant check', sagaEffect => {
        expect(sagaEffect).toEqual(call(performAuthorizationGrantFlowSaga, true));
      });
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
  describe('exchangeAuthorizationGrantForAccessToken', () => {
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
      it('should ask for initial configurations', sagaEffect => {
        expect(sagaEffect).toEqual(put(createRequestForInitialConfigurations()));
      });
      it('should wait patiently for the response', sagaEffect => {
        expect(sagaEffect).toEqual(take(FOUND_INITIAL_CONFIGURATION));
        return createReceivedInitialConfigurationsEvent({
          callbackURI: 'https://potato.io',
          clientID: 'cool-client',
        })
      });
      it('should return the expected request', sagaEffect => {
        expect(sagaEffect).toEqual({
          "clientId": "cool-client",
          "code": "CATS",
          "extras": {"code_verifier": "STUPID SHIT"},
          "grantType": "authorization_code",
          "redirectUri": "https://potato.io",
          "refreshToken": undefined
        })
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when given no code', () => {
      const it = sagaHelper(constructAuthorizationCodeGrantRequest({
        no: 'code'
      }, {
        code: 'CATS',
      }));
      it('should ask for initial configurations', sagaEffect => {
        expect(sagaEffect).toEqual(put(createRequestForInitialConfigurations()));
      });
      it('should wait patiently for the response', sagaEffect => {
        expect(sagaEffect).toEqual(take(FOUND_INITIAL_CONFIGURATION));
        return createReceivedInitialConfigurationsEvent({
          callbackURI: 'https://potato.io',
          clientID: 'cool-client',
        })
      });
      it('should return the expected request', sagaEffect => {
        expect(sagaEffect).toEqual({
          "clientId": "cool-client",
          "code": "CATS",
          "extras": {"code_verifier": undefined},
          "grantType": "authorization_code",
          "redirectUri": "https://potato.io",
          "refreshToken": undefined
        })
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
