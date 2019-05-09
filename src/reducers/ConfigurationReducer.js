import {RECEIVED_INITIAL_CONFIGURATION, RECEIVED_REMOTE_OAUTH_CONFIGURATION} from "../events/ConfigurationEvents";

export type OAuthConfig = {
  authorizationEndpoint: string,
  endSessionEndpoint: string,
  revocationEndpoint: string,
  tokenEndpoint: string,
  userInfoEndpoint: string,
}

export type InitialConfig = {
  callbackURI: string,
  clientID: string,
  openIDConnectURI: string,
}

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
  }

};


const ConfigurationReducer = (state = INITIAL_CONFIGURATION_STATE, action) => {
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

export default ConfigurationReducer;
