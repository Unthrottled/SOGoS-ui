import {objectToArray} from "../../miscellanous/Tools";

describe('Tools', () => {

  describe('objectToArray', () => {
    it('should handle null', async () => {
      const result = objectToArray(null);
      expect(result).toEqual([]);
    });
    it('should handle undefined', async () => {
      const result = objectToArray(undefined);
      expect(result).toEqual([]);
    });
    it('should handle empty object', async () => {
      const result = objectToArray({});
      expect(result).toEqual([]);
    });
    it('should handle non empty object', async () => {
      const result = objectToArray({
        eat: 'pant',
        ayy: 'lmao',
      });
      expect(result).toEqual(['pant', 'lmao']);
    });
    it('should handle nested non empty object', async () => {
      const result = objectToArray({
        iAm: {
          machine: 'I never sleep'
        },
        until: {
          iFix: 'what\'s broken'
        },
        ayy: 'lemon'
      });
      expect(result).toEqual([
        {
          machine: 'I never sleep'
        },
        {
          iFix: 'what\'s broken'
        },
        'lemon',
      ]);
    });
  });

});
