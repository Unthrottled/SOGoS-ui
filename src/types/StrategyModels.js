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

export type ObjectiveCacheEvent = {
  objective: Objective,
  userGUID: string,
};
