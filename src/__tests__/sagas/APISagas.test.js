import sagaHelper from "redux-saga-testing";
import {performGet, performOpenGet, performPost} from "../../sagas/APISagas";
import {
  createFoundAccessTokenEvent,
  createRequestAccessTokenEvent,
  FOUND_ACCESS_TOKEN
} from "../../events/SecurityEvents";
import {call, put, take, select} from 'redux-saga/effects';
import axios from 'axios/index';

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
    describe('when not supplied options', () => {
      const it = sagaHelper(performGet('http://localhost/api/onions'));
      it('should put in a request for a access token', (result) => {
        expect(result).toEqual(put(createRequestAccessTokenEvent()))
      });
      it('should then listen for a response', (result) => {
        expect(result).toEqual(take(FOUND_ACCESS_TOKEN));
        return createFoundAccessTokenEvent('I AM ACCESS TOKEN, YO');
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
    describe('when supplied options', () => {
      const it = sagaHelper(performGet('http://localhost/api/onions', {
        slip: 'knot',
        headers: {
          'Authorization': 'Basic Bitch',
          'X-QUICK-SCOPE': 'L337'
        }
      }));
      it('should put in a request for a access token', (result) => {
        expect(result).toEqual(put(createRequestAccessTokenEvent()))
      });
      it('should then listen for a response', (result) => {
        expect(result).toEqual(take(FOUND_ACCESS_TOKEN));
        return createFoundAccessTokenEvent('I AM ACCESS TOKEN, YO');
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
      it('should put in a request for a access token', (result) => {
        expect(result).toEqual(put(createRequestAccessTokenEvent()))
      });
      it('should then listen for a response', (result) => {
        expect(result).toEqual(take(FOUND_ACCESS_TOKEN));
        return createFoundAccessTokenEvent('I AM ACCESS TOKEN, YO');
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
      it('should put in a request for a access token', (result) => {
        expect(result).toEqual(put(createRequestAccessTokenEvent()))
      });
      it('should then listen for a response', (result) => {
        expect(result).toEqual(take(FOUND_ACCESS_TOKEN));
        return createFoundAccessTokenEvent('I AM ACCESS TOKEN, YO');
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
});
