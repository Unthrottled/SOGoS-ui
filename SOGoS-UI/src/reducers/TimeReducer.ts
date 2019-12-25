export interface TimeState {

}

export const INITIAL_TIME_STATE: TimeState = {

};

export default (state: TimeState = INITIAL_TIME_STATE, action: any) => {
  switch (action.type) {
    default:
      return state;
  }
}
