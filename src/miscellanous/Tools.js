export const objectToArray = object => Object.keys(object || {}).map(key => object[key]);

export type KeyValue = {
  key: any,
  value: any,
}

export const objectToKeyValueArray = (object): KeyValue[] => Object.keys(object || {}).map(key => ({
  key,
  value: object[key],
}));

export const reverseBinarySearch = (list, comparator) => {
  return reverseBinarySearchRecursion(list, 0, list.length, comparator)
};

const reverseBinarySearchRecursion = (list, start, stop, comparator) => {
  if(stop <= start) {
    return -(stop + 1);
  } else {
    const middleIndex = Math.floor((stop + start)/2);
    const compareValue = comparator(list[middleIndex]);
    if (compareValue === 0){
      return middleIndex;
    } else if(compareValue > 0){
      return reverseBinarySearchRecursion(list, start, middleIndex - 1, comparator);
    } else {
      return reverseBinarySearchRecursion(list, middleIndex + 1, stop, comparator)
    }
  }
};
