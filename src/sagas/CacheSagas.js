import {all, put, fork, call, select, take} from 'redux-saga/effects'
import {selectActivityState, selectStrategyState, selectTacticalState, selectUserState} from "../reducers";
import {createCheckedCachesEvent, RECEIVED_USER} from "../events/UserEvents";
import {INITIALIZED_APPLICATION} from "../events/ApplicationLifecycleEvents";

export function* checkCaches() {
  yield take(INITIALIZED_APPLICATION);
  const userGUID = yield call(fetchUserGuidSaga);
  const globalState = yield select();
  const hasCachedItems = [
    selectActivityState,
    selectTacticalState,
    selectStrategyState,
  ].map(stateSelector => stateSelector(globalState))
    .map(state => state.cache[userGUID])
    .reduce((accum, cache) => accum && !!cache, true);
  yield put(createCheckedCachesEvent(hasCachedItems));
}

export function* fetchUserGuidSaga() {
  const {information: {guid}} = yield select(selectUserState);
  if(guid){
    return guid
  } else {
    const user = yield take(RECEIVED_USER);
    return user.guid
  }
}

function* listenToEvents() {
  yield fork(checkCaches);
}

export default function* CacheSagas() {
  yield all([
    listenToEvents(),
  ]);
}
