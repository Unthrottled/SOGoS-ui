import sagaHelper from "redux-saga-testing";
import {all, call, take} from 'redux-saga/effects'
import {registerActivitySaga} from "../../../sagas/activity/RegisterActivitySaga";
import {createStartedActivityEvent} from "../../../events/ActivityEvents";
import {activityLogonSaga, LOGGED_ON_ACTIVITY_NAME} from "../../../sagas/activity/LogonActivitySaga";
import {LOGGED_ON} from "../../../events/SecurityEvents";
import {RECEIVED_USER} from "../../../events/UserEvents";


jest.mock('uuid/v4', () => () => 'potato');
jest.mock('../../../events/ActivityEvents', () => ({
  createStartedActivityEvent: a => a,
}));

describe('LoginActivitySaga', () => {
  describe('activityLoginSaga', () => {
    describe('when asked to login', () => {
      const it = sagaHelper(activityLogonSaga());
      it('should wait for both events to happen', sagaEffect => {
        expect(sagaEffect).toEqual(all([
          take(LOGGED_ON),
          take(RECEIVED_USER),
        ]));
      });
      it('should create event', sagaEffect => {
        expect(sagaEffect).toEqual(call(
          registerActivitySaga, createStartedActivityEvent({
            name: LOGGED_ON_ACTIVITY_NAME,
            uuid: 'potato'
          })
        ));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
