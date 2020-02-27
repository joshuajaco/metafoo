const faker = require('faker');
const wordsToNumbers = require('words-to-numbers').default;
const { normalizeProp } = require('./utils');

function* iterator() {
  let i = 0;
  while (true) yield ++i;
}

const numbers = new Proxy(function numbers() {}, {
  apply: faker.random.number,
  get(target, prop, receiver) {
    if (prop === Symbol.iterator) return iterator;
    if (typeof prop === 'symbol') return Reflect.get(target, prop, receiver);
    return wordsToNumbers(normalizeProp(prop), { fuzzy: true });
  },
});

module.exports = numbers;
