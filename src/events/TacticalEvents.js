import type {PomodoroSettings, PomodoroSettingsRegistryFailure} from "../types/TacticalModels";

export const UPDATED_POMODORO_SETTINGS: 'UPDATED_POMODORO_SETTINGS' = 'UPDATED_POMODORO_SETTINGS';
export const REGISTERED_POMODORO_SETTINGS: 'REGISTERED_POMODORO_SETTINGS' = 'REGISTERED_POMODORO_SETTINGS';
export const FAILED_TO_REGISTER_POMODORO_SETTINGS: 'FAILED_TO_REGISTER_POMODORO_SETTINGS' = 'FAILED_TO_REGISTER_POMODORO_SETTINGS';

export const createUpdatedPomodoroSettingsEvent = (pomodoroSettings: PomodoroSettings) => ({
  type: UPDATED_POMODORO_SETTINGS,
  payload: pomodoroSettings,
});

export const createRegisteredPomodoroSettingsEvent = (pomodoroSettings: PomodoroSettings) => ({
  type: REGISTERED_POMODORO_SETTINGS,
  payload: pomodoroSettings
});

export const createFailureToRegisterPomodoroSettingsEvent = (pomodoroSettingsRegistryFailure: PomodoroSettingsRegistryFailure) => ({
  type: FAILED_TO_REGISTER_POMODORO_SETTINGS,
  payload: pomodoroSettingsRegistryFailure
});
