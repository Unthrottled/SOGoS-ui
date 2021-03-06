import {TokenRequest, TokenResponse} from '@openid/appauth';
import {OAuthConfig} from '../types/ConfigurationTypes';
import {PayloadEvent} from "./Event";
import {ReceivedReadToken} from "../types/SecurityTypes";

export const LOGGED_ON: 'LOGGED_ON' = 'LOGGED_ON';
export const LOGGED_OFF: 'LOGGED_OFF' = 'LOGGED_OFF';
export const REQUESTED_LOGOFF: 'REQUESTED_LOGOFF' = 'REQUESTED_LOGOFF';
export const REQUESTED_LOGON: 'REQUESTED_LOGON' = 'REQUESTED_LOGON';
export const REQUESTED_READ_ONLY_MODE: 'REQUESTED_READ_ONLY_MODE' = 'REQUESTED_READ_ONLY_MODE';
export const REQUESTED_AUTH_CHECK: 'REQUESTED_AUTH_CHECK' =
  'REQUESTED_AUTH_CHECK';
export const CHECKED_AUTH: 'CHECKED_AUTH' = 'CHECKED_AUTH';
export const FORCED_LOGIN: 'FORCED_LOGIN' = 'FORCED_LOGIN';
export const RECEIVED_TOKENS: 'RECEIVED_TOKENS' = 'RECEIVED_TOKENS';
export const FAILED_TO_RECEIVE_TOKEN: 'FAILED_TO_RECEIVE_TOKEN' =
  'FAILED_TO_RECEIVE_TOKEN';
export const INITIALIZED_SECURITY: 'INITIALIZED_SECURITY' =
  'INITIALIZED_SECURITY';
export const EXPIRED_SESSION: 'EXPIRED_SESSION' = 'EXPIRED_SESSION';
export const RECEIVED_READ_TOKEN: 'RECEIVED_READ_TOKEN' = 'RECEIVED_READ_TOKEN';
export const FAILED_TO_RECEIVE_READ_TOKEN: 'FAILED_TO_RECEIVE_READ_TOKEN' = 'FAILED_TO_RECEIVE_READ_TOKEN';

export const createReceivedReadToken = (readTokenPayload: ReceivedReadToken): PayloadEvent<ReceivedReadToken> => ({
  type: RECEIVED_READ_TOKEN,
  payload: readTokenPayload,
});

export const createFailedToReceiveReadToken =
  (userIdentifier: string): PayloadEvent<string> => ({
    type: FAILED_TO_RECEIVE_READ_TOKEN,
    payload: userIdentifier,
  })

export const requestLogoff = () => ({
  type: REQUESTED_LOGOFF,
});

export const createRequestedReadOnlyMode = () => ({
  type: REQUESTED_READ_ONLY_MODE,
});

export const createRequestLogonEvent = (identityProvider: string): PayloadEvent<string> => ({
  type: REQUESTED_LOGON,
  payload: identityProvider,
});

export const createForcedLoginEvent = () => ({
  type: FORCED_LOGIN,
});

export const createExpiredSessionEvent = () => ({
  type: EXPIRED_SESSION,
});

export const requestAuthorizationGrantCheck = (oauthConfig: OAuthConfig) => ({
  type: REQUESTED_AUTH_CHECK,
  payload: oauthConfig,
});

export const createTokenReceptionEvent = (tokenResponse: TokenResponse) => ({
  type: RECEIVED_TOKENS,
  payload: tokenResponse,
});

export type TokenFailurePayload = {
  tokenRequest: TokenRequest;
  error: any;
};

export const createTokenFailureEvent = (
  tokenFailurePayload: TokenFailurePayload,
) => ({
  type: FAILED_TO_RECEIVE_TOKEN,
  payload: tokenFailurePayload,
});

export const createSecurityInitializedEvent = () => ({
  type: INITIALIZED_SECURITY,
});

export const createCheckedAuthorizationEvent = () => ({
  type: CHECKED_AUTH,
});

export const createLoggedOffEvent = () => ({
  type: LOGGED_OFF,
});

export const createLoggedOnAction = () => ({
  type: LOGGED_ON,
});
