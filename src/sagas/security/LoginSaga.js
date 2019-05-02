import {
  AuthorizationNotifier,
  AuthorizationRequest,
  AuthorizationRequestResponse,
  GRANT_TYPE_AUTHORIZATION_CODE,
  RedirectRequestHandler,
  TokenRequest
} from "@openid/appauth";
import {NodeCrypto} from '@openid/appauth/built/node_support/';
import {createLoggedOnAction} from "../../actions/SecurityActions";
import {call, put} from 'redux-saga/effects'
import {getNewTokens} from "./SecurityInitializationSaga";
import {completeAuthorizationRequest} from "../../security/StupidShit";


function* loginSaga({payload: oauthConfig}) {
  const notifier = new AuthorizationNotifier();
  const authorizationHandler = new RedirectRequestHandler();
  authorizationHandler.setAuthorizationNotifier(notifier);
  const authorizationResult: AuthorizationRequestResponse =
    yield call(() => completeAuthorizationRequest(authorizationHandler));
  if (!authorizationResult) {
    const scope = 'openid profile email';
    const authorizationRequest = new AuthorizationRequest({
      client_id: 'sogos-app',
      redirect_uri: 'http://localhost:3000',
      scope,
      response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
    }, new NodeCrypto());
    authorizationHandler.performAuthorizationRequest(oauthConfig, authorizationRequest);
  } else {
    const {request, response} = authorizationResult;
    yield getThatTokenYo(request, response, oauthConfig);
    yield put(createLoggedOnAction());
  }
}

function* getThatTokenYo(request, response, oauthConfig) {
  try {
    const code = response.code;
    const codeVerifier = request.internal && request.internal.code_verifier;

    const tokenRequest = new TokenRequest({
      client_id: "sogos-app",
      redirect_uri: 'http://localhost:3000',
      grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
      code,
      extras: {
        code_verifier: codeVerifier
      }
    });

    yield getNewTokens(oauthConfig, tokenRequest);
  } catch (e) {

  }
}


export default loginSaga;