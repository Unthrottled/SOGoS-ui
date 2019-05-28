import {createRequestLogonEvent, requestLogoff} from "../events/SecurityEvents";

export const logout = () => dispetch => dispetch(requestLogoff());

export const login = () => dispetch => dispetch(createRequestLogonEvent());
