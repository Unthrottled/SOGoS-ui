import {put, take} from 'redux-saga/effects'
import {RECEIVED_OAUTH_CONFIGURATION, requestOAuthConfigurations} from "../../events/ConfigurationEvents";

export function* oauthConfigurationSaga(): OAuthConfig {
  yield put(requestOAuthConfigurations()); // ask for oauth configurations
  const {payload: oauthConfig} = yield take(RECEIVED_OAUTH_CONFIGURATION); // yay configurations!
  return oauthConfig;
}
