import {EventTypes} from "./EventTypes";

export interface KeyResult {
    id: string;
    objectiveId: string;
    valueStatement: string;
}
export interface ColorType {
    hex: string;
    opacity: number;
}

export interface IconCustomization {
    background: ColorType;
}

export interface Objective {
    id: string;
    valueStatement: string;
    keyResults: KeyResult[];
    iconCustomization: IconCustomization;
    associatedActivities: string[];
    categories: string[];
}

export interface CachedObjective {
    uploadType: EventTypes;
    objective: Objective;
}

export interface ObjectiveCacheEvent {
    objective: CachedObjective;
    userGUID: string;
}
