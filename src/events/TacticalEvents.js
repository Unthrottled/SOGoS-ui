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
export const UNHID_ACTIVITY: 'UNHID_ACTIVITY' = 'UNHID_ACTIVITY';
export const FOUND_ACTIVITIES: 'FOUND_ACTIVITIES' = 'FOUND_ACTIVITIES';
export const RANKED_ACTIVITIES: 'RANKED_ACTIVITIES' = 'RANKED_ACTIVITIES';
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

export const createViewedTacticalActivitesEvent = () => ({
  type: VIEWED_ACTIVITIES,
});

export const createCachedTacticalActivityEvent = (tacticalActivityCacheEvent: ActivityCacheEvent) => ({
  type: CACHED_TACTICAL_ACTIVITY,
  payload: tacticalActivityCacheEvent
});

export const createFetchedTacticalActivitesEvent = (tacticalActivityHistory: TacticalActivity[]) => ({
  type: FOUND_ACTIVITIES,
  payload: tacticalActivityHistory
});

export const createReRankedTacticalActivitiesEvent = (tacticalActivityHistory: TacticalActivity[]) => ({
  type: RANKED_ACTIVITIES,
  payload: tacticalActivityHistory
});

export const createSyncedTacticalActivityEvent = (tacticalActivity: TacticalActivity) => ({
  type: SYNCED_TACTICAL_ACTIVITY,
  payload: tacticalActivity,
});

export const createSyncedTacticalActivitiesEvent = (userGUID: string) => ({
  type: SYNCED_TACTICAL_ACTIVITIES,
  payload: userGUID,
});

export const createCreatedTacticalActivityEvent = (tacticalActivity: TacticalActivity) => ({
  type: CREATED_ACTIVITY,
  payload: tacticalActivity,
});

export const createUpdatedTacticalActivityEvent = (tacticalActivity: TacticalActivity) => ({
  type: UPDATED_ACTIVITY,
  payload: tacticalActivity,
});

export const createDeletedTacticalActivityEvent = (tacticalActivity: TacticalActivity) => ({
  type: DELETED_ACTIVITY,
  payload: tacticalActivity,
});

export const createHideTacticalActivityEvent = (tacticalActivity: TacticalActivity) => ({
  type: HID_ACTIVITY,
  payload: tacticalActivity,
});

export const createShowTacticalActivityEvent = (tacticalActivity: TacticalActivity) => ({
  type: UNHID_ACTIVITY,
  payload: tacticalActivity,
});
