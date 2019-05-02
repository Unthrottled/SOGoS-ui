import {all, takeEvery} from 'redux-saga/effects'
import {LOGGED_ON} from "../actions/SecurityActions";

function* loggedInUserSaga() {
  console.log('Finna get that user information')

}

function* listenToLoginEvents() {
  yield takeEvery(LOGGED_ON, loggedInUserSaga)
}

export default function* rootSaga() {
  yield all([
    listenToLoginEvents(),
  ])
}