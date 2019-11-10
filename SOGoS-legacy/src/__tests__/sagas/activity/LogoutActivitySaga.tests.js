import sagaHelper from "redux-saga-testing";
import {call} from 'redux-saga/effects'
import {activityLogoutSaga, LOGGED_OFF_ACTIVITY_NAME} from "../../../sagas/activity/LogoutActivitySaga";
import {registerActivitySaga} from "../../../sagas/activity/RegisterActivitySaga";
import {createStartedActivityEvent} from "../../../events/ActivityEvents";

jest.mock('uuid/v4', () => () => 'potato');
jest.mock('../../../events/ActivityEvents', () => ({
  createStartedActivityEvent: a => a,
}));

describe('LogoutActivitySaga', () => {
  describe('activityLogoutSaga', () => {
    describe('when asked to logout', () => {
      const it = sagaHelper(activityLogoutSaga());
      it('should wait for both events to happen', sagaEffect => {
        expect(sagaEffect).toEqual(call(
          registerActivitySaga, createStartedActivityEvent({
            name: LOGGED_OFF_ACTIVITY_NAME,
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

