export const objectToArray = object => Object.keys(object || {}).map(key => object[key]);

export type KeyValue = {
  key: any,
  value: any,
}

export const objectToKeyValueArray = (object): KeyValue[] => Object.keys(object || {}).map(key => ({
  key,
  value: object[key],
}));
