import {SecurityState, SharedStatus} from '../SecurityReducer';
import {TokenResponse} from '@openid/appauth';
import jwtDecode from 'jwt-decode';
import {ReceivedReadToken} from "../../types/SecurityTypes";

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

// todo: verify that refresh token might come back?
const getRefreshTokenInformation = (refreshToken: string | undefined) => {
  if (refreshToken) {
    return {
      // refreshTokenInformation: decodeAndMapToken(refreshToken),
    };
  } else {
    return {};
  }
};

export const tokenReceptionReducer = (
  state: SecurityState,
  tokenReceptionPayload: TokenResponse,
): SecurityState => {
  const expiresAt = tokenReceptionPayload.issuedAt + (tokenReceptionPayload.expiresIn || 0);
  return {
    ...state,
    accessToken: tokenReceptionPayload.idToken || tokenReceptionPayload.accessToken,
    accessTokenInformation: {
      issuedAt: tokenReceptionPayload.issuedAt,
      expiresAt: expiresAt,
      expiresHuman: new Date(expiresAt * 1000).toISOString(),
    },
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
