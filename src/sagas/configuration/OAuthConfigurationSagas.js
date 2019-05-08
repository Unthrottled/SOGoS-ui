import {put, select, take} from 'redux-saga/effects'
import {RECEIVED_REMOTE_OAUTH_CONFIGURATION, receivedOAuthConfigurations} from "../../events/ConfigurationEvents";
import type {OauthConfig} from "../../reducers/ConfigurationReducer";
import {createOauthConfigurationObject} from "../../security/StupidShit";
import {selectConfigurationState} from "../../reducers";

export function* securityRequestSaga() {
  const oauthConfig = yield fetchOAuthConfiguration();
  yield put(receivedOAuthConfigurations(oauthConfig))
}

export function* fetchOAuthConfiguration(): OauthConfig {
  const {oauth} = yield select(selectConfigurationState);
  if (!oauth.authorizationEndpoint) {
    const {payload} = yield take(RECEIVED_REMOTE_OAUTH_CONFIGURATION);
    return payload;
  } else {
    return createOauthConfigurationObject(oauth);
  }
}
