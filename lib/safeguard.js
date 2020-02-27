const { isObject } = require('./utils');

const Safeguard = new Proxy(function Safeguard() {}, {
  get: () => Safeguard,
  apply: () => Safeguard,
});

const safeguard = (object = {}) => {
  if (!isObject(object)) return object;

  return new Proxy(object, {
    get(...args) {
      const result = Reflect.get(...args);
      return result != null ? safeguard(result) : Safeguard;
    },
  });
};

module.exports = safeguard;
