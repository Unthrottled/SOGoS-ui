import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import {INITIALIZED_SECURITY} from '../events/SecurityEvents';
import {performDelete, performGetWithoutVerification, performPost} from './APISagas';
import {
  createFailedToGetUserEvent,
  createReceivedUserEvent,
  createSyncedSharedDashboardUpdateEvent,
  UPDATED_SHARED_DASHBOARD,
} from '../events/UserEvents';
import {selectSecurityState, selectUserState} from '../reducers';
import {PayloadEvent} from "../events/Event";
import {createShowWarningNotificationEvent} from "../events/MiscEvents";
import {UserState} from "../reducers/UserReducer";
import omit from 'lodash/omit';

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
        `Unable to get ${hasShared ? '' : 'un'}share your dashboard! Try again later, please.`,
      ),
    )
  }
}

function* listenToSecurityEvents() {
  yield takeEvery(INITIALIZED_SECURITY, findUserSaga);
  yield takeEvery(UPDATED_SHARED_DASHBOARD, sharedDashboardSaga)
}

export default function* rootSaga() {
  yield all([listenToSecurityEvents()]);
}
