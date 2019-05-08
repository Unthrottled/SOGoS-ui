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
import {completeAuthorizationRequest} from "../../security/StupidShit";
import {createRequestForInitialConfigurations, FOUND_INITIAL_CONFIGURATION} from "../../events/ConfigurationEvents";
import {take} from "redux-saga-test-plan/matchers";
import {fetchTokenSaga} from "./TokenSagas";
import {oAuthConfigurationSaga} from "../configuration/ConfigurationConvienenceSagas";


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
    yield put(createRequestForInitialConfigurations());
    const {payload: initialConfigurations} = yield take(FOUND_INITIAL_CONFIGURATION);
    const authorizationRequest = new AuthorizationRequest({
      client_id: initialConfigurations.clientID,
      redirect_uri: initialConfigurations.callbackURI,
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

    yield put(createRequestForInitialConfigurations());
    const {payload: initialConfigurations} = yield take(FOUND_INITIAL_CONFIGURATION);
    const tokenRequest = new TokenRequest({
      client_id: initialConfigurations.clientID,
      redirect_uri: initialConfigurations.callbackURI,
      grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
      code,
      extras: {
        code_verifier: codeVerifier
      }
    });

    yield fetchTokenSaga(oauthConfig, tokenRequest);
  } catch (e) {

  }
}
