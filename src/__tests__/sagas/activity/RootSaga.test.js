import sagaHelper from "redux-saga-testing";
import rootSaga from "../../../sagas";
import {all} from 'redux-saga/effects'

describe('Root Reducer', () => {
  const it = sagaHelper(rootSaga());
  it('should put all the reducers in', sagaEffect => {
    expect(sagaEffect.type).toEqual(all().type);
  });
  it('should complete', sagaEffect => {
    expect(sagaEffect).toBeUndefined();
  });
});
