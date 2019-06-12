import sagaHelper from 'redux-saga-testing';
import {call, fork, put, race, take} from 'redux-saga/effects';
import {
  authorizationGrantSaga,
  constructAuthorizationCodeGrantRequest,
  constructAuthorizationRequestHandler,
  exchangeAuthorizationGrantForAccessToken,
  loginSaga,
  performAuthorizationGrantFlowSaga,
  performAuthorizationRequest
} from "../../../sagas/security/AuthorizationFlowSagas";
import {
  createCheckedAuthorizationEvent,
  createLoggedOnAction,
  FAILED_TO_RECEIVE_TOKEN,
  RECEIVED_TOKENS
} from "../../../events/SecurityEvents";
import {
  createFoundInitialConfigurationsEvent,
  createReceivedInitialConfigurationsEvent,
  createRequestForInitialConfigurations,
  FOUND_INITIAL_CONFIGURATION
} from "../../../events/ConfigurationEvents";
import {completeAuthorizationRequest} from "../../../security/StupidShit";
import {AuthorizationRequest, AuthorizationRequestResponse} from "@openid/appauth";
import {oauthConfigurationSaga} from "../../../sagas/configuration/ConfigurationConvienenceSagas";
import type {OAuthConfig} from "../../../reducers/ConfigurationReducer";
import {NodeCrypto} from "@openid/appauth/built/node_support";
import {fetchTokenWithRefreshSaga} from "../../../sagas/security/TokenSagas";

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
      describe('and authorization code is present', () => {
        const it = sagaHelper(performAuthorizationGrantFlowSaga(true));
        it('should attempt to complete authorization code flow', sagaEffect => {
          expect(sagaEffect).toEqual(call(oauthConfigurationSaga));
          const oauthConfig: OAuthConfig = {
            revocationEndpoint: 'https://gtfo.io',
          };
          return oauthConfig;
        });
        it('should request an Authorization Request Handler', sagaEffect => {
          expect(sagaEffect).toEqual(call(constructAuthorizationRequestHandler));
          return 'steve';
        });
        it('should attempt to complete the authorization request', sagaEffect => {
          expect(sagaEffect).toEqual(call(completeAuthorizationRequest, 'steve'));
          const authorizationResult: AuthorizationRequestResponse = {
            request: {
              clientId: 'cool-client'
            }, response: {
              code: 'CATS',
            }
          };
          return authorizationResult;
        });
        it('should then construct an authorization grant request', sagaEffect => {
          expect(sagaEffect).toEqual(call(constructAuthorizationCodeGrantRequest, {
            clientId: 'cool-client',
          }, {
            code: 'CATS'
          }));
          const tokenRequest: TokenRequest = {
            clientId: 'cucumber',
            redirectUri: 'https://help',
          };
          return tokenRequest;
        });
        it('should exchange grant for access token an the such', sagaEffect => {
          expect(sagaEffect).toEqual(call(exchangeAuthorizationGrantForAccessToken, {
            clientId: 'cucumber',
            redirectUri: 'https://help',
          }, {
            revocationEndpoint: 'https://gtfo.io',
          }))
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined();
        });
      });
      describe('and authorization code is not present', () => {
        const it = sagaHelper(performAuthorizationGrantFlowSaga(true));
        it('should attempt to complete authorization code flow', sagaEffect => {
          expect(sagaEffect).toEqual(call(oauthConfigurationSaga));
          const oauthConfig: OAuthConfig = {
            revocationEndpoint: 'https://gtfo.io',
          };
          return oauthConfig;
        });
        it('should request an Authorization Request Handler', sagaEffect => {
          expect(sagaEffect).toEqual(call(constructAuthorizationRequestHandler));
          return 'steve';
        });
        it('should attempt to complete the authorization request', sagaEffect => {
          expect(sagaEffect).toEqual(call(completeAuthorizationRequest, 'steve'));
          return undefined;//no authorization request
        });
        it('should request initial configurations', sagaEffect => {
          expect(sagaEffect).toEqual(put(createRequestForInitialConfigurations()))
        });
        it('should wait patiently for initial configurations', sagaEffect => {
          expect(sagaEffect).toEqual(take(FOUND_INITIAL_CONFIGURATION));
          return createFoundInitialConfigurationsEvent({
            clientID: 'cool-client-id'
          })
        });
        it('should perform authorization request', sagaEffect => {
          expect(sagaEffect.toString()).toEqual(call(performAuthorizationRequest, 'steve', {
            revocationEndpoint: 'https://gtfo.io',
          }, new AuthorizationRequest({
            client_id: 'cool-client-id',
            scope: 'openid profile email',
            response_type: AuthorizationRequest.RESPONSE_TYPE_CODE
          }, new NodeCrypto())).toString())
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined();
        });
      });
    });
    describe('when told to not redirect', () => {
      describe('and authorization code is present', () => {
        const it = sagaHelper(performAuthorizationGrantFlowSaga(false));
        it('should attempt to complete authorization code flow', sagaEffect => {
          expect(sagaEffect).toEqual(call(oauthConfigurationSaga));
          const oauthConfig: OAuthConfig = {
            revocationEndpoint: 'https://gtfo.io',
          };
          return oauthConfig;
        });
        it('should request an Authorization Request Handler', sagaEffect => {
          expect(sagaEffect).toEqual(call(constructAuthorizationRequestHandler));
          return 'steve';
        });
        it('should attempt to complete the authorization request', sagaEffect => {
          expect(sagaEffect).toEqual(call(completeAuthorizationRequest, 'steve'));
          const authorizationResult: AuthorizationRequestResponse = {
            request: {
              clientId: 'cool-client'
            }, response: {
              code: 'CATS',
            }
          };
          return authorizationResult;
        });
        it('should then construct an authorization grant request', sagaEffect => {
          expect(sagaEffect).toEqual(call(constructAuthorizationCodeGrantRequest, {
            clientId: 'cool-client',
          }, {
            code: 'CATS'
          }));
          const tokenRequest: TokenRequest = {
            clientId: 'cucumber',
            redirectUri: 'https://help',
          };
          return tokenRequest;
        });
        it('should exchange grant for access token an the such', sagaEffect => {
          expect(sagaEffect).toEqual(call(exchangeAuthorizationGrantForAccessToken, {
            clientId: 'cucumber',
            redirectUri: 'https://help',
          }, {
            revocationEndpoint: 'https://gtfo.io',
          }))
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined();
        });
      });
      describe('and authorization code is not present', () => {
        const it = sagaHelper(performAuthorizationGrantFlowSaga(false));
        it('should attempt to complete authorization code flow', sagaEffect => {
          expect(sagaEffect).toEqual(call(oauthConfigurationSaga));
          const oauthConfig: OAuthConfig = {
            revocationEndpoint: 'https://gtfo.io',
          };
          return oauthConfig;
        });
        it('should request an Authorization Request Handler', sagaEffect => {
          expect(sagaEffect).toEqual(call(constructAuthorizationRequestHandler));
          return 'steve';
        });
        it('should attempt to complete the authorization request', sagaEffect => {
          expect(sagaEffect).toEqual(call(completeAuthorizationRequest, 'steve'));
          return undefined;//no authorization request
        });
        it('should complete', sagaEffect => {
          expect(sagaEffect).toBeUndefined();
        });
      });
    });
  });
  describe('exchangeAuthorizationGrantForAccessToken', () => {
    describe('when token reception succeeds', () => {
      const it = sagaHelper(exchangeAuthorizationGrantForAccessToken({
        'stupid': 'shit'
      }, {
        oauth: 'config'
      }));
      it('should kick off token fetching promise', sagaEffect => {
        expect(sagaEffect).toEqual(fork(fetchTokenWithRefreshSaga, {
          oauth: 'config'
        }, {
          'stupid': 'shit'
        }))
      });
      it('should listen for token failure and success events', sagaEffect => {
        expect(sagaEffect).toEqual(race({
          tokenReception: take(RECEIVED_TOKENS),
          tokenFailure: take(FAILED_TO_RECEIVE_TOKEN),
        }));
        return {
          tokenReception: 'GOOD BRAH'
        };
      });
      it('should dispatch logged in event', sagaEffect => {
        expect(sagaEffect).toEqual(put(createLoggedOnAction()))
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when token reception fails', () => {
      const it = sagaHelper(exchangeAuthorizationGrantForAccessToken({
        'stupid': 'shit'
      }, {
        oauth: 'config'
      }));
      it('should kick off token fetching promise', sagaEffect => {
        expect(sagaEffect).toEqual(fork(fetchTokenWithRefreshSaga, {
          oauth: 'config'
        }, {
          'stupid': 'shit'
        }))
      });
      it('should listen for token failure and success events', sagaEffect => {
        expect(sagaEffect).toEqual(race({
          tokenReception: take(RECEIVED_TOKENS),
          tokenFailure: take(FAILED_TO_RECEIVE_TOKEN),
        }));
        return {
          tokenFailure: `SHIT'S BROKE, YO`
        };
      });
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
