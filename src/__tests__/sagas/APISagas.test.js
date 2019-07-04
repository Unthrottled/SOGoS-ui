import sagaHelper from "redux-saga-testing";
import {
  createHeaders,
  performGet,
  performGetWithoutSessionExtension,
  performGetWithToken,
  performOpenGet,
  performPost, performPut
} from "../../sagas/APISagas";
import {call, select} from 'redux-saga/effects';
import axios from 'axios/index';
import {
  accessTokenWithoutSessionExtensionSaga,
  accessTokenWithSessionExtensionSaga
} from "../../sagas/security/AccessTokenSagas";

describe('API Sagas', () => {

  describe('performOpenGet', () => {
    describe('when called', () => {
      const it = sagaHelper(performOpenGet('http://open/api', {
        'I AM': 'BECOME DEATH',
        headers: {
          'Ayy': 'Lmao',
          'Authorization': 'Basic Bitch',
          'Just': 'Monika',
        }
      }));
      it('should call the correct method', sagaEffect => {
        expect(sagaEffect).toEqual(call(axios.get, 'http://open/api', {
          'I AM': 'BECOME DEATH',
          headers: {
            'Ayy': 'Lmao',
            'Authorization': 'Basic Bitch',
            'Just': 'Monika',
          }
        }))
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });

  describe('performGet', () => {
    describe('when not given options', () => {
      const it = sagaHelper(performGet('http://localhost/api/hazard/spaghetti'));
      it('should call correct method', sagaEffect => {
        expect(sagaEffect).toEqual(call(performGetWithToken,
          'http://localhost/api/hazard/spaghetti',
          {headers: {}},
          accessTokenWithSessionExtensionSaga));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when not given header options', () => {
      const it = sagaHelper(performGet('http://localhost/api/hazard/spaghetti', {
        headers: {
          'murder': 'spagurder'
        }
      }));
      it('should call correct method', sagaEffect => {
        expect(sagaEffect).toEqual(call(performGetWithToken,
          'http://localhost/api/hazard/spaghetti',
          {
            headers: {
              murder: 'spagurder'
            }
          },
          accessTokenWithSessionExtensionSaga));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when not given non header options', () => {
      const it = sagaHelper(performGet('http://localhost/api/hazard/spaghetti', {
        danger: 'cheese'
      }));
      it('should call correct method', sagaEffect => {
        expect(sagaEffect).toEqual(call(performGetWithToken,
          'http://localhost/api/hazard/spaghetti',
          {danger: 'cheese'},
          accessTokenWithSessionExtensionSaga));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });

  describe('performGetWithoutSessionExtension', () => {
    describe('when not given options', () => {
      const it = sagaHelper(performGetWithoutSessionExtension('http://localhost/api/hazard/spaghetti'));
      it('should call correct method', sagaEffect => {
        expect(sagaEffect).toEqual(call(performGetWithToken,
          'http://localhost/api/hazard/spaghetti',
          {headers: {}},
          accessTokenWithoutSessionExtensionSaga));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when not given header options', () => {
      const it = sagaHelper(performGetWithoutSessionExtension('http://localhost/api/hazard/spaghetti', {
        headers: {
          'murder': 'spagurder'
        }
      }));
      it('should call correct method', sagaEffect => {
        expect(sagaEffect).toEqual(call(performGetWithToken,
          'http://localhost/api/hazard/spaghetti',
          {
            headers: {
              murder: 'spagurder'
            }
          },
          accessTokenWithoutSessionExtensionSaga));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when not given non header options', () => {
      const it = sagaHelper(performGetWithoutSessionExtension('http://localhost/api/hazard/spaghetti', {
        danger: 'cheese'
      }));
      it('should call correct method', sagaEffect => {
        expect(sagaEffect).toEqual(call(performGetWithToken,
          'http://localhost/api/hazard/spaghetti',
          {danger: 'cheese'},
          accessTokenWithoutSessionExtensionSaga));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });

  describe('createHeaders', () => {
    describe('when not supplied options', () => {
      const it = sagaHelper(createHeaders(accessTokenWithSessionExtensionSaga));
      it('should put in a request for a access token', (result) => {
        expect(result).toEqual(call(accessTokenWithSessionExtensionSaga));
        return 'I AM ACCESS TOKEN, YO';
      });
      it('should then pick some stuff out of state', (result) => {
        expect(result).toEqual(select());
        return {
          user: {
            information: {
              guid: "i am user guid"
            }
          },
          security: {
            verificationKey: "Key of verification"
          }
        };
      });
      it('should then perform a get request with authentication', (result) => {
        expect(result).toEqual({
          Authorization: 'Bearer I AM ACCESS TOKEN, YO',
          "User-Identifier": "i am user guid",
          "Verification": "Key of verification"
        });
        return 'One response from the backend'
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when not supplied options and state is empty', () => {
      const it = sagaHelper(createHeaders(accessTokenWithSessionExtensionSaga));
      it('should put in a request for a access token', (result) => {
        expect(result).toEqual(call(accessTokenWithSessionExtensionSaga));
        return 'I AM ACCESS TOKEN, YO';
      });
      it('should then pick some stuff out of state', (result) => {
        expect(result).toEqual(select());
        return {
          user: {
            information: {}
          },
          security: {}
        };
      });
      it('should then perform a get request with authentication without verification headers', (result) => {
        expect(result).toEqual({
          Authorization: 'Bearer I AM ACCESS TOKEN, YO',
        });
        return 'One response from the backend'
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when supplied options', () => {
      const it = sagaHelper(createHeaders(accessTokenWithSessionExtensionSaga, {
        slip: 'knot',
        headers: {
          'Authorization': 'Basic Bitch',
          'X-QUICK-SCOPE': 'L337'
        }
      }));
      it('should put in a request for a access token', (result) => {
        expect(result).toEqual(call(accessTokenWithSessionExtensionSaga));
        return 'I AM ACCESS TOKEN, YO';
      });
      it('should then pick some stuff out of state', (result) => {
        expect(result).toEqual(select());
        return {
          user: {
            information: {
              guid: "i am user guid"
            }
          },
          security: {
            verificationKey: "Key of verification"
          }
        };
      });
      it('should then perform a get request with authentication', (result) => {
        expect(result).toEqual({
          Authorization: 'Bearer I AM ACCESS TOKEN, YO',
          'X-QUICK-SCOPE': 'L337',
          "User-Identifier": "i am user guid",
          "Verification": "Key of verification"
        });
        return 'One response from the backend'
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('performGetWithToken', () => {
    describe('when not supplied options', () => {
      const it = sagaHelper(performGetWithToken('http://localhost/api/onions', {}, accessTokenWithSessionExtensionSaga));
      it('should put in a request for headers', (result) => {
        expect(result).toEqual(call(createHeaders, accessTokenWithSessionExtensionSaga, {}));
        return {
          Authorization: 'Bearer I AM ACCESS TOKEN, YO',
          "User-Identifier": "i am user guid",
          "Verification": "Key of verification"
        };
      });
      it('should then perform a get request with authentication', (result) => {
        expect(result).toEqual(call(axios.get,
          'http://localhost/api/onions', {
            headers: {
              Authorization: 'Bearer I AM ACCESS TOKEN, YO',
              "User-Identifier": "i am user guid",
              "Verification": "Key of verification"
            },
          }));
        return 'One response from the backend'
      });
      it('should then return the response of the backend call', (result) => {
        expect(result).toEqual('One response from the backend');
        return 'I am done!'
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when not supplied options and state is empty', () => {
      const it = sagaHelper(performGetWithToken('http://localhost/api/onions', {}, accessTokenWithSessionExtensionSaga));
      it('should put in a request for headers', (result) => {
        expect(result).toEqual(call(createHeaders, accessTokenWithSessionExtensionSaga, {}));
        return {
          Authorization: 'Bearer I AM ACCESS TOKEN, YO',
        };
      });
      it('should then perform a get request with authentication without verification headers', (result) => {
        expect(result).toEqual(call(axios.get,
          'http://localhost/api/onions', {
            headers: {
              Authorization: 'Bearer I AM ACCESS TOKEN, YO',
            },
          }));
        return 'One response from the backend'
      });
      it('should then return the response of the backend call', (result) => {
        expect(result).toEqual('One response from the backend');
        return 'I am done!'
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when supplied options', () => {
      const it = sagaHelper(performGetWithToken('http://localhost/api/onions', {
        slip: 'knot',
        headers: {
          'Authorization': 'Basic Bitch',
          'X-QUICK-SCOPE': 'L337'
        }
      }, accessTokenWithSessionExtensionSaga));
      it('should put in a request for headers', (result) => {
        expect(result).toEqual(call(createHeaders, accessTokenWithSessionExtensionSaga, {
          slip: 'knot',
          headers: {
            'Authorization': 'Basic Bitch',
            'X-QUICK-SCOPE': 'L337'
          }
        }));
        return {
          Authorization: 'Bearer I AM ACCESS TOKEN, YO',
          'X-QUICK-SCOPE': 'L337',
          "User-Identifier": "i am user guid",
          "Verification": "Key of verification"
        };
      });
      it('should then perform a get request with authentication', (result) => {
        expect(result).toEqual(call(axios.get,
          'http://localhost/api/onions', {
            slip: 'knot',
            headers: {
              Authorization: 'Bearer I AM ACCESS TOKEN, YO',
              'X-QUICK-SCOPE': 'L337',
              "User-Identifier": "i am user guid",
              "Verification": "Key of verification"
            },
          }));
        return 'One response from the backend'
      });
      it('should then return the response of the backend call', (result) => {
        expect(result).toEqual('One response from the backend');
        return 'I am done!'
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('performPost', () => {
    describe('when not supplied options', () => {
      const it = sagaHelper(performPost('http://localhost/api/onions', {
        'I AM': 'BECOME DEATH',
      }));
      it('should put in a request for headers', (result) => {
        expect(result).toEqual(call(createHeaders, accessTokenWithSessionExtensionSaga, {headers:{}}));
        return {
          Authorization: 'Bearer I AM ACCESS TOKEN, YO',
          "User-Identifier": "i am user guid",
          "Verification": "Key of verification"
        };
      });
      it('should then perform a get request with authentication', (result) => {
        expect(result).toEqual(call(axios.post,
          'http://localhost/api/onions',
          {
            'I AM': 'BECOME DEATH',
          },
          {
            headers: {
              Authorization: 'Bearer I AM ACCESS TOKEN, YO',
              "User-Identifier": "i am user guid",
              Verification: "Key of verification"
            },
          }));
        return 'One response from the backend'
      });
      it('should then return the response of the backend call', (result) => {
        expect(result).toEqual('One response from the backend');
        return 'I am done!'
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when not supplied options and state is empty', () => {
      const it = sagaHelper(performPost('http://localhost/api/onions', {
        'I AM': 'BECOME DEATH',
      }));
      it('should put in a request for headers', (result) => {
        expect(result).toEqual(call(createHeaders, accessTokenWithSessionExtensionSaga, {headers:{}}));
        return {
          Authorization: 'Bearer I AM ACCESS TOKEN, YO',
        };
      });
      it('should then perform a get request with authentication without verification headers', (result) => {
        expect(result).toEqual(call(axios.post,
          'http://localhost/api/onions',
          {
            'I AM': 'BECOME DEATH',
          },
          {
            headers: {
              Authorization: 'Bearer I AM ACCESS TOKEN, YO',
            },
          }));
        return 'One response from the backend'
      });
      it('should then return the response of the backend call', (result) => {
        expect(result).toEqual('One response from the backend');
        return 'I am done!'
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when supplied options', () => {
      const it = sagaHelper(performPost('http://localhost/api/onions', {
        'I AM': 'BECOME DEATH',
      }, {
        standby: 'for titan fall',
        headers: {
          'Authorization': 'Basic Bitch',
          'X-QUICK-SCOPE': 'L337'
        }
      }));
      it('should put in a request for headers', (result) => {
        expect(result).toEqual(call(createHeaders, accessTokenWithSessionExtensionSaga, {"headers": {"Authorization": "Basic Bitch", "X-QUICK-SCOPE": "L337"}, "standby": "for titan fall"}));
        return {
          Authorization: 'Bearer I AM ACCESS TOKEN, YO',
          'X-QUICK-SCOPE': 'L337',
          "User-Identifier": "i am user guid",
          "Verification": "Key of verification"
        };
      });
      it('should then perform a get request with authentication', (result) => {
        expect(result).toEqual(call(axios.post,
          'http://localhost/api/onions',
          {
            'I AM': 'BECOME DEATH',
          },
          {
            standby: 'for titan fall',
            headers: {
              Authorization: 'Bearer I AM ACCESS TOKEN, YO',
              'X-QUICK-SCOPE': 'L337',
              "User-Identifier": "i am user guid",
              "Verification": "Key of verification"
            },
          }));
        return 'One response from the backend'
      });
      it('should then return the response of the backend call', (result) => {
        expect(result).toEqual('One response from the backend');
        return 'I am done!'
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('performPut', () => {
    describe('when not supplied options', () => {
      const it = sagaHelper(performPut('http://localhost/api/onions', {
        'I AM': 'BECOME DEATH',
      }));
      it('should put in a request for headers', (result) => {
        expect(result).toEqual(call(createHeaders, accessTokenWithSessionExtensionSaga, {headers:{}}));
        return {
          Authorization: 'Bearer I AM ACCESS TOKEN, YO',
          "User-Identifier": "i am user guid",
          "Verification": "Key of verification"
        };
      });
      it('should then perform a get request with authentication', (result) => {
        expect(result).toEqual(call(axios.put,
          'http://localhost/api/onions',
          {
            'I AM': 'BECOME DEATH',
          },
          {
            headers: {
              Authorization: 'Bearer I AM ACCESS TOKEN, YO',
              "User-Identifier": "i am user guid",
              Verification: "Key of verification"
            },
          }));
        return 'One response from the backend'
      });
      it('should then return the response of the backend call', (result) => {
        expect(result).toEqual('One response from the backend');
        return 'I am done!'
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when not supplied options and state is empty', () => {
      const it = sagaHelper(performPut('http://localhost/api/onions', {
        'I AM': 'BECOME DEATH',
      }));
      it('should put in a request for headers', (result) => {
        expect(result).toEqual(call(createHeaders, accessTokenWithSessionExtensionSaga, {headers:{}}));
        return {
          Authorization: 'Bearer I AM ACCESS TOKEN, YO',
        };
      });
      it('should then perform a get request with authentication without verification headers', (result) => {
        expect(result).toEqual(call(axios.put,
          'http://localhost/api/onions',
          {
            'I AM': 'BECOME DEATH',
          },
          {
            headers: {
              Authorization: 'Bearer I AM ACCESS TOKEN, YO',
            },
          }));
        return 'One response from the backend'
      });
      it('should then return the response of the backend call', (result) => {
        expect(result).toEqual('One response from the backend');
        return 'I am done!'
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
    describe('when supplied options', () => {
      const it = sagaHelper(performPut('http://localhost/api/onions', {
        'I AM': 'BECOME DEATH',
      }, {
        standby: 'for titan fall',
        headers: {
          'Authorization': 'Basic Bitch',
          'X-QUICK-SCOPE': 'L337'
        }
      }));
      it('should put in a request for headers', (result) => {
        expect(result).toEqual(call(createHeaders, accessTokenWithSessionExtensionSaga, {"headers": {"Authorization": "Basic Bitch", "X-QUICK-SCOPE": "L337"}, "standby": "for titan fall"}));
        return {
          Authorization: 'Bearer I AM ACCESS TOKEN, YO',
          'X-QUICK-SCOPE': 'L337',
          "User-Identifier": "i am user guid",
          "Verification": "Key of verification"
        };
      });
      it('should then perform a get request with authentication', (result) => {
        expect(result).toEqual(call(axios.put,
          'http://localhost/api/onions',
          {
            'I AM': 'BECOME DEATH',
          },
          {
            standby: 'for titan fall',
            headers: {
              Authorization: 'Bearer I AM ACCESS TOKEN, YO',
              'X-QUICK-SCOPE': 'L337',
              "User-Identifier": "i am user guid",
              "Verification": "Key of verification"
            },
          }));
        return 'One response from the backend'
      });
      it('should then return the response of the backend call', (result) => {
        expect(result).toEqual('One response from the backend');
        return 'I am done!'
      });
      it('should complete', (result) => {
        expect(result).toBeUndefined();
      });
    });
  });
});
