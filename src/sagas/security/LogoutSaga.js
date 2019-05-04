import {createLoggedOffEvent} from "../../events/SecurityActions";
import {put} from 'redux-saga/effects';

export default function* logoutSaga(){
  yield put(createLoggedOffEvent())
}
