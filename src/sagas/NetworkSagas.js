import {all, call, fork, put, select, take} from 'redux-saga/effects'
import {eventChannel} from 'redux-saga';
import {
  createFoundInternetEvent,
  createFoundWifiEvent,
  createLostInternetEvent,
  createLostWifiEvent,
  FOUND_WIFI
} from "../events/NetworkEvents";
import {selectNetworkState} from "../reducers";
import {performOpenGet} from "./APISagas";

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

export function* waitForWifi() {
  const {isOnline} = yield select(selectNetworkState);
  if (!isOnline) {
    yield take(FOUND_WIFI);
  }
}

function* initialNetworkStateSaga(){
  if(navigator.onLine){
    yield put(createFoundWifiEvent());
  } else {
    yield put(createLostWifiEvent())
  }
}

function* initialInternetStateSaga(){
  const hasInternet = yield checkInternet();
  if(hasInternet){
    yield put(createFoundInternetEvent());
  } else {
    yield put(createLostInternetEvent())
  }
}

//todo: figure out something better that works
function* checkInternet() {
  try {
    yield performOpenGet('https://acari.io');
    return true
  } catch(ignored){}
  return false;
}

function* listenToNetworkEvents() {
  yield fork(initialNetworkStateSaga);
  yield fork(initialInternetStateSaga);
  yield fork(onlineSaga);
  yield fork(offLineSaga);
}

export default function* rootSaga() {
  yield all([
    listenToNetworkEvents(),
  ])
}
