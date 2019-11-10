import networkReducer, {INITIAL_NETWORK_STATE} from "../../reducers/NetworkReducer";
import {FOUND_WIFI, LOST_WIFI} from "../../events/NetworkEvents";

describe('Network Reducer', () => {
  it('should return initial state when given nothing', async () => {
    const networkState = networkReducer();
    expect(networkState).toEqual({"isOnline": false, "hasInternet": false}
    );
  });
  it('should online state when given found WIFI action', async () => {
    const foundWifiAction = {
      type: FOUND_WIFI
    };
    const networkState = networkReducer(INITIAL_NETWORK_STATE, foundWifiAction);
    expect(networkState).toEqual({"isOnline": true, "hasInternet": false}
    );
  });
  it('should online state when given found WIFI action and was offline', async () => {
    const foundWifiAction = {
      type: FOUND_WIFI
    };
    const networkState = networkReducer({
      ...INITIAL_NETWORK_STATE,
      isOnline: false,
    }, foundWifiAction);
    expect(networkState).toEqual({"isOnline": true, "hasInternet": false});
  });
  it('should Offline state when given found WIFI action', async () => {
    const foundWifiAction = {
      type: LOST_WIFI
    };
    const networkState = networkReducer(INITIAL_NETWORK_STATE, foundWifiAction);
    expect(networkState).toEqual({"isOnline": false, "hasInternet": false});
  });
  it('should Offline state when given found WIFI action and was online', async () => {
    const foundWifiAction = {
      type: LOST_WIFI
    };
    const networkState = networkReducer({
      ...INITIAL_NETWORK_STATE,
      isOnline: true,
    }, foundWifiAction);
    expect(networkState).toEqual({"isOnline": false, "hasInternet": false});
  });
});
