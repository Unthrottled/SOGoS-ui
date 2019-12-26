import {take} from 'redux-saga/effects';
import {buffers, eventChannel} from "redux-saga";

export const createFocusChannel = () => {
  return eventChannel(statusObserver => {
    const listener = () => {
      statusObserver(true)
    };
    window.addEventListener('focus', listener);
    return () => window.removeEventListener('focus', listener);
  }, buffers.expanding(100))
};


export function* focusSaga() {
  const focusChannel = createFocusChannel();
  while (true) {
    yield take(focusChannel);
    console.log("finna bust a nut");
  }
}
