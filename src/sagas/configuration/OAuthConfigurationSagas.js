import {put, select, take, call} from 'redux-saga/effects'
import {RECEIVED_REMOTE_OAUTH_CONFIGURATION, createReceivedOAuthConfigurations} from "../../events/ConfigurationEvents";
import type {OAuthConfig} from "../../reducers/ConfigurationReducer";
import {createOauthConfigurationObject} from "../../security/StupidShit";
import {selectConfigurationState} from "../../reducers";

export function* securityRequestSaga() {
  const oauthConfig = yield call(fetchOAuthConfiguration);
  yield put(createReceivedOAuthConfigurations(oauthConfig))
}

export function* fetchOAuthConfiguration(): OAuthConfig {
  const {oauth} = yield select(selectConfigurationState);
  if (!oauth.authorizationEndpoint) {
    const {payload} = yield take(RECEIVED_REMOTE_OAUTH_CONFIGURATION);
    return payload;
  } else {
    return createOauthConfigurationObject(oauth);
  }
}
