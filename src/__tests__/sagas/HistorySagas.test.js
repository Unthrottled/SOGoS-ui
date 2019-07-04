import {all, call, fork, put, take, takeEvery} from 'redux-saga/effects'

import sagaHelper from "redux-saga-testing";
import {initializeActivityFeedSaga} from "../../sagas/HistorySagas";
import {VIEWED_HISTORY} from "../../events/HistoryEvents";
import {RECEIVED_USER} from "../../events/UserEvents";
import {archiveFetchSaga, historyObservationSaga} from "../../sagas/history/ActivityHistorySagas";

describe('HistorySagas', () => {
  describe('initializeActivityFeedSaga', () => {
    describe('when both history observation and the user has been found', () => {
      const it = sagaHelper(initializeActivityFeedSaga());
      it('should wait for both events to happen', sagaEffect => {
        expect(sagaEffect).toEqual(all({
          askedForHistory: take(VIEWED_HISTORY),
          foundUser: take(RECEIVED_USER),
        }));
        return {
          foundUser: 'steve',
          askedForHistory: "Yep, that's history",
        }
      });
      it('should fetch activity history', sagaEffect => {
        expect(sagaEffect).toEqual(fork(archiveFetchSaga, 'steve'));
      });
      it('should then should always listen to history observations', sagaEffect => {
        expect(sagaEffect).toEqual(takeEvery(VIEWED_HISTORY, historyObservationSaga));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
