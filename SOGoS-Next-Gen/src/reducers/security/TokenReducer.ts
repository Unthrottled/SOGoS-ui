import {SecurityState} from "../SecurityReducer";
import {TokenResponse} from "@openid/appauth";
import jwtDecode from 'jwt-decode';

const getRefreshTokenInformation = (refreshToken: string) => {
    if(refreshToken){
        const decodedToken = jwtDecode(refreshToken);
        return {
            refreshTokenInformation:{
                // @ts-ignore
                issuedAt: decodedToken.iat,
                // @ts-ignore
                expiresAt: decodedToken.exp,
            }
        }
    } else {
        return {}
    }
};

export const tokenReceptionReducer = (state: SecurityState,
                                      tokenReceptionPayload: TokenResponse): SecurityState => {
    return {
        ...state,
        accessToken: tokenReceptionPayload.accessToken,
        accessTokenInformation: {
            issuedAt: tokenReceptionPayload.issuedAt,
            expiresAt: tokenReceptionPayload.issuedAt + tokenReceptionPayload.expiresIn
        },
        ...getRefreshTokenInformation(tokenReceptionPayload.refreshToken),
        refreshToken: tokenReceptionPayload.refreshToken || state.refreshToken,
        idToken: tokenReceptionPayload.idToken
    }
};
