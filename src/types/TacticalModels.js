
export type PomodoroSettings = {
  loadDuration: number, //milliseconds
  shortRecoveryDuration: number,
  longRecoveryDuration: number,
}

export type PomodoroSettingsRegistryFailure = {
  error: any,
  settings: PomodoroSettings,
}