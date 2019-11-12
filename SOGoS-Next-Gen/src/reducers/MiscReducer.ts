import {DISMISSED_NOTIFICATION, REQUESTED_NOTIFICATION} from "../events/MiscEvents";

export interface NotificationState {
    message: string;
    shown: boolean;
    type: string;
}

export interface MiscState {
    notification: NotificationState;
}

export const INITIAL_MISC_STATE: MiscState = {
    notification: {
        message: 'We done goofed.',
        shown: false,
        type: 'warning'
    }
};

const MiscReducer = (state: MiscState = INITIAL_MISC_STATE, action: any) => {
    switch (action.type) {
        case DISMISSED_NOTIFICATION:
            return {
                ...state,
                notification: {
                    ...state.notification,
                    shown: false
                },
            };
        case REQUESTED_NOTIFICATION:
            return {
                ...state,
                notification: {
                    message: action.payload,
                    shown: true
                },
            };
        default:
            return state
    }
};

export default MiscReducer;
