import {Action} from "redux";
import {FOUND_WIFI, LOST_WIFI} from "../events/NetworkEvents";

export type NetworkState = {
  isOnline: boolean,
}

export const INITIAL_NETWORK_STATE: NetworkState = {
  isOnline: false,
};


const networkReducer = (state: NetworkState = INITIAL_NETWORK_STATE, action: Action = {}) => {
  switch (action.type) {
    case FOUND_WIFI :
      return {
        ...state,
        isOnline: true,
      };
    case LOST_WIFI:
      return {
        ...state,
        isOnline: false,
      };
    default:
      return state
  }
};

export default networkReducer;
