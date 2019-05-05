import {RECEIVED_OAUTH_CONFIGURATION} from "../events/ConfigurationEvents";

export type OauthConfig = {
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
  oauth: OauthConfig,
  initial: InitialConfig,
}

const INITIAL_CONFIGURATION_STATE : ConfigurationState = {
  oauth: {
    authorizationEndpoint: '',
    endSessionEndpoint: '',
    revocationEndpoint: '',
    tokenEndpoint: '',
    userInfoEndpoint: '',
  },
  initial: {
    callbackURI: 'http://localhost:3000',
    clientID: 'sogos-app',
    openIDConnectURI: 'http://localhost:8080/auth/realms/master',
  }

};


const ConfigurationReducer = (state = INITIAL_CONFIGURATION_STATE, action) => {
  switch (action.type) {
    case RECEIVED_OAUTH_CONFIGURATION :
      return {
        ...state,
        oauth: {
          ...state.oauth,
          ...action.payload
        }
      };
    default:
      return state
  }
};

export default ConfigurationReducer;
