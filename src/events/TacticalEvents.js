import type {PomodoroSettings} from "../types/TacticalModels";

export const UPDATED_POMODORO_SETTINGS: 'UPDATED_POMODORO_SETTINGS' = 'UPDATED_POMODORO_SETTINGS';

export const createUpdatedPomodoroSettingsEvent = (pomodoroSettings: PomodoroSettings) => ({
  type: UPDATED_POMODORO_SETTINGS,
  payload: pomodoroSettings,
});
