import {all, takeEvery, put } from 'redux-saga/effects'
import {LOGGED_ON} from "../actions/SecurityActions";
import {performGet} from "./APISagas";
import {receivedUser} from "../actions/UserActions";

function* loggedInUserSaga() {
  const {data: user} = yield performGet('./api/user');
  yield put(receivedUser(user));
}

function* listenToLoginEvents() {
  yield takeEvery(LOGGED_ON, loggedInUserSaga)
}

export default function* rootSaga() {
  yield all([
    listenToLoginEvents(),
  ])
}