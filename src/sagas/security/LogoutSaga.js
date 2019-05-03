import {createLoggedOffEvent} from "../../actions/SecurityActions";
import {put} from 'redux-saga/effects';

export default function* logoutSaga(){
  yield put(createLoggedOffEvent())
}