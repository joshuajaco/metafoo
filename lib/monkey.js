const { normalizeProp } = require('./utils');

const patches = {
  [Number]: {
    isEven() {
      return Number(this) % 2 === 0;
    },
    isOdd() {
      return Number(this) % 2 === 1;
    },
  },
  [String]: {
    inquiry() {
      return new Proxy(
        {},
        {
          get: (_, prop) => String(this) === normalizeProp(prop),
        },
      );
    },
    camelcase() {
      return normalizeProp(this).replace(/( [a-z])/g, $ => $[1].toUpperCase());
    },
    kebabcase() {
      return normalizeProp(this).replace(/ /g, '-');
    },
    pascalcase() {
      const camelcased = this.camelcase();
      return camelcased.charAt(0).toUpperCase() + camelcased.slice(1);
    },
    snakecase() {
      return normalizeProp(this).replace(/ /g, '_');
    },
  },
  [Array]: {
    each: Array.prototype.forEach,
    select: Array.prototype.filter,
    reject(callback, thisArg) {
      return this.filter(function() {
        return !callback.apply(this, arguments);
      }, thisArg);
    },
  },
};

const parseConfig = config =>
  config.flatMap(item => {
    const type = typeof item;
    if (
      item === Number ||
      item instanceof Number ||
      type === 'number' ||
      (type === 'string' && item.toLowerCase() === 'number')
    ) {
      return Number;
    }

    if (
      item === Array ||
      (type === 'string' && item.toLowerCase() === 'array')
    ) {
      return Array;
    }

    if (item === String || item instanceof String || type === 'string') {
      return String;
    }

    if (Array.isArray(item)) {
      if (!item.length) return Array;
      else return parseConfig(item);
    }
  });

const patch = (...config) => {
  const constructors = config.length
    ? new Set(parseConfig(config))
    : [Number, String, Array];

  constructors.forEach(constructor => {
    Object.entries(patches[constructor]).forEach(([k, v]) => {
      constructor.prototype[k] = v;
    });
  });

  return () => {};
};

const monkey = (...config) =>
  Object.defineProperty({}, 'patch', {
    get: () => patch(...config),
  });

Object.defineProperty(monkey, 'patch', { get: patch });

module.exports = monkey;
