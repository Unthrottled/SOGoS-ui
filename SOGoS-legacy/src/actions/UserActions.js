import {createRequestedSyncEvent} from "../events/UserEvents";


export const
  requestedManualSync = () =>
    dispetch => {
      dispetch(createRequestedSyncEvent());
    };
