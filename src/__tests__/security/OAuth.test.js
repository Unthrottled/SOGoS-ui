import type {SecurityState} from "../../reducers/SecurityReducer";
import {canRefreshToken, shouldCheckForAuthorizationGrant} from "../../security/OAuth";
import {nowInSeconds} from "@openid/appauth";

describe('OAuth', () => {
  describe('needsToLogin', () => {
    it('should return true when input is not present', () => {

      const result = shouldCheckForAuthorizationGrant();

      expect(result).toBeTruthy()
    });

    it('should return true when access token is not present', () => {
      const securityState: SecurityState = {};

      const result = shouldCheckForAuthorizationGrant(securityState);

      expect(result).toBeTruthy()
    });

    it('should return true when access token information is not present', () => {
      const securityState: SecurityState = {
        accessTokenInformation: {

        }
      };

      const result = shouldCheckForAuthorizationGrant(securityState);

      expect(result).toBeTruthy()
    });

    it('should return true when access token expired a long time ago', () => {
      const securityState: SecurityState = {
        accessTokenInformation: {
          expiresAt: 0
        }
      };

      const result = shouldCheckForAuthorizationGrant(securityState);

      expect(result).toBeTruthy()
    });

    it('should return false when access token expires in the future', () => {
      const securityState: SecurityState = {
        accessTokenInformation: {
          expiresAt: nowInSeconds() + 100
        }
      };

      const result = shouldCheckForAuthorizationGrant(securityState);

      expect(result).toBeFalsy()
    });
  });
  describe('canRefreshToken', () => {
    it('should return false when input is not present', () => {

      const result = canRefreshToken();

      expect(result).toBeFalsy()
    });

    it('should return false when access token is not present', () => {
      const securityState: SecurityState = {};

      const result = canRefreshToken(securityState);

      expect(result).toBeFalsy()
    });

    it('should return false when access token information is not present', () => {
      const securityState: SecurityState = {
        accessTokenInformation: {

        }
      };

      const result = canRefreshToken(securityState);

      expect(result).toBeFalsy()
    });

    it('should return false when access token expired a long time ago', () => {
      const securityState: SecurityState = {
        accessTokenInformation: {
          expiresAt: 0
        }
      };

      const result = canRefreshToken(securityState);

      expect(result).toBeFalsy()
    });

    it('should return true when access token is not present, and refresh token is present', () => {
      const securityState: SecurityState = {
        refreshToken: 'I AM REFRESH TOKEN',
      };

      const result = canRefreshToken(securityState);

      expect(result).toBeTruthy()
    });

    it('should return true when access token information is not present, and refresh token is present', () => {
      const securityState: SecurityState = {
        refreshToken: 'I AM REFRESH TOKEN',
        accessTokenInformation: {

        }
      };

      const result = canRefreshToken(securityState);

      expect(result).toBeTruthy()
    });

    it('should return true when access token expired a long time ago, and refresh token is present', () => {
      const securityState: SecurityState = {
        refreshToken: 'I AM REFRESH TOKEN',
        accessTokenInformation: {
          expiresAt: 0
        }
      };

      const result = canRefreshToken(securityState);

      expect(result).toBeTruthy()
    });

    it('should return false when access token expires in the future, and has refresh token', () => {
      const securityState: SecurityState = {
        refreshToken: 'I AM REFRESH TOKEN',
        accessTokenInformation: {
          expiresAt: nowInSeconds() + 100
        }
      };

      const result = canRefreshToken(securityState);

      expect(result).toBeFalsy()
    });

    it('should return false when access token expires in the future, and is missing refresh token', () => {
      const securityState: SecurityState = {
        accessTokenInformation: {
          expiresAt: nowInSeconds() + 100
        }
      };

      const result = canRefreshToken(securityState);

      expect(result).toBeFalsy()
    });
  });
});
