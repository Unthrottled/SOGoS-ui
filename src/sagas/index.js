import SecuritySagas from './SecuritySagas';
import ConfigurationSagas from './ConfigurationSagas';
import {all} from "redux-saga/effects";

export default function* rootSaga() {
  yield all([
    SecuritySagas(),
    ConfigurationSagas(),
  ])
}