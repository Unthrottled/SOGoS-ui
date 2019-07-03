import {RECEIVED_INITIAL_CONFIGURATION, RECEIVED_REMOTE_OAUTH_CONFIGURATION} from "../events/ConfigurationEvents";
import {Action} from "redux";
import type {InitialConfig, OAuthConfig} from "../types/ConfigurationModels";

export type ConfigurationState = {
  oauth: OAuthConfig,
  initial: InitialConfig,
}

export const INITIAL_CONFIGURATION_STATE: ConfigurationState = {
  oauth: {
    authorizationEndpoint: '',
    endSessionEndpoint: '',
    revocationEndpoint: '',
    tokenEndpoint: '',
    userInfoEndpoint: '',
  },
  initial: {
    callbackURI: '',
    clientID: '',
    openIDConnectURI: '',
    provider: '',
  }
};


export const configurationReducer = (state: ConfigurationState = INITIAL_CONFIGURATION_STATE, action: Action) => {
  switch (action.type) {
    case RECEIVED_REMOTE_OAUTH_CONFIGURATION :
      return {
        ...state,
        oauth: {
          ...state.oauth,
          ...action.payload
        }
      };
    case RECEIVED_INITIAL_CONFIGURATION:
      return {
        ...state,
        initial: {
          ...state.initial,
          ...action.payload,
        }
      };
    default:
      return state
  }
};

export default configurationReducer;
