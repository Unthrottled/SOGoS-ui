import type {CachedSettings, PomodoroSettings, PomodoroSettingsRegistryFailure} from "../types/TacticalModels";

export const UPDATED_POMODORO_SETTINGS: 'UPDATED_POMODORO_SETTINGS' = 'UPDATED_POMODORO_SETTINGS';
export const CACHED_SETTINGS: 'CACHED_SETTINGS' = 'CACHED_SETTINGS';
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
