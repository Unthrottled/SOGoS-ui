import {race, take, fork, call, delay, put, select} from 'redux-saga/effects';
import {performOpenGet} from "../APISagas";
import {
  createFailedToReceiveReadToken,
  createReceivedReadToken, FAILED_TO_RECEIVE_READ_TOKEN,
  RECEIVED_READ_TOKEN
} from "../../events/SecurityEvents";

export function* readOnlySaga() {
  const {location: {pathname}}: any = yield select(state => state.router);
  const userIdentifier = pathname.substring('/user/'.length, pathname.indexOf('/history'))
  yield fork(attemptToGetReadOnlyToken, userIdentifier);

  const {
    hasReadToken,
    notHasReadToken
  } = yield race({
    hasReadToken: take(RECEIVED_READ_TOKEN),
    notHasReadToken: take(FAILED_TO_RECEIVE_READ_TOKEN),
  });

  if(hasReadToken) {
    console.tron('it work')
  } else if (notHasReadToken) {
    console.tron('it no work')
  }
}

export function* attemptToGetReadOnlyToken(userIdentifier: string, attempt: number = 1): Generator {
  try {
    const readOnlyTokenPayload: any = yield call(
      performOpenGet,
      `/user/${userIdentifier}/view/token`
    )
    yield put(createReceivedReadToken({
      userIdentifier,
      readToken: readOnlyTokenPayload.data.readToken
    }))
  } catch (e) {
    if ((!e.message || e.message.indexOf('403') < 0) && attempt < 5) {
      yield delay(2000);
      yield call(attemptToGetReadOnlyToken, userIdentifier, attempt + 1)
    } else {
      yield put(createFailedToReceiveReadToken(userIdentifier))
    }
  }
}
