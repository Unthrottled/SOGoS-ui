import {AuthorizationServiceConfiguration} from '@openid/appauth'


export const REQUESTED_OAUTH_CONFIGURATION: 'REQUESTED_OAUTH_CONFIGURATION' = 'REQUESTED_OAUTH_CONFIGURATION';
export const RECEIVED_OAUTH_CONFIGURATION: 'RECEIVED_OAUTH_CONFIGURATION' = 'RECEIVED_OAUTH_CONFIGURATION';
export const FAILED_TO_RECEIVE_OAUTH_CONFIGURATION: 'FAILED_TO_RECEIVE_OAUTH_CONFIGURATION' = 'FAILED_TO_RECEIVE_OAUTH_CONFIGURATION';

const failedToGetOAuthConfigurations = () => ({
  type: FAILED_TO_RECEIVE_OAUTH_CONFIGURATION,
});

const receivedOAuthConfigurations = (oauthConfig) => ({
  type: RECEIVED_OAUTH_CONFIGURATION,
  payload: oauthConfig
});

export const requestOAuthConfigurations = () => ({
  type: REQUESTED_OAUTH_CONFIGURATION,
});

export const fetchOAuthConfigurations = (OpenIdUrl) => dispetch => {
  return AuthorizationServiceConfiguration.fetchFromIssuer(OpenIdUrl)
    .then(openIdEndpoints => dispetch(receivedOAuthConfigurations(openIdEndpoints)))
    .catch(error => dispetch(failedToGetOAuthConfigurations(error)))

};


