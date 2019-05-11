import {configurationReducer} from '../../reducers/ConfigurationReducer';
import {RECEIVED_INITIAL_CONFIGURATION, RECEIVED_REMOTE_OAUTH_CONFIGURATION} from '../../events/ConfigurationEvents';

describe('Configuration Reducer', () => {
  describe('on remote OAuth configuration scrape', () => {
    const configurationState: ConfigurationState = configurationReducer({
      oauth: {
        authorizationEndpoint: 'http://potato.io/auth',
        endSessionEndpoint: 'http://potato.io/end',
        revocationEndpoint: 'http://potato.io/revoke',
        tokenEndpoint: 'http://potato.io/token',
        userInfoEndpoint: 'http://potato.io/user',
      }, initial: {
        clientID: 'cool-client',
        callbackURI: 'https://holla.back',
        provider: 'AUTHY-AUTH',
        openIDConnectURI: 'https://openid.io',
      }
    }, {
      type: RECEIVED_REMOTE_OAUTH_CONFIGURATION,
      payload: {
        authorizationEndpoint: 'http://tuba.io/auth',
        endSessionEndpoint: 'http://tuba.io/end',
        tokenEndpoint: 'http://tuba.io/token',
        userInfoEndpoint: 'http://tuba.io/user',
      }
    });

    expect(configurationState).toEqual({
      'initial': {
        'callbackURI': 'https://holla.back',
        'clientID': 'cool-client',
        'openIDConnectURI': 'https://openid.io',
        'provider': 'AUTHY-AUTH'
      },
      'oauth': {
        'authorizationEndpoint': 'http://tuba.io/auth',
        'endSessionEndpoint': 'http://tuba.io/end',
        'revocationEndpoint': 'http://potato.io/revoke',
        'tokenEndpoint': 'http://tuba.io/token',
        'userInfoEndpoint': 'http://tuba.io/user'
      }
    });

  });
  describe('on reception of initial configurations', () => {
    const configurationState: ConfigurationState = configurationReducer({
      oauth: {
        authorizationEndpoint: 'http://potato.io/auth',
        endSessionEndpoint: 'http://potato.io/end',
        revocationEndpoint: 'http://potato.io/revoke',
        tokenEndpoint: 'http://potato.io/token',
        userInfoEndpoint: 'http://potato.io/user',
      }, initial: {
        clientID: 'cool-client',
        callbackURI: 'https://holla.back',
        provider: 'AUTHY-AUTH',
        openIDConnectURI: 'https://openid.io',
      }
    }, {
      type: RECEIVED_INITIAL_CONFIGURATION,
      payload: {
        clientID: 'pink-guy',
        provider: 'FRANCIS-OF-THE-FILTH'
      }
    });

    expect(configurationState).toEqual({
      'initial': {
        'callbackURI': 'https://holla.back',
        'clientID': 'pink-guy',
        'openIDConnectURI': 'https://openid.io',
        'provider': 'FRANCIS-OF-THE-FILTH'
      },
      'oauth': {
        'authorizationEndpoint': 'http://potato.io/auth',
        'endSessionEndpoint': 'http://potato.io/end',
        'revocationEndpoint': 'http://potato.io/revoke',
        'tokenEndpoint': 'http://potato.io/token',
        'userInfoEndpoint': 'http://potato.io/user'
      }
    });
  });
  describe('on unknown event', () => {
    it('should return given state', () => {
      const configurationState: ConfigurationState = configurationReducer({
        oauth: {
          authorizationEndpoint: 'http://potato.io/auth',
          endSessionEndpoint: 'http://potato.io/end',
          revocationEndpoint: 'http://potato.io/revoke',
          tokenEndpoint: 'http://potato.io/token',
          userInfoEndpoint: 'http://potato.io/user',
        }, initial: {
          clientID: 'cool-client',
          callbackURI: 'https://holla.back',
          provider: 'AUTHY-AUTH',
          openIDConnectURI: 'https://openid.io',
        }
      }, {
        type: 'STANLEY-STEAMER',
        payload: {
          clientID: 'pink-guy',
          provider: 'FRANCIS-OF-THE-FILTH'
        }
      });

      expect(configurationState).toEqual({
        oauth: {
          authorizationEndpoint: 'http://potato.io/auth',
          endSessionEndpoint: 'http://potato.io/end',
          revocationEndpoint: 'http://potato.io/revoke',
          tokenEndpoint: 'http://potato.io/token',
          userInfoEndpoint: 'http://potato.io/user',
        }, initial: {
          clientID: 'cool-client',
          callbackURI: 'https://holla.back',
          provider: 'AUTHY-AUTH',
          openIDConnectURI: 'https://openid.io',
        }
      });

    });
  });
});
