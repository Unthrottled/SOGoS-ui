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
  let low = 0;
  let high = list.length - 1;

  while (low <= high) {
    const mid = (low + high) >>> 1;
    const midVal = list[mid];
    const cmp = comparator(midVal);

    if (cmp > 0)
      low = mid + 1;
    else if (cmp < 0)
      high = mid - 1;
    else
      return mid;
  }
  return -(low + 1);
};
