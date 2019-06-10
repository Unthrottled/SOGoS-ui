import {select, put, all, call, take, fork} from 'redux-saga/effects'
import {eventChannel} from 'redux-saga';
import {createFoundWifiEvent, createLostWifiEvent} from "../events/NetworkEvents";
import {selectNetworkState} from "../reducers";

export const createOnlineChannel = () => createNetworkChannel('online');
export const createOfflineChannel = () => createNetworkChannel('offline');

export const createNetworkChannel = (event) => {
  return eventChannel(statusObserver => {
    const statusHandler = status => statusObserver(status);
    window.addEventListener(event, statusHandler);
    return () => window.removeEventListener(event, statusHandler);
  })
};

function* onlineSaga() {
  const onlineEventChannel = yield call(createOnlineChannel);
  try{
    while (true){
      yield take(onlineEventChannel);
      yield put(createFoundWifiEvent());
    }
  } catch (e) {
    console.log('shit broke in online saga', e);
  }
}

function* offLineSaga() {
  const onlineEventChannel = yield call(createOfflineChannel);
  try{
    while (true){
      yield take(onlineEventChannel);
      yield put(createLostWifiEvent());
    }
  } catch (e) {
    //todo: re-establish channel.
    console.log('shit broke in offline saga', e);
  }
}

export function* isOnline() {
  const {isOnline} = yield select(selectNetworkState);
  return isOnline
}

function* initialNetworkStateSaga(){
  if(navigator.onLine){
    yield put(createFoundWifiEvent());
  } else {
    yield put(createLostWifiEvent())
  }
}

function* listenToNetworkEvents() {
  yield fork(initialNetworkStateSaga);
  yield fork(onlineSaga);
  yield fork(offLineSaga);
}

export default function* rootSaga() {
  yield all([
    listenToNetworkEvents(),
  ])
}
