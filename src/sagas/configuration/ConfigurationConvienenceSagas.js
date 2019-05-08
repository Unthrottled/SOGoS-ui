import {put, take} from 'redux-saga/effects'
import {RECEIVED_OAUTH_CONFIGURATION, requestOAuthConfigurations} from "../../events/ConfigurationEvents";

// todo: this feels weird
export function* oAuthConfigurationSaga(): OauthConfig {
  yield put(requestOAuthConfigurations()); // ask for oauth configurations
  const {payload: oauthConfig} = yield take(RECEIVED_OAUTH_CONFIGURATION); // yay configurations!
  return oauthConfig;
}
