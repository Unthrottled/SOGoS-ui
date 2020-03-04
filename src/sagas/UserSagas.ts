import {all, call, delay, put, select, takeEvery} from 'redux-saga/effects';
import axios from 'axios';
import {INITIALIZED_SECURITY, RECEIVED_READ_TOKEN} from '../events/SecurityEvents';
import {performDelete, performGet, performGetWithoutVerification, performPost} from './APISagas';
import {
  createFailedToGetUserEvent,
  createReceivedUserEvent,
  createReceivedUserProfileEvent,
  createSyncedSharedDashboardUpdateEvent,
  createUploadedAvatarEvent,
  SELECTED_AVATAR,
  UPDATED_SHARED_DASHBOARD,
} from '../events/UserEvents';
import {selectSecurityState, selectUserState} from '../reducers';
import {PayloadEvent} from "../events/Event";
import {createShowWarningNotificationEvent} from "../events/MiscEvents";
import {UserState} from "../reducers/UserReducer";
import omit from 'lodash/omit';
import {isNotUnAuthorized} from "./activity/RegisterActivitySaga";
import {stringify} from "querystring";

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
    console.tron(e.message)
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
    yield call(method, '/user/share/dashboard/read', omit(information, ['guid']))
    yield put(createSyncedSharedDashboardUpdateEvent(hasShared))
  } catch (e) {
    yield put(
      createShowWarningNotificationEvent(
        `Unable to ${hasShared ? '' : 'un'}share your dashboard! Try again later, please.`,
      ),
    )
  }
}

export function* presignedAvatarUrlSaga() {
  const {data} = yield call(performPost, '/user/profile/avatar/create', {})
  return data;
}


export function* uploadAvatarSaga(
  presignedUrl: string,
  avatarBlobUrl: string,
) {
  const thing = yield call(axios.get, avatarBlobUrl)
  console.log(thing);
  yield call(axios.put, presignedUrl, thing.data, {
    headers: thing.headers
  })
  // then upload
}

export function* userAvatarUploadSaga({
                                 payload
                               }: PayloadEvent<string>) {
  try {
    const presignedUrl = yield call(presignedAvatarUrlSaga);
    yield call(uploadAvatarSaga, presignedUrl, payload);
    // yield delay(3000);
    yield put(createUploadedAvatarEvent(payload));
  } catch (e) {
    if (isNotUnAuthorized(e)) {
      yield put(createShowWarningNotificationEvent("Unable to upload your avatar! Try again later please!"));
    }
  }
}

function* listenToSecurityEvents() {
  yield takeEvery(INITIALIZED_SECURITY, findUserSaga);
  yield takeEvery(UPDATED_SHARED_DASHBOARD, sharedDashboardSaga);
  yield takeEvery(RECEIVED_READ_TOKEN, userProfileSaga);
  yield takeEvery(SELECTED_AVATAR, userAvatarUploadSaga);
}

export default function* rootSaga() {
  yield all([listenToSecurityEvents()]);
}
