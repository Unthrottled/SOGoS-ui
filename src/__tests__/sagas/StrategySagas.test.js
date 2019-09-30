import {fork, take, takeEvery} from 'redux-saga/effects'
import sagaHelper from "redux-saga-testing";
import {RECEIVED_USER} from "../../events/UserEvents";
import {VIEWED_OBJECTIVES} from "../../events/StrategyEvents";
import {objectiveObservationInitializationSaga} from "../../sagas/StrategySagas";
import {objectiveHistoryFetchSaga, objectiveObservationSaga} from "../../sagas/strategy/ObjectiveSagas";

describe('StrategySagas', () => {
  describe('objectiveObservationInitializationSaga', () => {
    describe('when both objective observation and the user has been found', () => {
      const it = sagaHelper(objectiveObservationInitializationSaga());
      it('should wait for both events to happen', sagaEffect => {
        expect(sagaEffect).toEqual(take(RECEIVED_USER));
        return 'steve';
      });
      it('should fetch activity history', sagaEffect => {
        expect(sagaEffect).toEqual(fork(objectiveHistoryFetchSaga, 'steve'));
      });
      it('should then should always listen to history observations', sagaEffect => {
        expect(sagaEffect).toEqual(takeEvery(VIEWED_OBJECTIVES, objectiveObservationSaga));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
