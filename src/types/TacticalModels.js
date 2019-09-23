import {CREATED, DELETED, UPDATED} from "../events/ActivityEvents";
import type {ColorType} from "./StrategyModels";
import {ActivityStrategy, isActivityRecovery, RECOVERY} from "./ActivityModels";

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

export const getActivityBackgroundColor = (tacticalActivity: TacticalActivity): string =>
  (tacticalActivity &&
  tacticalActivity.iconCustomization &&
  tacticalActivity.iconCustomization.background &&
  tacticalActivity.iconCustomization.background.hex) ||
  (isActivityRecovery(tacticalActivity) && RECOVERY) ||
  ActivityStrategy.GENERIC;

export type TacticalActivity = {
  id: string,
  name: string,
  iconCustomization: {
    background: ColorType,
    line: ColorType,
  },
  categories: string[],
};

export type CachedTacticalActivity = {
  uploadType: CREATED | UPDATED | DELETED,
  activity: TacticalActivity
}

export type ActivityCacheEvent = {
  activity: CachedTacticalActivity,
  userGUID: string,
}
