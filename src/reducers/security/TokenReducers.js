import type {SecurityState} from "../SecurityReducer";
import {TokenResponse} from "@openid/appauth";


export const tokenReceptionReducer = (state: SecurityState, tokenReceptionPayload: TokenResponse): SecurityState => {
  return {
    ...state,
    accessToken: tokenReceptionPayload.accessToken,
    accessTokenInformation: {
      issuedAt: tokenReceptionPayload.issuedAt,
      expiresAt: tokenReceptionPayload.issuedAt + tokenReceptionPayload.expiresIn
    },
    refreshToken: tokenReceptionPayload.refreshToken,
    idToken: tokenReceptionPayload.idToken
  }
};