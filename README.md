# metafoo [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A collection of APIs that let you write very [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) and _meta_ code. Inspired by projects like [Ruby on Rails](https://rubyonrails.org/) and [MobX](https://mobx.js.org/).

## Installation

```sh
# npm
npm install metafoo

# yarn
yarn add metafoo
```

## Usage

### numbers

The `numbers` module lets you create numbers from conveniently named variables.

Basic:

```js
import { numbers } from 'metafoo';
// or
const { numbers } = require('metafoo');

const { one, two, three } = numbers;

console.log(one, two, three); // 1 2 3
```

Supports camel, pascal and snake case:

```js
const {
  twoHundredAndSeven,
  TwoHundredAndSeven,
  two_hundred_and_seven,
} = numbers;

console.log(twoHundredAndSeven); // 207
console.log(TwoHundredAndSeven); // 207
console.log(two_hundred_and_seven); // 207
```

Also supports kebab case and dot notation:

```js
console.log(numbers['two-hundred-and-seven']); // 207
console.log(numbers['two.hundred.and.seven']); // 207
```

Don't worry about any spelling errors:

```js
const { tooHundretNadSvenen } = numbers;

console.log(tooHundretNadSvenen); // 207
```

You can go wild here:

```js
console.log(numbers['-. _ too--_.Hundret __ -.nadSvenen-_']); // 207
```

Use it to generate random numbers:

```js
console.log(numbers()); // 9603
console.log(numbers()); // 14417
```

Or loop from 1 to Infinity

```js
for (let num of numbers) {
  console.log(num); // 1 ↩︎ 2 ↩︎ 3 ... Infinity
}
```

### sentence

The clean way of writing sentences.

Basic:

```js
import { sentence } from 'metafoo';
// or
const { sentence } = require('metafoo');

console.log(sentence.hello.world()); // Hello world.
```

The sentence is only converted to a string when it is called so you can extend it:

```js
let s = sentence.this.is;
const isNice = true;

if (isNice) {
  s = s.nice;
} else {
  s = s.not.nice;
}

console.log(s()); // This is nice.
```

Loop over all the words of a sentence:

```js
for (let word of sentence.hello.world) {
  console.log(word); // hello ↩ world
}
```

Convert the sentence to an array using the spread syntax

```js
console.log([...sentence.hello.world]); // [ 'hello', 'world' ]
```

Generate random sentences:

```js
console.log(sentence()); // Est atque vel doloribus animi nihil.
console.log(sentence()); // Delectus soluta sit ipsam placeat quas sed.
```

Or even an endless loop of random sentences:

```js
for (let s of sentence) {
  console.log(s); // Quae quaerat dolorem ut. ↩ Est id aut non atque. ...
}
```

### safeguard

Gettin tired of `TypeError: bla is not a function` and `TypeError: Cannot read property bla of undefined`? Well with `safeguard` that's no more!

Basic:

```js
import { safeguard } from 'metafoo';
// or
const { safeguard } = require('metafoo');

const obj = safeguard({ foo: { bar: 'baz' } });

console.log(obj.foo.bar); // baz
console.log(obj.foo.bang); // [Function: Safeguard]
console.log(obj.does.not.exist); // [Function: Safeguard]
console.log(obj.not.a.function()); // [Function: Safeguard]
console.log(obj.what().the.fuck.is().happening); // [Function: Safeguard]
```

It will also work for arrays:

```js
const arr = safeguard([1, 2, 3]);
console.log(arr[0]); // 1
console.log(arr[-1]); // [Function: Safeguard]
console.log(arr[3]().foo.bar()); // [Function: Safeguard]
```

### fuzzy

Sometimes you can have small spelling mistakes in your code and unlike `safeguard`, where nothing will happen, `fuzzy` knows what property you actually meant!

```js
import { fuzzy } from 'metafoo';
// or
const { fuzzy } = require('metafoo');

const obj = fuzzy({ foo: 'bar' });

console.log(obj.fol); // bar
```

Also works for nested objects:

```js
const obj = fuzzy({ foo: { bar: 'baz' } });

console.log(obj.fol.baf); // baz

// setting a value is also fuzzy
obj.fop.bat = 'bang';

console.log(obj); // { foo: { bar: 'bang' } }

// if you want to set a new value you'll have to use Object.defineProperty

Object.defineProperty(obj, 'fooBar', { value: 'foo-bar' });

console.log(obj.folbat); // foo-bar
```

For arrays it takes the closest index instead:

```js
const arr = fuzzy([1, 2, 3]);

console.log(arr[0]); // 1
console.log(arr[3]); // 3
console.log(arr[-1]); // 1
console.log(arr[1.346]); // 2
console.log(arr.filzer(v => v > 1)); // [ 2, 3 ]

// here setting a value is NOT fuzzy
arr[3] = 4;

console.log(arr); // [ 1, 2, 3, 4 ]
```

