import {tokenReceptionReducer} from '../../../reducers/security/TokenReducers';

describe('Token Reducer', () => {
  it('should to the right thing to state', () => {
    const tokenState = tokenReceptionReducer({
      isLoggedIn: true,
      accessToken: 'NOT AN ACCESS TOKEN',
      accessTokenInformation: {
        expiresAt: 9001,
        issuedAt: 69,
      },
      refreshToken: 'DEAD REFRESH TOKEN',
      idToken: 'YES, THIS IS DOG',
    }, {
      accessToken: 'TOTALLY AN ACCESS TOKEN',
      issuedAt: 6969,
      expiresIn: 10000,
      refreshToken: 'ALIVE ACCESS TOKEN',
      idToken: 'WADDUP, PIMPS?',
    });
    expect(tokenState).toEqual({
      'accessToken': 'TOTALLY AN ACCESS TOKEN',
      'accessTokenInformation': {'expiresAt': 16969, 'issuedAt': 6969},
      'idToken': 'WADDUP, PIMPS?',
      'isLoggedIn': true,
      'refreshToken': 'ALIVE ACCESS TOKEN'
    })
  });
});
