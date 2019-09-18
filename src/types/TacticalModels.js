import {CREATED, DELETED, UPDATED} from "../events/ActivityEvents";

export type PomodoroSettings = {
  loadDuration: number, //milliseconds
  shortRecoveryDuration: number,
  longRecoveryDuration: number,
}


export type CachedSettings = {
  settings: PomodoroSettings
};

export type PomodoroSettingsRegistryFailure = {
  error: any,
  settings: PomodoroSettings,
}

export type TacticalActivity = {};

export type CachedTacticalActivity = {
  uploadType: CREATED | UPDATED | DELETED,
  activity: TacticalActivity
}

export type ActivityCacheEvent = {
  activity: CachedTacticalActivity,
  userGUID: string,
}
