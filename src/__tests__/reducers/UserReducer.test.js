import userReducer from "../../reducers/UserReducer";
import {RECEIVED_USER} from "../../events/UserEvents";
import {LOGGED_OFF} from "../../events/SecurityEvents";

describe('User Reducer', () => {
  it('should return default state when given nothing', () => {
    const userState = userReducer(undefined, {
      type: 'CHEEZE-WIZ'
    });
    expect(userState).toEqual({
      information: {
        firstName: 'Smitty',
        lastName: 'Werbenjagermangensen',
        email: '',
        fullName: 'Smitty Werbenjagermangensen',
        guid: '',
      }

    })
  });
  it('should return given state on unknown event', () => {
    const userState = userReducer({
      information: {
        fullName: 'Silly Socks',
      }
    }, {
      type: 'FORK',
    });
    expect(userState).toEqual({
      information:{
        fullName: 'Silly Socks',
      }
    })
  });
  it('should add user information to state on user reception', () => {
    const userState = userReducer({
      information: {
        fullName: 'Silly Socks',
        firstName: 'Silly',
        lastName: 'Socks',
        email: 'eat@pant.io',
        guid: 'the best guid',
      }
    }, {
      type: RECEIVED_USER,
      payload: {
        information: {
          email: 'scoopy@doo.io',
        },
      }
    });
    expect(userState).toEqual({
      information: {
        fullName: 'Silly Socks',
        firstName: 'Silly',
        lastName: 'Socks',
        email: 'scoopy@doo.io',
        guid: 'the best guid',
      }
    })
  });
  it('should reset state when logged off', () => {
    const userState = userReducer({
      information: {
        fullName: 'Silly Socks',
        firstName: 'Silly',
        lastName: 'Socks',
        email: 'eat@pant.io',
        guid: 'the best guid',
      }
    }, {
      type: LOGGED_OFF,
    });
    expect(userState).toEqual({
      information: {
        firstName: 'Smitty',
        lastName: 'Werbenjagermangensen',
        email: '',
        fullName: 'Smitty Werbenjagermangensen',
        guid: '',
      }
    })
  });
});
