import {call, delay, fork, put, race, select, take} from 'redux-saga/effects';
import {performOpenGet} from "../APISagas";
import {
  createFailedToReceiveReadToken,
  createReceivedReadToken,
  FAILED_TO_RECEIVE_READ_TOKEN,
  RECEIVED_READ_TOKEN
} from "../../events/SecurityEvents";
import {createReceivedPartialUserEvent} from "../../events/UserEvents";
import {PayloadEvent} from "../../events/Event";
import {SecurityState} from "../../reducers/SecurityReducer";
import {selectSecurityState} from "../../reducers";
import {createHideTimerEvent, createShowTimerEvent} from "../../events/ActivityEvents";

export function* readOnlyLocationSaga({payload: locationStuff}: PayloadEvent<any>) {
  const {readOnly}: SecurityState = yield select(selectSecurityState);
  if(readOnly) {
    if(locationStuff.location.pathname.startsWith('/dashboard')) {
      yield put(createShowTimerEvent());
    } else {
      yield put(createHideTimerEvent());
    }
  }
}

export function* readOnlySaga() {
  const pathname = window.location.pathname
  const bridgeCode = pathname.substring('/dashboard/'.length)
  yield fork(attemptToGetReadOnlyToken, bridgeCode);

  const {
    hasReadToken,
  } = yield race({
    hasReadToken: take(RECEIVED_READ_TOKEN),
    notHasReadToken: take(FAILED_TO_RECEIVE_READ_TOKEN),
  });

  if (hasReadToken) {
    yield put(createReceivedPartialUserEvent(hasReadToken.payload.userIdentifier))
  }
}

export function* attemptToGetReadOnlyToken(bridgeCode: string, attempt: number = 1): Generator {
  try {
    const readOnlyTokenPayload: any = yield call(
      performOpenGet,
      `/user/${bridgeCode}/view/token`
    )
    yield put(createReceivedReadToken({
      userIdentifier: readOnlyTokenPayload.data.userIdentifier,
      readToken: readOnlyTokenPayload.data.readToken
    }))
  } catch (e) {
    if ((!e.message || e.message.indexOf('403') < 0) && attempt < 5) {
      yield delay(2000);
      yield call(attemptToGetReadOnlyToken, bridgeCode, attempt + 1)
    } else {
      yield put(createFailedToReceiveReadToken(bridgeCode))
    }
  }
}
