export const objectToArray = object => Object.keys(object || {}).map(key => object[key]);

export type KeyValue = {
  key: any,
  value: any,
}

export const objectToKeyValueArray = (object): KeyValue[] => Object.keys(object || {}).map(key => ({
  key,
  value: object[key],
}));

export const binarySearch = (list, comparator) => {
  return binarySearchRecursion(list, 0, list.length, comparator)
};

const binarySearchRecursion = (list, start, stop, comparator) => {
  if(stop <= start) {
    return -start;
  } else {
    const middleIndex = Math.floor((stop + start)/2);
    const compareValue = comparator(list[middleIndex]);
    if (compareValue === 0){
      return middleIndex;
    } else if(compareValue > 0){
      return binarySearchRecursion(list, start, middleIndex - 1, comparator);
    } else {
      return binarySearchRecursion(list, middleIndex + 1, stop, comparator)
    }
  }
};
