const faker = require('faker');

const Sentence = acc => {
  function* iterator() {
    for (let word of acc.split(' ')) yield word;
  }

  return new Proxy(function Sentence() {}, {
    apply: () => acc.charAt(0).toUpperCase() + acc.slice(1) + '.',
    get(target, prop, receiver) {
      if (prop === Symbol.iterator) return iterator;
      if (typeof prop === 'symbol') return Reflect.get(target, prop, receiver);
      return Sentence(acc + ' ' + prop);
    },
  });
};

function* generator() {
  while (true) yield faker.lorem.sentence();
}

const sentence = new Proxy(function sentence() {}, {
  apply: () => faker.lorem.sentence(),
  get(target, prop, receiver) {
    if (prop === Symbol.iterator) return generator;
    if (typeof prop === 'symbol') return Reflect.get(target, prop, receiver);
    return Sentence(prop);
  },
});

module.exports = sentence;
