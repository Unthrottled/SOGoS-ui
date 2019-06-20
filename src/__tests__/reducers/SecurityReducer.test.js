import type {SecurityState} from "../../reducers/SecurityReducer";
import securityReducer from "../../reducers/SecurityReducer";
import {LOGGED_OFF, LOGGED_ON, RECEIVED_TOKENS} from "../../events/SecurityEvents";

describe('Security Reducer', () => {
  describe('on Logged in', () => {
    it('should preserve state and set logged on when already logged on', () => {
      const securityState: SecurityState = securityReducer({
        isLoggedIn: true,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      }, {
        type: LOGGED_ON,
      });

      expect(securityState).toEqual({
        isLoggedIn: true,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      })
    });
    it('should preserve state and set logged on when not logged on', () => {
      const securityState: SecurityState = securityReducer({
        isLoggedIn: false,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      }, {
        type: LOGGED_ON,
      });

      expect(securityState).toEqual({
        isLoggedIn: true,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      })
    });
  });
  describe('on logged off', () => {
    it('should wipe state and set logged off when already logged on', () => {
      const securityState: SecurityState = securityReducer({
        isLoggedIn: true,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      }, {
        type: LOGGED_OFF,
      });

      expect(securityState).toEqual({
        isLoggedIn: false,
        isExpired: false,
        isInitialized: false,
      })
    });
    it('should wipe state and set logged on when not logged on', () => {
      const securityState: SecurityState = securityReducer({
        isLoggedIn: false,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      }, {
        type: LOGGED_OFF,
      });

      expect(securityState).toEqual({
        isLoggedIn: false,
        isExpired: false,
        isInitialized: false,
      })
    });
  });
  describe('on token reception', () => {
    it('should take the new stuff from the token event', () => {
      const securityState = securityReducer({
        isLoggedIn: true,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      }, {
        type: RECEIVED_TOKENS,
        payload: {
          accessToken: 'TOTALLY AN ACCESS TOKEN',
          issuedAt: 6969,
          expiresIn: 10000,
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzOTAwMGViMC01YjEyLTQxMzAtOGVhZi1jYzU5Mjc3NWNmNDMifQ.eyJqdGkiOiI0ZGFjMDZjMS1jMWI4LTQwNmMtYjFkNi1hMjE5NTgwZjNiNmMiLCJleHAiOjE1NjA0MjIxNDUsIm5iZiI6MCwiaWF0IjoxNTYwNDIwMzQ1LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvbWFzdGVyIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL21hc3RlciIsInN1YiI6ImFiZWUwOTYxLTdkNjctNGQyOS1hZjg0LWFjNjIzM2RkMzQ0OCIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJzb2dvcy1hcHAiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiI0YTI1YzI3OC02OGVlLTQ5ZGEtOWU1Mi0wZGE3ZTVhOWRmYmYiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiY3JlYXRlLXJlYWxtIiwib2ZmbGluZV9hY2Nlc3MiLCJhZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsic29nb3MiOnsicm9sZXMiOlsidmlldy11c2VyIl19LCJtYXN0ZXItcmVhbG0iOnsicm9sZXMiOlsidmlldy1yZWFsbSIsInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwibWFuYWdlLWlkZW50aXR5LXByb3ZpZGVycyIsImltcGVyc29uYXRpb24iLCJjcmVhdGUtY2xpZW50IiwibWFuYWdlLXVzZXJzIiwicXVlcnktcmVhbG1zIiwidmlldy1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsInF1ZXJ5LXVzZXJzIiwibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsInZpZXctZXZlbnRzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUifQ.pO3DjJ7lKxkP2tZzTXSzE1KKUmZbPQ5wTPo_C14YmdY',
          idToken: 'WADDUP, PIMPS?',
        }
      });
      expect(securityState).toEqual({
        "accessToken": "TOTALLY AN ACCESS TOKEN",
        "accessTokenInformation": {"expiresAt": 16969, "issuedAt": 6969},
        "idToken": "WADDUP, PIMPS?",
        "isLoggedIn": true,
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzOTAwMGViMC01YjEyLTQxMzAtOGVhZi1jYzU5Mjc3NWNmNDMifQ.eyJqdGkiOiI0ZGFjMDZjMS1jMWI4LTQwNmMtYjFkNi1hMjE5NTgwZjNiNmMiLCJleHAiOjE1NjA0MjIxNDUsIm5iZiI6MCwiaWF0IjoxNTYwNDIwMzQ1LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvbWFzdGVyIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL21hc3RlciIsInN1YiI6ImFiZWUwOTYxLTdkNjctNGQyOS1hZjg0LWFjNjIzM2RkMzQ0OCIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJzb2dvcy1hcHAiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiI0YTI1YzI3OC02OGVlLTQ5ZGEtOWU1Mi0wZGE3ZTVhOWRmYmYiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiY3JlYXRlLXJlYWxtIiwib2ZmbGluZV9hY2Nlc3MiLCJhZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsic29nb3MiOnsicm9sZXMiOlsidmlldy11c2VyIl19LCJtYXN0ZXItcmVhbG0iOnsicm9sZXMiOlsidmlldy1yZWFsbSIsInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwibWFuYWdlLWlkZW50aXR5LXByb3ZpZGVycyIsImltcGVyc29uYXRpb24iLCJjcmVhdGUtY2xpZW50IiwibWFuYWdlLXVzZXJzIiwicXVlcnktcmVhbG1zIiwidmlldy1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsInF1ZXJ5LXVzZXJzIiwibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsInZpZXctZXZlbnRzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUifQ.pO3DjJ7lKxkP2tZzTXSzE1KKUmZbPQ5wTPo_C14YmdY",
        "refreshTokenInformation": {"expiresAt": 1560422145, "issuedAt": 1560420345}
      });
    });

  });
  describe('on unknown', () => {
    it('should preserve state', () => {
      const securityState: SecurityState = securityReducer({
        isLoggedIn: true,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      }, {
        type: 'pickles',
      });

      expect(securityState).toEqual({
        isLoggedIn: true,
        accessToken: 'NOT AN ACCESS TOKEN',
        accessTokenInformation: {
          expiresAt: 9001,
          issuedAt: 69,
        },
        refreshToken: 'DEAD REFRESH TOKEN',
        idToken: 'YES, THIS IS DOG',
      })
    });
  });
});
