import {all, takeEvery} from 'redux-saga/effects';
import {RECEIVED_USER} from '../events/UserEvents';
import {PayloadEvent} from '../events/Event';
import {UserResponse} from '../types/UserTypes';

function* initialWalkThroughSaga({payload: user}: PayloadEvent<UserResponse>) {
  console.log('got dis', user);
  const onboarding = user.misc.onboarding;
  if (!(onboarding && onboarding.welcomed)) {
    // show onboarding carousel
  } else if (onboarding.TacModDownloaded) {
    // thank user for being awesome!!
  }
}

function* setUpOboardingSagas() {
  yield takeEvery(RECEIVED_USER, initialWalkThroughSaga);
}

export default function* rootSaga() {
  yield all([setUpOboardingSagas()]);
}
