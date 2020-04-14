import {all, call, delay, put, select, takeEvery} from 'redux-saga/effects';
import md5 from 'md5';
import axios from 'axios';
import {INITIALIZED_SECURITY} from '../events/SecurityEvents';
import {performDelete, performGet, performGetWithoutVerification, performPost} from './APISagas';
import {
  createDownloadedAvatarEvent,
  createFailedToGetUserEvent,
  createFailedToUploadAvatarEvent,
  createReceivedUserEvent,
  createReceivedUserProfileEvent,
  createSyncedSharedDashboardUpdateEvent,
  createUploadedAvatarEvent,
  RECEIVED_PARTIAL_USER,
  RECEIVED_USER,
  RECEIVED_USER_PROFILE,
  SELECTED_AVATAR,
  UPDATED_SHARED_DASHBOARD,
} from '../events/UserEvents';
import {selectSecurityState, selectUserState} from '../reducers';
import {PayloadEvent} from "../events/Event";
import {createShowWarningNotificationEvent} from "../events/MiscEvents";
import {UserState} from "../reducers/UserReducer";
import omit from 'lodash/omit';
import {isNotUnAuthorized} from "./activity/RegisterActivitySaga";
import {User, UserResponse} from "../types/UserTypes";

export function* findUserSaga() {
  const {isLoggedIn} = yield select(selectSecurityState);
  if (isLoggedIn) {
    yield call(requestUserSaga);
  }
}

export function* requestUserSaga() {
  try {
    const {data: user} = yield call(performGetWithoutVerification, '/user');
    yield put(createReceivedUserEvent(user)); // found waldo.
  } catch (e) {
    yield put(createFailedToGetUserEvent(e));
  }
}

export function* userProfileSaga(_: any, attempts: number = 0): Generator {
  try {
    const {
      information: {
        guid
      }
    }: any = yield select(selectUserState);
    const {data: profileInformation}: any = yield call(
      performGet, `/user/${guid}/profile`
    )
    yield put(createReceivedUserProfileEvent(profileInformation));
  } catch (e) {
    if (attempts < 10) {
      yield delay(2000);
      yield call(userProfileSaga, {}, attempts + 1)
    } else {
      // error!
    }
  }
}

export function* sharedDashboardSaga({
                                       payload: hasShared
                                     }: PayloadEvent<boolean>) {
  try {
    const method = hasShared ? performPost : performDelete;
    const {information}: UserState = yield select(selectUserState);
    yield call(method, '/user/share/dashboard/read', omit(information, ['guid', 'localAvatar']))
    yield put(createSyncedSharedDashboardUpdateEvent(hasShared))
    yield call(requestUserSaga);
  } catch (e) {
    yield put(
      createShowWarningNotificationEvent(
        `Unable to ${hasShared ? '' : 'un'}share your dashboard! Try again later, please.`,
      ),
    )
  }
}

export function* presignedAvatarUrlSaga(contentLength: number) {
  const {data} = yield call(performPost, '/user/profile/avatar/create', {contentLength})
  return data;
}


export function* uploadAvatarSaga(
  avatarBlobUrl: string,
) {
  const thing = yield call(axios.get, avatarBlobUrl, {
    responseType: 'blob',
  })
  const presignedUrl = yield call(presignedAvatarUrlSaga, parseInt(thing.headers['content-length']));
  yield call(axios.put, presignedUrl, thing.data, {
    headers: omit(thing.headers, ['content-length']),
  })
  yield call(performPost, '/user/profile/avatar/uploaded', {})
}

export function* userAvatarUploadSaga({
                                        payload
                                      }: PayloadEvent<string>) {
  try {
    yield call(uploadAvatarSaga, payload);
    yield put(createUploadedAvatarEvent(payload));
    yield put(createDownloadedAvatarEvent(payload));
  } catch (e) {
    if (isNotUnAuthorized(e)) {
      yield put(createShowWarningNotificationEvent("Unable to upload your avatar! Try again later please!"));
      yield put(createFailedToUploadAvatarEvent(payload))
    }
  }
}

function buildGravatarURL(payload: UserResponse & User) {
  const resolvedEmail = (payload.information && payload.information.email) || payload.email;
  const hashedEmail = md5(resolvedEmail.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hashedEmail}.jpg?s=256`;
}

function* userAvatarDownloadSaga({
                                   payload
                                 }: PayloadEvent<UserResponse & User>) {
  const gravatar = buildGravatarURL(payload);
  const avatar = (payload.information &&
    payload.information.avatar) || payload.avatar || gravatar;
  if (avatar) {
    try {
      yield call(attemptToDownloadAvatar, avatar)
      return
    } catch (e) {}
    try{
      yield call(attemptToDownloadAvatar, gravatar)
    } catch (e) {

    }
  }
}

function * attemptToDownloadAvatar(avatarUrl: string) {
  const thing = yield call(axios.get, avatarUrl, {
    responseType: 'blob',
  })
  const blobbo: Blob = thing.data;
  if (blobbo.size > 0) {
    const localAvatar = URL.createObjectURL(blobbo);
    yield put(createDownloadedAvatarEvent(localAvatar))
  }
}

function* listenToSecurityEvents() {
  yield takeEvery(INITIALIZED_SECURITY, findUserSaga);
  yield takeEvery(UPDATED_SHARED_DASHBOARD, sharedDashboardSaga);
  yield takeEvery(RECEIVED_PARTIAL_USER, userProfileSaga);
  yield takeEvery(SELECTED_AVATAR, userAvatarUploadSaga);
  yield takeEvery(RECEIVED_USER, userAvatarDownloadSaga);
  yield takeEvery(RECEIVED_USER_PROFILE, userAvatarDownloadSaga);
}

export default function* rootSaga() {
  yield all([listenToSecurityEvents()]);
}
