import sagaHelper from "redux-saga-testing";
import {call, put} from 'redux-saga/effects'
import {objectiveHistoryFetchSaga, OBJECTIVES_URL} from "../../../sagas/strategy/ObjectiveSagas";
import {performStreamedGet} from "../../../sagas/APISagas";
import {createFetchedObjectivesEvent} from "../../../events/StrategyEvents";
import {archiveFetchSaga, createHistoryAPIURL} from "../../../sagas/history/ActivityHistorySagas";
import {createReceivedHistoryEvent} from "../../../events/HistoryEvents";

describe('Activity History Sagas', () => {
  describe('archiveFetchSaga', () => {
    describe('when cannot get data', () => {
      const it = sagaHelper(archiveFetchSaga({
        payload: {
          information: {
            guid: 'phil'
          }
        }
      }));
      it('should try to get objectives', sagaEffect => {
        expect(sagaEffect).toEqual(call(performStreamedGet, createHistoryAPIURL('phil')));
        return new Error('shit is broke yo');
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when can get data', () => {
      const it = sagaHelper(archiveFetchSaga({
        payload: {
          information: {
            guid: 'phil'
          }
        }
      }));
      it('should try to get objectives', sagaEffect => {
        expect(sagaEffect).toEqual(call(performStreamedGet, createHistoryAPIURL('phil')));
        return 'all the data';
      });
      it('should let errybody know it got stuff', sagaEffect => {
        expect(sagaEffect).toEqual(put(createReceivedHistoryEvent('all the data')))
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('createHistoryAPIURL', () => {
      it('should return expected output', async () => {
        expect(createHistoryAPIURL('cheeze-wiz')).toEqual('/api/history/cheeze-wiz/feed')
      });
    });
  });
});
