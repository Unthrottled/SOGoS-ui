import HistoryReducer, {INITIAL_HISTORY_STATE} from "../../reducers/HistoryReducer";

describe('History Reducer', () => {
  it('should return initial state when given nothing', async () => {
    const historyState = HistoryReducer();
    expect(historyState).toEqual(INITIAL_HISTORY_STATE);
  });
});
