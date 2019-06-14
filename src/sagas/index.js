import SecuritySagas from './SecuritySagas';
import ConfigurationSagas from './ConfigurationSagas';
import UserSagas from './UserSagas';
import ActivitySagas from './ActivitySagas';
import NetworkSagas from './NetworkSagas';
import {all} from "redux-saga/effects";
import HistorySagas from "./HistorySagas";

export default function* rootSaga() {
  yield all([
    SecuritySagas(),
    ConfigurationSagas(),
    UserSagas(),
    ActivitySagas(),
    NetworkSagas(),
    HistorySagas(),
  ])
}
