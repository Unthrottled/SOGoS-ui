import {select} from 'redux-saga/effects'

export function* activitySyncSaga() {
  const {user, activity} = yield select();
  console.log('finna bust a nut', user, activity);
}
