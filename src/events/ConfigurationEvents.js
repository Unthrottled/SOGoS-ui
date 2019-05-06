import type {InitialConfig} from "../reducers/ConfigurationReducer";


export const REQUESTED_OAUTH_CONFIGURATION: 'REQUESTED_OAUTH_CONFIGURATION' = 'REQUESTED_OAUTH_CONFIGURATION';
export const REQUESTED_INITIAL_CONFIGURATION: 'REQUESTED_INITIAL_CONFIGURATION' = 'REQUESTED_INITIAL_CONFIGURATION';
export const FOUND_INITIAL_CONFIGURATION: 'FOUND_INITIAL_CONFIGURATION' = 'FOUND_INITIAL_CONFIGURATION';
export const RECEIVED_OAUTH_CONFIGURATION: 'RECEIVED_OAUTH_CONFIGURATION' = 'RECEIVED_OAUTH_CONFIGURATION';
export const RECEIVED_REMOTE_OAUTH_CONFIGURATION: 'RECEIVED_REMOTE_OAUTH_CONFIGURATION' = 'RECEIVED_REMOTE_OAUTH_CONFIGURATION';
export const FAILED_TO_RECEIVE_REMOTE_OAUTH_CONFIGURATION: 'FAILED_TO_RECEIVE_REMOTE_OAUTH_CONFIGURATION' = 'FAILED_TO_RECEIVE_REMOTE_OAUTH_CONFIGURATION';
export const RECEIVED_INITIAL_CONFIGURATION: 'RECEIVED_INITIAL_CONFIGURATION' = 'RECEIVED_INITIAL_CONFIGURATION';

export const failedToGetRemoteOAuthConfigurations = () => ({
  type: FAILED_TO_RECEIVE_REMOTE_OAUTH_CONFIGURATION,
});

export const receivedOAuthConfigurations = (oauthConfig) => ({
  type: RECEIVED_OAUTH_CONFIGURATION,
  payload: oauthConfig
});

export const createReceivedRemoteOAuthConfigurations = (oauthConfig) => ({
  type: RECEIVED_REMOTE_OAUTH_CONFIGURATION,
  payload: oauthConfig
});

export const createReceivedInitialConfigurationsEvent = (initialConfig: InitialConfig) => ({
  type: RECEIVED_INITIAL_CONFIGURATION,
  payload: initialConfig
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
