import SecuritySagas from './SecuritySagas';
import {all} from "redux-saga/effects";

export default function* rootSaga() {
  yield all([
      SecuritySagas()
  ])
}