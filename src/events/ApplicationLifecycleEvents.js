export const INITIALIZED_APPLICATION: 'INITIALIZED_APPLICATION' = 'INITIALIZED_APPLICATION';

const requestSecurityUpdate = () => ({
  type: INITIALIZED_APPLICATION,
});

export const appInitialized = () => dispetch => {
  dispetch(requestSecurityUpdate());
};