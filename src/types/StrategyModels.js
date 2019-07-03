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
export type StrategyState = {
  objectives: Objective[],
  keyResults: KeyResult[],
  cache: any,
}

export type ObjectiveCacheEvent = {
  objective: Objective,
  userGUID: string,
};
