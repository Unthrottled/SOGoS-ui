import {INITIAL_SECURITY_STATE, SecurityState, SharedStatus} from '../SecurityReducer';
import {TokenResponse} from '@openid/appauth';
import jwtDecode from 'jwt-decode';
import {ReceivedReadToken, TokenInformation} from "../../types/SecurityTypes";

function mapTokenClaims(decodedToken: any) {
  return {
    issuedAt: decodedToken.iat,
    expiresAt: decodedToken.exp,
    expiresHuman: new Date(decodedToken.exp * 1000 || 0).toISOString(),
  };
}

function decodeAndMapToken(token: string) {
  const decodedToken = jwtDecode(token);
  return mapTokenClaims(decodedToken)
}

function parseRefreshToken(refreshToken: string): TokenInformation {
  try {
    return decodeAndMapToken(refreshToken);
  } catch (e) {
    return INITIAL_SECURITY_STATE.refreshTokenInformation;
  }
}

const getRefreshTokenInformation = (refreshToken: string | undefined) => {
  if (refreshToken) {
    return {
      refreshTokenInformation:  parseRefreshToken(refreshToken),
    };
  } else {
    return {};
  }
};

export const tokenReceptionReducer = (
  state: SecurityState,
  tokenReceptionPayload: TokenResponse,
): SecurityState => {
  const accessToken = tokenReceptionPayload.idToken || tokenReceptionPayload.accessToken;
  return {
    ...state,
    accessToken,
    accessTokenInformation: parseRefreshToken(accessToken),
    ...getRefreshTokenInformation(tokenReceptionPayload.refreshToken),
    refreshToken: tokenReceptionPayload.refreshToken || state.refreshToken,
    idToken: tokenReceptionPayload.idToken,
  };
};

export const readTokenReceptionReducer = (
  state: SecurityState,
  tokenReceptionPayload: ReceivedReadToken,
): SecurityState => ({
  ...state,
  readToken: tokenReceptionPayload.readToken,
  readTokenInformation: decodeAndMapToken(tokenReceptionPayload.readToken),
  readOnly: true,
  hasShared: SharedStatus.SHARED,
});
