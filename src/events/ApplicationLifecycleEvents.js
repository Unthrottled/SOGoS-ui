export const INITIALIZED_APPLICATION: 'INITIALIZED_APPLICATION' = 'INITIALIZED_APPLICATION';

const createApplicationInitializedEvent = () => ({
  type: INITIALIZED_APPLICATION,
});

export const appInitialized = () => dispetch => {
  dispetch(createApplicationInitializedEvent());
};
