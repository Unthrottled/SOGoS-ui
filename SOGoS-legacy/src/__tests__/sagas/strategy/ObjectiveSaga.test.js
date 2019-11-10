import sagaHelper from "redux-saga-testing";
import {call, put} from 'redux-saga/effects'
import {objectiveHistoryFetchSaga, OBJECTIVES_URL} from "../../../sagas/strategy/ObjectiveSagas";
import {performStreamedGet} from "../../../sagas/APISagas";
import {createFetchedObjectivesEvent} from "../../../events/StrategyEvents";
import {createShowWarningNotificationEvent} from "../../../events/MiscEvents";

describe('Objective Sagas', () => {
  describe('objectiveHistoryFetchSaga', () => {
    describe('when cannot get data', () => {
      const it = sagaHelper(objectiveHistoryFetchSaga());
      it('should try to get objectives', sagaEffect => {
        expect(sagaEffect).toEqual(call(performStreamedGet, OBJECTIVES_URL));
        return new Error('shit is broke yo');
      });
      it('should notify user', sagaEffect => {
        expect(sagaEffect).toEqual(put(createShowWarningNotificationEvent("Unable to get objectives! Try again later, please.")));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when can get data', () => {
      const it = sagaHelper(objectiveHistoryFetchSaga());
      it('should try to get objectives', sagaEffect => {
        expect(sagaEffect).toEqual(call(performStreamedGet, OBJECTIVES_URL));
        return 'all the data';
      });
      it('should let errybody know it got stuff', sagaEffect => {
        expect(sagaEffect).toEqual(put(createFetchedObjectivesEvent('all the data')))
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
