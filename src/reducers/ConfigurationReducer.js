import {RECEIVED_OAUTH_CONFIGURATION} from "../actions/ConfigurationActions";

export type OauthConfig = {
  authorizationEndpoint: string,
  endSessionEndpoint: string,
  revocationEndpoint: string,
  tokenEndpoint: string,
  userInfoEndpoint: string,
}

export type ConfigurationState = {
  oauth: OauthConfig
}

const INITIAL_CONFIGURATION_STATE : ConfigurationState = {
  oauth: {
    authorizationEndpoint: '',
    endSessionEndpoint: '',
    revocationEndpoint: '',
    tokenEndpoint: '',
    userInfoEndpoint: '',
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
