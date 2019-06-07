export const FOUND_WIFI: 'FOUND_WIFI' = 'FOUND_WIFI';
export const LOST_WIFI: 'LOST_WIFI' = 'LOST_WIFI';

export const createFoundWifiEvent = () => ({
  type: FOUND_WIFI,
});
export const createLostWifiEvent = () => ({
  type: LOST_WIFI,
});

