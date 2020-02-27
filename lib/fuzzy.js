const isNumber = require('is-number');
const leven = require('leven');
const { isObject } = require('./utils');

const getAllPropertyNames = (object, properties = []) => {
  const prototype = Object.getPrototypeOf(object);

  if (!prototype) return [...properties, ...Object.getOwnPropertyNames(object)];

  return [
    ...properties,
    ...Object.getOwnPropertyNames(object),
    ...getAllPropertyNames(prototype),
  ];
};

const closestMatch = (target, prop) => {
  let diffs = {};
  for (let key of getAllPropertyNames(target)) {
    diffs[leven(prop, key)] = key;
  }

  const min = Math.min(...Object.keys(diffs));

  return diffs[min];
};

const closestIndex = (target, prop) => {
  let diffs = {};
  for (let key of getAllPropertyNames(target).filter(n => isNumber(n))) {
    diffs[Math.abs(prop - key)] = key;
  }

  const min = Math.min(...Object.keys(diffs));

  return diffs[min];
};

const fuzzy = (object = {}) => {
  if (!isObject(object)) return object;

  return new Proxy(object, {
    get(target, prop, receiver) {
      if (typeof prop === 'symbol') return Reflect.get(target, prop, receiver);

      if (isNumber(prop)) {
        return fuzzy(Reflect.get(target, closestIndex(target, prop), receiver));
      }

      return fuzzy(Reflect.get(target, closestMatch(target, prop), receiver));
    },
    set(target, prop, ...rest) {
      if (typeof prop === 'symbol') return Reflect.set(target, prop, ...rest);
      if (isNumber(prop)) return Reflect.set(target, prop, ...rest);
      return Reflect.set(target, closestMatch(target, prop), ...rest);
    },
  });
};

module.exports = fuzzy;
