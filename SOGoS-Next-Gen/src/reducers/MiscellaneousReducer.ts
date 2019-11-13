import {DISMISSED_NOTIFICATION, REQUESTED_NOTIFICATION} from "../events/MiscEvents";

export interface NotificationState {
    message: string;
    shown: boolean;
    type: string;
}

export interface MiscellaneousState {
    notification: NotificationState;
}

export const INITIAL_MISC_STATE: MiscellaneousState = {
    notification: {
        message: 'We done goofed.',
        shown: false,
        type: 'warning'
    }
};

const MiscellaneousReducer = (state: MiscellaneousState = INITIAL_MISC_STATE, action: any): MiscellaneousState => {
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
                    shown: true,
                    type: 'info'
                },
            };
        default:
            return state
    }
};

export default MiscellaneousReducer;
