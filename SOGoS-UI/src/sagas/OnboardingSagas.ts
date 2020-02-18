import {put, call, all, takeEvery, delay} from 'redux-saga/effects';
import {RECEIVED_USER} from '../events/UserEvents';
import {PayloadEvent} from '../events/Event';
import {UserResponse} from '../types/UserTypes';
import {
  ACKNOWLEDGED_TACMOD,
  createAffirmedTabModAcknowledgementEvent,
} from '../events/ActivityEvents';
import {performPost} from './APISagas';

function* initialWalkThroughSaga({payload: user}: PayloadEvent<UserResponse>) {
  const onboarding = user.misc.onboarding;
  if (!(onboarding && onboarding.welcomed)) {
    // show onboarding carousel
  }

  if (onboarding && onboarding.TacModDownloaded && !onboarding.TacModThanked) {
    // thank user for being awesome!!
    // also disable the TacMod notification.
  }
}

function* tacModAffirmationSaga(_: any, attempt = 10): Generator {
  try {
    yield call(performPost, '/user/onboarding/TacMod/notified', {});
    yield put(createAffirmedTabModAcknowledgementEvent());
  } catch (e) {
    yield delay(Math.pow(2, attempt) + Math.floor(Math.random() * 1000));
    yield call(tacModAffirmationSaga, {}, attempt < 13 ? attempt + 1 : 10);
  }
}

function* setUpOnboardingSagas() {
  yield takeEvery(RECEIVED_USER, initialWalkThroughSaga);
  yield takeEvery(ACKNOWLEDGED_TACMOD, tacModAffirmationSaga);
}

export default function* rootSaga() {
  yield all([setUpOnboardingSagas()]);
}
