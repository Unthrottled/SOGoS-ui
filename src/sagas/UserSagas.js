import {all, takeEvery} from 'redux-saga/effects'
import {LOGGED_ON} from "../actions/SecurityActions";
import {performGet} from "./APISagas";

function* loggedInUserSaga() {
  console.log('Finna get that user information')
  const thing = yield performGet('./api/user');
  console.log('oh shit i got this', thing);

}

function* listenToLoginEvents() {
  yield takeEvery(LOGGED_ON, loggedInUserSaga)
}

export default function* rootSaga() {
  yield all([
    listenToLoginEvents(),
  ])
}