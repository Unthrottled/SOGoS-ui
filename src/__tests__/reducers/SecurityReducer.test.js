import type {SecurityState} from "../../reducers/SecurityReducer";
import securityReducer from "../../reducers/SecurityReducer";
import {LOGGED_OFF, LOGGED_ON, RECEIVED_TOKENS} from "../../events/SecurityEvents";

describe('Security Reducer', () => {
  describe('on Logged in', () => {
    it('should preserve state and set logged on when already logged on', () => {
      const securityState: SecurityState = securityReducer({
        isLoggedIn: true,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      }, {
        type: LOGGED_ON,
      });

      expect(securityState).toEqual({
        isLoggedIn: true,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      })
    });
    it('should preserve state and set logged on when not logged on', () => {
      const securityState: SecurityState = securityReducer({
        isLoggedIn: false,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      }, {
        type: LOGGED_ON,
      });

      expect(securityState).toEqual({
        isLoggedIn: true,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      })
    });
  });
  describe('on logged off', () => {
    it('should wipe state and set logged off when already logged on', () => {
      const securityState: SecurityState = securityReducer({
        isLoggedIn: true,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      }, {
        type: LOGGED_OFF,
      });

      expect(securityState).toEqual({
        isLoggedIn: false,
        isExpired: false,
      })
    });
    it('should wipe state and set logged on when not logged on', () => {
      const securityState: SecurityState = securityReducer({
        isLoggedIn: false,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      }, {
        type: LOGGED_OFF,
      });

      expect(securityState).toEqual({
        isLoggedIn: false,
        isExpired: false,
      })
    });
  });
  describe('on token reception', () => {
    it('should take the new stuff from the token event', () => {
      const securityState = securityReducer({
        isLoggedIn: true,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      }, {
        type: RECEIVED_TOKENS,
        payload: {
          accessToken: 'TOTALLY AN ACCESS TOKEN',
          issuedAt: 6969,
          expiresIn: 10000,
          refreshToken: 'ALIVE ACCESS TOKEN',
          idToken: 'WADDUP, PIMPS?',
        }
      });
      expect(securityState).toEqual({
        'accessToken': 'TOTALLY AN ACCESS TOKEN',
        'accessTokenInformation': {'expiresAt': 16969, 'issuedAt': 6969},
        'idToken': 'WADDUP, PIMPS?',
        'isLoggedIn': true,
        'refreshToken': 'ALIVE ACCESS TOKEN'
      });
    });

  });
  describe('on unknown', () => {
    it('should preserve state', () => {
      const securityState: SecurityState = securityReducer({
        isLoggedIn: true,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      }, {
        type: 'pickles',
      });

      expect(securityState).toEqual({
        isLoggedIn: true,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      })
    });
  });
});
