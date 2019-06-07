import {all, call, take, fork} from 'redux-saga/effects'
import {eventChannel} from 'redux-saga';

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
      const onlineStatus = yield take(onlineEventChannel);
      console.log('online status: ', onlineStatus);
    }
  } catch (e) {
    console.log('shit broke in online saga', e);
  }
}

function* offLineSaga() {
  const onlineEventChannel = yield call(createOfflineChannel);
  try{
    while (true){
      const onlineStatus = yield take(onlineEventChannel);
      console.log('offline status: ', onlineStatus);
    }
  } catch (e) {
    //todo: re-establish channel.
    console.log('shit broke in offline saga', e);
  }
}

function* listenToNetworkEvents() {
  yield fork(onlineSaga);
  yield fork(offLineSaga);

}

export default function* rootSaga() {
  yield all([
    listenToNetworkEvents(),
  ])
}