Objects with number keys will work similar to arrays:

```js
const nums = fuzzy({
  1: 'One',
  2: 'Two',
  3: 'Three',
  3.1415: 'PI',
  4: 'Four',
  5: 'Five',
});

console.log(nums[-1]); // One
console.log(nums[3]); // Three
console.log(nums[3.1]); // PI
console.log(nums[3.6]); // Four
```

### monkey

Adds useful functions to the base data types by monkey patching their prototypes. See a list of all mokey patches [here](https://github.com/joshuajaco/metafoo#monkey-patches).

Basic:

```js
import { monkey } from 'metafoo';
// or
const { monkey } = require('metafoo');

monkey.patch;
// you can also call it if you want, doesn't make a difference
monkey.patch();

console.log((1).isEven()); // false
console.log('HelloWorld'.snakecase()); // hello_world
console.log([1, 2, 3].reject(v => v < 2)); // [2, 3]
```

You can also configure what prototypes to monkey patch:

```js
monkey(Number, String).patch;

console.log((1).isEven()); // false
console.log('HelloWorld'.snakecase()); // hello_world
console.log([1, 2, 3].reject(v => v < 2)); // Uncaught TypeError: [1,2,3].reject is not a function ...
```

Instead of the constructor you can also pass in something that represents it:

```js
monkey(1, 'foo', []).patch;
// or
monkey(typeof 1, new String(), 'array').patch;
```

But be careful, arrays containing items will be flattened instead

```js
monkey([Number, [String]]).patch;

console.log((1).isEven()); // false
console.log('HelloWorld'.snakecase()); // hello_world
console.log([1, 2, 3].reject(v => v < 2)); // Uncaught TypeError: [1,2,3].reject is not a function ...
```

## Monkey patches

### Number

#### isEven()

Determines whether the calling number is even

```js
console.log((1).isEven()); // false
```

#### isOdd()

Determines whether the calling number is odd

```js
console.log((1).isOdd()); // true
```

### String

#### inquiry()

Converts the calling string into an inquirer making equality checks prettier.

```js
const str = 'foo';
console.log(str.inquiry().foo); // true
console.log(str.inquiry().bar); // false
```

It also supports camel, pascal and snake case.

```js
const str = 'hello world';
console.log(str.inquiry().HelloWorld); // true
console.log(str.inquiry().helloWorld); // true
console.log(str.inquiry().hello_world); // true
```

#### camelcase()

Converts the calling string into camel case

```js
console.log('HelloWorld'.camelcase()); // hello-world
console.log('hello_world'.camelcase()); // hello-world
console.log('hello-world'.camelcase()); // hello-world
console.log('hello.world'.camelcase()); // hello-world
```

#### kebabcase()

Converts the calling string into kebab case

```js
console.log('HelloWorld'.kebabcase()); // hello-world
console.log('helloWorld'.kebabcase()); // hello-world
console.log('hello_world'.kebabcase()); // hello-world
console.log('hello.world'.kebabcase()); // hello-world
```

#### pascalcase()

Converts the calling string into pascal case

```js
console.log('helloWorld'.kebabcase()); // hello-world
console.log('hello_world'.kebabcase()); // hello-world
console.log('hello-world'.camelcase()); // hello-world
console.log('hello.world'.kebabcase()); // hello-world
```

#### snakecase()

Converts the calling string into snake case

```js
console.log('HelloWorld'.kebabcase()); // hello-world
console.log('helloWorld'.kebabcase()); // hello-world
console.log('hello-world'.camelcase()); // hello-world
console.log('hello.world'.kebabcase()); // hello-world
```

### Array

#### each()

**Alias** for `Array.prototype.forEach`

#### select()

**Alias** for `Array.prototype.map`

#### reject()

The opposite of `Array.prototype.filter`

```js
console.log([1, 2, 3].reject(v => v < 2)); // [2, 3]
```

## Limitations

Due to the limitations of [ES6 proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) `safeguard` and `fuzzy` will not work with primitive types like `Number` or `String`:

```js
const num = fuzzy(1);
console.log(num.toExponential()); // 1e+0
console.log(num.toExpoventiak()); // Uncaught TypeError: num.toExpoventiak is not a function ...

const str = safeguard('A');
console.log(str.toLowerCase()); // a
console.log(str.tuLowerVase()); // Uncaught TypeError: str.tuLowerVase is not a function ...
```

## License

[MIT](https://github.com/joshuajaco/metafoo/blob/master/LICENSE)
