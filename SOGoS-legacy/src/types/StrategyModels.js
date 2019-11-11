import {CREATED, DELETED, UPDATED} from "../events/ActivityEvents";

export type KeyResult = {
  id: string,
  objectiveId: string,
  valueStatement: string,
}
export type ColorType = {
  hex: string,
  opacity: number
}

export type IconCustomization = {
  background: ColorType,
}

export type Objective = {
  id: string,
  valueStatement: string,
  keyResults: KeyResult[],
  iconCustomization: IconCustomization,
  associatedActivities: string[],
  categories: string[],
}

export type CachedObjective = {
  uploadType: CREATED | UPDATED | DELETED,
  objective: Objective
};

export type ObjectiveCacheEvent = {
  objective: CachedObjective,
  userGUID: string,
};