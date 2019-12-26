import {all, fork} from "redux-saga/effects";
import {sandsOfTimeSaga} from "./time/SandsOfTimeSaga";

function* startTimeSagas() {
  yield fork(sandsOfTimeSaga);
}


export default function* rootSaga() {
  yield all([
    startTimeSagas(),
  ])
}
