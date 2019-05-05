import {
  AuthorizationNotifier,
  AuthorizationRequest,
  AuthorizationRequestResponse,
  GRANT_TYPE_AUTHORIZATION_CODE,
  RedirectRequestHandler,
  TokenRequest
} from "@openid/appauth";
import {NodeCrypto} from '@openid/appauth/built/node_support/';
import {createCheckedAuthorizationEvent, createLoggedOnAction} from "../../events/SecurityEvents";
import {call, put} from 'redux-saga/effects'
import {getNewTokens} from "./SecurityInitializationSaga";
import {completeAuthorizationRequest} from "../../security/StupidShit";
import {oAuthConfigurationSaga} from "../ConfigurationSagas";


export function* authorizationGrantSaga(){
  yield performAuthorizationGrantFlowSaga(false);
  yield put(createCheckedAuthorizationEvent());
}

export function* loginSaga() {
  yield performAuthorizationGrantFlowSaga(true);
}

// Thanks shitty library API design
function* performAuthorizationGrantFlowSaga(shouldRequestLogon: boolean) {
  const oauthConfig = yield oAuthConfigurationSaga();
  const notifier = new AuthorizationNotifier();
  const authorizationHandler = new RedirectRequestHandler();
  authorizationHandler.setAuthorizationNotifier(notifier);
  const authorizationResult: AuthorizationRequestResponse =
    yield call(() => completeAuthorizationRequest(authorizationHandler));
  if (authorizationResult) {
    const {request, response} = authorizationResult;
    yield exchangeAuthorizationGrantForAccessToken(request, response, oauthConfig);
    yield put(createLoggedOnAction());
  } else if(shouldRequestLogon) {
    const scope = 'openid profile email';
    const authorizationRequest = new AuthorizationRequest({
      client_id: 'sogos-app',
      redirect_uri: 'http://localhost:3000',
      scope,
      response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
    }, new NodeCrypto());
    authorizationHandler.performAuthorizationRequest(oauthConfig, authorizationRequest);
  }
}

function* exchangeAuthorizationGrantForAccessToken(request, response, oauthConfig) {
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
