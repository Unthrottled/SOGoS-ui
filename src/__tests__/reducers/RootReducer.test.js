import {selectConfigurationState, selectHistoryState} from "../../reducers";

describe('Root Reducer', () => {
  describe('selectConfigurationState', () => {
    it('should return configuration state', async () => {
      const globalState = {
        configuration: 'I am configuration'
      };
      const result = selectConfigurationState(globalState);
      expect(result).toEqual('I am configuration')
    });
  });
  describe('selectHistoryState', () => {
    it('should return history state', async () => {
      const globalState = {
        history: 'I am history'
      };
      const result = selectHistoryState(globalState);
      expect(result).toEqual('I am history')
    });
  });
});
