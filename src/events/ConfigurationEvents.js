import type {InitialConfig, OAuthConfig} from "../types/ConfigurationModels";

export const REQUESTED_OAUTH_CONFIGURATION: 'REQUESTED_OAUTH_CONFIGURATION' = 'REQUESTED_OAUTH_CONFIGURATION';
export const REQUESTED_INITIAL_CONFIGURATION: 'REQUESTED_INITIAL_CONFIGURATION' = 'REQUESTED_INITIAL_CONFIGURATION';
export const FAILED_RECEPTION_INITIAL_CONFIGURATION: 'FAILED_RECEPTION_INITIAL_CONFIGURATION' = 'FAILED_RECEPTION_INITIAL_CONFIGURATION';
export const FOUND_INITIAL_CONFIGURATION: 'FOUND_INITIAL_CONFIGURATION' = 'FOUND_INITIAL_CONFIGURATION';
export const RECEIVED_OAUTH_CONFIGURATION: 'RECEIVED_OAUTH_CONFIGURATION' = 'RECEIVED_OAUTH_CONFIGURATION';
export const RECEIVED_REMOTE_OAUTH_CONFIGURATION: 'RECEIVED_REMOTE_OAUTH_CONFIGURATION' = 'RECEIVED_REMOTE_OAUTH_CONFIGURATION';
export const FAILED_TO_RECEIVE_REMOTE_OAUTH_CONFIGURATION: 'FAILED_TO_RECEIVE_REMOTE_OAUTH_CONFIGURATION' = 'FAILED_TO_RECEIVE_REMOTE_OAUTH_CONFIGURATION';
export const RECEIVED_INITIAL_CONFIGURATION: 'RECEIVED_INITIAL_CONFIGURATION' = 'RECEIVED_INITIAL_CONFIGURATION';
export const NOTIFICATION_ANSWERED: 'NOTIFICATION_ANSWERED' = 'NOTIFICATION_ANSWERED';

export const createFailedToGetRemoteOAuthConfigurationsEvent = () => ({
  type: FAILED_TO_RECEIVE_REMOTE_OAUTH_CONFIGURATION,
});

export const createReceivedOAuthConfigurations = (oauthConfig: OAuthConfig) => ({
  type: RECEIVED_OAUTH_CONFIGURATION,
  payload: oauthConfig
});

export const createNotificationPermissionReceivedEvent = (notificationPermission: String) => ({
  type: NOTIFICATION_ANSWERED,
  payload: notificationPermission,
});

export const createReceivedRemoteOAuthConfigurations = (oauthConfig: OAuthConfig) => ({
  type: RECEIVED_REMOTE_OAUTH_CONFIGURATION,
  payload: oauthConfig
});

export const createReceivedInitialConfigurationsEvent = (initialConfig: InitialConfig) => ({
  type: RECEIVED_INITIAL_CONFIGURATION,
  payload: initialConfig
});

export const createFailedToGetInitialConfigurationsEvent = (error) => ({
  type: FAILED_RECEPTION_INITIAL_CONFIGURATION,
  payload: error,
});

export const createFoundInitialConfigurationsEvent = (initialConfig: InitialConfig) => ({
  type: FOUND_INITIAL_CONFIGURATION,
  payload: initialConfig
});

export const createRequestForInitialConfigurations = () => ({
  type: REQUESTED_INITIAL_CONFIGURATION,
});

export const requestOAuthConfigurations = () => ({
  type: REQUESTED_OAUTH_CONFIGURATION,
});
