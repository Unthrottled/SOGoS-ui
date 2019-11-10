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
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzOTAwMGViMC01YjEyLTQxMzAtOGVhZi1jYzU5Mjc3NWNmNDMifQ.eyJqdGkiOiI0ZGFjMDZjMS1jMWI4LTQwNmMtYjFkNi1hMjE5NTgwZjNiNmMiLCJleHAiOjE1NjA0MjIxNDUsIm5iZiI6MCwiaWF0IjoxNTYwNDIwMzQ1LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvbWFzdGVyIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL21hc3RlciIsInN1YiI6ImFiZWUwOTYxLTdkNjctNGQyOS1hZjg0LWFjNjIzM2RkMzQ0OCIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJzb2dvcy1hcHAiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiI0YTI1YzI3OC02OGVlLTQ5ZGEtOWU1Mi0wZGE3ZTVhOWRmYmYiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiY3JlYXRlLXJlYWxtIiwib2ZmbGluZV9hY2Nlc3MiLCJhZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsic29nb3MiOnsicm9sZXMiOlsidmlldy11c2VyIl19LCJtYXN0ZXItcmVhbG0iOnsicm9sZXMiOlsidmlldy1yZWFsbSIsInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwibWFuYWdlLWlkZW50aXR5LXByb3ZpZGVycyIsImltcGVyc29uYXRpb24iLCJjcmVhdGUtY2xpZW50IiwibWFuYWdlLXVzZXJzIiwicXVlcnktcmVhbG1zIiwidmlldy1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsInF1ZXJ5LXVzZXJzIiwibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsInZpZXctZXZlbnRzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUifQ.pO3DjJ7lKxkP2tZzTXSzE1KKUmZbPQ5wTPo_C14YmdY',
      idToken: 'WADDUP, PIMPS?',
    });
    expect(tokenState).toEqual({
      "accessToken": "TOTALLY AN ACCESS TOKEN",
      "accessTokenInformation": {"expiresAt": 16969, "issuedAt": 6969},
      "idToken": "WADDUP, PIMPS?",
      "isLoggedIn": true,
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzOTAwMGViMC01YjEyLTQxMzAtOGVhZi1jYzU5Mjc3NWNmNDMifQ.eyJqdGkiOiI0ZGFjMDZjMS1jMWI4LTQwNmMtYjFkNi1hMjE5NTgwZjNiNmMiLCJleHAiOjE1NjA0MjIxNDUsIm5iZiI6MCwiaWF0IjoxNTYwNDIwMzQ1LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvbWFzdGVyIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL21hc3RlciIsInN1YiI6ImFiZWUwOTYxLTdkNjctNGQyOS1hZjg0LWFjNjIzM2RkMzQ0OCIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJzb2dvcy1hcHAiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiI0YTI1YzI3OC02OGVlLTQ5ZGEtOWU1Mi0wZGE3ZTVhOWRmYmYiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiY3JlYXRlLXJlYWxtIiwib2ZmbGluZV9hY2Nlc3MiLCJhZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsic29nb3MiOnsicm9sZXMiOlsidmlldy11c2VyIl19LCJtYXN0ZXItcmVhbG0iOnsicm9sZXMiOlsidmlldy1yZWFsbSIsInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwibWFuYWdlLWlkZW50aXR5LXByb3ZpZGVycyIsImltcGVyc29uYXRpb24iLCJjcmVhdGUtY2xpZW50IiwibWFuYWdlLXVzZXJzIiwicXVlcnktcmVhbG1zIiwidmlldy1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsInF1ZXJ5LXVzZXJzIiwibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsInZpZXctZXZlbnRzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUifQ.pO3DjJ7lKxkP2tZzTXSzE1KKUmZbPQ5wTPo_C14YmdY",
      "refreshTokenInformation": {"expiresAt": 1560422145, "issuedAt": 1560420345}
    })
  });
  it('should to the right thing to state when refresh token is missing', () => {
    const tokenState = tokenReceptionReducer({
      isLoggedIn: true,
      accessToken: 'NOT AN ACCESS TOKEN',
      accessTokenInformation: {
        expiresAt: 9001,
        issuedAt: 69,
      },
      refreshToken: 'Wanna go Skateboards?',
      idToken: 'YES, THIS IS DOG',
    }, {
      accessToken: 'TOTALLY AN ACCESS TOKEN',
      issuedAt: 6969,
      expiresIn: 10000,
      idToken: 'WADDUP, PIMPS?',
    });
    expect(tokenState).toEqual({
      "accessToken": "TOTALLY AN ACCESS TOKEN",
      "accessTokenInformation": {"expiresAt": 16969, "issuedAt": 6969},
      "idToken": "WADDUP, PIMPS?",
      "isLoggedIn": true,
      "refreshToken": "Wanna go Skateboards?",
    })
  });
});
