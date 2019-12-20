import {PayloadEvent} from "./Event";

export const INITIALIZED_APPLICATION: 'INITIALIZED_APPLICATION' = 'INITIALIZED_APPLICATION';
export const INITIALIZATION_FAILURE: 'INITIALIZATION_FAILURE' = 'INITIALIZATION_FAILURE';
export const MOUNTED_APPLICATION: 'MOUNTED_APPLICATION' = 'MOUNTED_APPLICATION';
export const TIME_IS_WACK: 'TIME_IS_WACK' = 'TIME_IS_WACK';

export const createApplicationInitializedEvent = () => ({
    type: INITIALIZED_APPLICATION,
});

export const createFailedToInitializeApplicationEvent = (error: Error): PayloadEvent<Error> => ({
    type: INITIALIZATION_FAILURE,
    payload: error,
});

export const createApplicationMountedEvent = () => ({
    type: MOUNTED_APPLICATION,
});

export const createOutOfSyncEvent = () => ({
    type: TIME_IS_WACK,
});
