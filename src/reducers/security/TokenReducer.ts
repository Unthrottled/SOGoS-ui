import {SecurityState} from '../SecurityReducer';
import {TokenResponse} from '@openid/appauth';
import jwtDecode from 'jwt-decode';
import {ReceivedReadToken} from "../../types/SecurityTypes";

function mapTokenClaims(decodedToken: any) {
  return {
    issuedAt: decodedToken.iat,
    expiresAt: decodedToken.exp,
  };
}

function decodeAndMapToken(token: string) {
  const decodedToken = jwtDecode(token);
  return mapTokenClaims(decodedToken)
}

const getRefreshTokenInformation = (refreshToken: string | undefined) => {
  if (refreshToken) {
    return {
      refreshTokenInformation: decodeAndMapToken(refreshToken),
    };
  } else {
    return {};
  }
};

export const tokenReceptionReducer = (
  state: SecurityState,
  tokenReceptionPayload: TokenResponse,
): SecurityState => {
  return {
    ...state,
    accessToken: tokenReceptionPayload.accessToken,
    accessTokenInformation: {
      issuedAt: tokenReceptionPayload.issuedAt,
      expiresAt:
        tokenReceptionPayload.issuedAt + (tokenReceptionPayload.expiresIn || 0),
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
});
