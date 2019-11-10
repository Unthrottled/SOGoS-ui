import {objectToArray, reverseBinarySearch} from "../../miscellanous/Tools";
import type {Activity} from "../../types/ActivityModels";

describe('Tools', () => {

  describe('reverseBinarySearch', () => {
    it('should find correct index', async () => {
      const result = reverseBinarySearch(testArray,
        (activity: Activity) => activity.antecedenceTime - 1569231973678);
      expect(result).toEqual(9)
    });
    it('should find correct index, Part: II', async () => {
      const result = reverseBinarySearch(testArray,
        (activity: Activity) => activity.antecedenceTime - 1569234507539);
      expect(result).toEqual(0)
    });
    it('should find correct index, Part: III', async () => {
      const result = reverseBinarySearch(testArray,
        (activity: Activity) => activity.antecedenceTime - 1569234507540);
      expect(result).toEqual(-1)
    });
    it('should find correct index, Part: IV', async () => {
      const result = reverseBinarySearch(testArray,
        (activity: Activity) => activity.antecedenceTime - 1569234507538);
      expect(result).toEqual(-2)
    });
    it('should find correct index, Part: V', async () => {
      const result = reverseBinarySearch(testArray,
        (activity: Activity) => activity.antecedenceTime - 1569231973677);
      expect(result).toEqual(-11)
    });
    it('should find correct index, Part: VI', async () => {
      const result = reverseBinarySearch(testArray,
        (activity: Activity) => activity.antecedenceTime - 1569231973679);
      expect(result).toEqual(-10)
    });
    it('should find correct index, Part: VII', async () => {
      const result = reverseBinarySearch(testArray,
        (activity: Activity) => activity.antecedenceTime - 1569234268251);
      expect(result).toEqual(4)
    });
    it('should find correct index, Part: VIII', async () => {
      const result = reverseBinarySearch(testArray,
        (activity: Activity) => activity.antecedenceTime - 1569234268250);
      expect(result).toEqual(-6)
    });
    it('should find correct index, Part: IX', async () => {
      const result = reverseBinarySearch(testArray,
        (activity: Activity) => activity.antecedenceTime - 1569234268252);
      expect(result).toEqual(-5)
    });
  });


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


const testArray = [{"antecedenceTime":1569234507539,"content":{"name":"RECOVERY","type":"ACTIVE","uuid":"5ecfbd62-b85e-4d36-a1a4-660da82337af"}},{"antecedenceTime":1569234289431,"content":{"activityID":"74a74d25-d9e0-4b6f-8849-9b7bf6a3c6e6","name":"Yeet","type":"ACTIVE","timedType":"TIMER","duration":1184816,"uuid":"b9bc5d24-ded7-4268-8f84-6f357c4442a0"}},{"antecedenceTime":1569234278731,"content":{"name":"RECOVERY","type":"ACTIVE","timedType":"STOP_WATCH","uuid":"ac789ed4-3295-4589-8bd9-9da1361e7946"}},{"antecedenceTime":1569234271403,"content":{"activityID":"74a74d25-d9e0-4b6f-8849-9b7bf6a3c6e6","name":"Yeet","type":"ACTIVE","timedType":"TIMER","duration":1192143,"uuid":"fd07c2e7-6d70-4d10-a57f-03c54cf47bfb"}},{"antecedenceTime":1569234268251,"content":{"name":"RECOVERY","type":"ACTIVE","timedType":"STOP_WATCH","uuid":"5feec9a8-9b62-41a2-b56f-05369baa191b"}},{"antecedenceTime":1569234264583,"content":{"activityID":"74a74d25-d9e0-4b6f-8849-9b7bf6a3c6e6","name":"Yeet","type":"ACTIVE","timedType":"TIMER","duration":1195807,"uuid":"290e5341-960f-4c2e-8b61-8afee2ab1541"}},{"antecedenceTime":1569234185434,"content":{"name":"RECOVERY","type":"ACTIVE","timedType":"STOP_WATCH","uuid":"1a2ffaef-2e6e-4207-875c-568e6d9ff3e4"}},{"antecedenceTime":1569233761238,"content":{"activityID":"74a74d25-d9e0-4b6f-8849-9b7bf6a3c6e6","name":"Yeet","type":"ACTIVE","timedType":"TIMER","duration":1620000,"uuid":"e474f35b-6b49-4574-a8a9-051f90700048"}},{"antecedenceTime":1569233756463,"content":{"name":"RECOVERY","type":"ACTIVE","uuid":"4130618f-4626-4a4b-b943-3ac4673ee8fc"}},{"antecedenceTime":1569231973678,"content":{"activityID":"3701744a-157f-49c3-905b-994d5a88b3e7","name":"Titties","type":"ACTIVE","timedType":"STOP_WATCH","uuid":"52c1f2a4-2933-41b7-b030-b801fb64eda8","workStartedWomboCombo":1569231973677}},{"content":{"name":"RECOVERY","type":"ACTIVE","uuid":"58ae47db-4ac2-46a7-886a-f89a30bef0d0"},"antecedenceTime":1569230770989}];
