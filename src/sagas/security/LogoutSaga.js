import {createLoggedOffEvent} from "../../events/SecurityEvents";
import {put} from 'redux-saga/effects';

export default function* logoutSaga(){
  yield put(createLoggedOffEvent())
}
