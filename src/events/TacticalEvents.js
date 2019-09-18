import type {
  ActivityCacheEvent,
  CachedSettings,
  PomodoroSettings,
  PomodoroSettingsRegistryFailure,
  TacticalActivity
} from "../types/TacticalModels";

export const CREATED_ACTIVITY: 'CREATED_ACTIVITY' = 'CREATED_ACTIVITY';
export const UPDATED_ACTIVITY: 'UPDATED_ACTIVITY' = 'UPDATED_ACTIVITY';
export const DELETED_ACTIVITY: 'DELETED_ACTIVITY' = 'DELETED_ACTIVITY';
export const HID_ACTIVITY: 'HID_ACTIVITY' = 'HID_ACTIVITY';
export const FOUND_ACTIVITIES: 'FOUND_ACTIVITIES' = 'FOUND_ACTIVITIES';
export const CACHED_TACTICAL_ACTIVITY: 'CACHED_TACTICAL_ACTIVITY' = 'CACHED_TACTICAL_ACTIVITY';
export const VIEWED_ACTIVITIES: 'VIEWED_ACTIVITIES' = 'VIEWED_ACTIVITIES';
export const SYNCED_TACTICAL_ACTIVITIES: 'SYNCED_TACTICAL_ACTIVITIES' = 'SYNCED_TACTICAL_ACTIVITIES';
export const SYNCED_TACTICAL_ACTIVITY: 'SYNCED_TACTICAL_ACTIVITY' = 'SYNCED_TACTICAL_ACTIVITY';

export const UPDATED_POMODORO_SETTINGS: 'UPDATED_POMODORO_SETTINGS' = 'UPDATED_POMODORO_SETTINGS';
export const CACHED_SETTINGS: 'CACHED_SETTINGS' = 'CACHED_SETTINGS';
export const VIEWED_SETTINGS: 'VIEWED_SETTINGS' = 'VIEWED_SETTINGS';
export const SYNCED_SETTINGS: 'SYNCED_SETTINGS' = 'SYNCED_SETTINGS';
export const REGISTERED_POMODORO_SETTINGS: 'REGISTERED_POMODORO_SETTINGS' = 'REGISTERED_POMODORO_SETTINGS';
export const FAILED_TO_REGISTER_POMODORO_SETTINGS: 'FAILED_TO_REGISTER_POMODORO_SETTINGS' = 'FAILED_TO_REGISTER_POMODORO_SETTINGS';

export const createUpdatedPomodoroSettingsEvent = (pomodoroSettings: PomodoroSettings) => ({
  type: UPDATED_POMODORO_SETTINGS,
  payload: pomodoroSettings,
});

export type SettingsCacheEvent = {
  cachedSettings: CachedSettings,
  userGUID: string,
};

export const createViewedSettingsEvent = () => ({
  type: VIEWED_SETTINGS,
});

export const createCachedSettingsEvent = (cachedSettings: SettingsCacheEvent) => ({
  type: CACHED_SETTINGS,
  payload: cachedSettings
});

export const createSyncedSettingsEvent = (userGUID: string) => ({
  type: SYNCED_SETTINGS,
  payload: userGUID,
});

export const createRegisteredPomodoroSettingsEvent = (pomodoroSettings: PomodoroSettings) => ({
  type: REGISTERED_POMODORO_SETTINGS,
  payload: pomodoroSettings
});

export const createFailureToRegisterPomodoroSettingsEvent = (pomodoroSettingsRegistryFailure: PomodoroSettingsRegistryFailure) => ({
  type: FAILED_TO_REGISTER_POMODORO_SETTINGS,
  payload: pomodoroSettingsRegistryFailure
});

export const createViewedActivitesEvent = () => ({
  type: VIEWED_ACTIVITIES,
});

export const createCachedActivityEvent = (objectiveCacheEvent: ActivityCacheEvent) => ({
  type: CACHED_TACTICAL_ACTIVITY,
  payload: objectiveCacheEvent
});

export const createFetchedActivitesEvent = (objectiveHistory: TacticalActivity[]) => ({
  type: FOUND_ACTIVITIES,
  payload: objectiveHistory
});

export const createSyncedActivityEvent = (objective: TacticalActivity) => ({
  type: SYNCED_TACTICAL_ACTIVITY,
  payload: objective,
});

export const createSyncedTacticalActivitiesEvent = (userGUID: string) => ({
  type: SYNCED_TACTICAL_ACTIVITIES,
  payload: userGUID,
});

export const createCreatedActivityEvent = (objective: TacticalActivity) => ({
  type: CREATED_ACTIVITY,
  payload: objective,
});

export const createUpdatedActivityEvent = (objective: TacticalActivity) => ({
  type: UPDATED_ACTIVITY,
  payload: objective,
});

export const createDeletedActivityEvent = (objective: TacticalActivity) => ({
  type: DELETED_ACTIVITY,
  payload: objective,
});

export const createHideActivityEvent = (objective: TacticalActivity) => ({
  type: HID_ACTIVITY,
  payload: objective,
});
