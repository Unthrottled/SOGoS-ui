import {CREATED, DELETED, UPDATED} from "../events/ActivityEvents";

export type KeyResult = {
  id: string,
  objectiveId: string,
  valueStatement: string,
}
export type Objective = {
  id: string,
  valueStatement: string,
  keyResults: KeyResult[],
}

export type CachedObjective = {
  uploadType: CREATED | UPDATED | DELETED,
  objective: Objective
};

export type ObjectiveCacheEvent = {
  objective: CachedObjective,
  userGUID: string,
};
