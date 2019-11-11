import {ColorType} from "./StrategyTypes";
import {EventTypes} from "./EventTypes";
import {ActivityStrategy, RECOVERY} from "./ActivityTypes";

export interface RememberedPomodoro {
    dateCounted: number;
    count: number;
}

export interface PomodoroSettings {
    loadDuration: number, //milliseconds
    shortRecoveryDuration: number,
    longRecoveryDuration: number,
}

export interface CachedSettings {
    settings: PomodoroSettings
}

export interface PomodoroSettingsRegistryFailure {
    error: any,
    settings: PomodoroSettings,
}

export const getActivityBackgroundColor = (tacticalActivity: TacticalActivity): string =>
    (tacticalActivity &&
        tacticalActivity.iconCustomization &&
        tacticalActivity.iconCustomization.background &&
        tacticalActivity.iconCustomization.background.hex) ||
    (tacticalActivity.name === RECOVERY && RECOVERY) ||
    ActivityStrategy.GENERIC;

export interface TacticalActivity {
    id: string,
    name: string,
    rank: number,
    iconCustomization: {
        background: ColorType,
        line: ColorType,
    },
    categories: string[],
    hidden: boolean,
}

export interface CachedTacticalActivity {
    uploadType: EventTypes.CREATED | EventTypes.UPDATED | EventTypes.DELETED,
    activity: TacticalActivity
}

export interface TacticalActivityCacheEvent {
    activity: CachedTacticalActivity,
    userGUID: string,
}
