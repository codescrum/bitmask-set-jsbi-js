# Bitmask Set

*Convert fixed-size unique-element arrays to bitmask representations to quickly operate with them through bitwise operations.*

In general, this approach can be applied to whenever you want to:

1. Quickly retrieve the intersection betwen two (or more) arrays of elements.
2. Quickly add/remove elements of other arrays to/from a particular array.

*Note:* The approach implemented here might work best if you need to operate
with many arrays/sets instead of just a couple.

*Important:* This package depends on the JSBI — pure-JavaScript BigInts library for compatibility.

See https://github.com/GoogleChromeLabs/jsbi, https://www.npmjs.com/package/jsbi
and https://v8.dev/features/bigint for information on this.

You can check the state of BigInt adoption here: https://caniuse.com/?search=bigint.

## Usage

```bash
npm install @codescrum/bitmask-set
```

```javascript
import { BitmaskSet, Bitmask } from "@codescrum/bitmask-set"

// First, we define the set of elements which we will work with.

let set = new BitmaskSet([1,2,3,4,5,6,7,8,9])

// Then we define the bitmasks
// Either by their elements, or, as strings of 1's and 0's)

let a = set.bitmask([1,3,5,7,9]) // let a = set.bitmask("101010101")
let b = set.bitmask([2,4,6,8])   // let b = set.bitmask("010101010")
let c = set.bitmask([1,3,5])     // let c = set.bitmask("101010000")
let d = set.bitmask([6,8])       // let d = set.bitmask("000001010")
let e = set.bitmask([1,2,3,4,5]) // let e = set.bitmask("111110000")
let f = set.bitmask([6,7,8,9])   // let e = set.bitmask("000001111")
let g = set.bitmask([1,9])       // let g = set.bitmask("100000001")

// For ease of visualization we defined the elements in order when
// creating the bitmasks, but you can pass the elements in any order.

// Print their string representations
console.log("a: " + a) // 101010101
console.log("b: " + b) // 010101010
console.log("c: " + c) // 101010000
console.log("d: " + d) // 000001010
console.log("e: " + e) // 111110000
console.log("f: " + f) // 000001111
console.log("g: " + g) // 100000001

// Some examples
console.log("a == '101010101': ", (a == '101010101'))       // true
console.log("a.invert().equals(b): ", a.invert().equals(b)) // true

console.log(`${a}.is_in(${b}): `, a.is_in(b)) // false
console.log(`${a}.is_in(${c}): `, a.is_in(c)) // false
console.log(`${c}.is_in(${a}): `, c.is_in(a)) // true
console.log(`${d}.is_in(${f}): `, d.is_in(f)) // true
console.log(`${g}.is_in(${a}): `, g.is_in(a)) // true
console.log(`${g}.is_in(${b}): `, g.is_in(b)) // false

console.log("a.and(b): " + a.and(b))    // 000000000
console.log("a.or(b): " + a.or(b))      // 111111111
console.log("a.xor(e): " + a.xor(e))    // 010100101

// Then, a given selection of items can be expressed as follows:

let result = a             // Take all elements from `a`
              .distinct(b) // mutually excluding those from `b`
              .and(e)      // that are also in `e`
              .add(f)      // then add the ones in `f`
              .remove(g)   // then remove those in `g`
              .invert()    // invert the current selection
              
console.log("result: " + result) // 100000001

// After manipulations, compute final resulting elements.
// Elements get computed when you first call `elements()`
// in your resulting bitmask:
console.debug(result.elements()) // [ 1, 9 ]
```

A few things to keep in mind:

- The array of elements you pass in must be of unique values (no duplicates).
- The order of the elements you pass in is really not important, however the
  internal operations do rely on this order being preserved.
- The array of elements cannot be empty, you must check this case before
  attempting to create the `BitmaskSet`.

## How does it work? What does it do?

The basic idea is very simple, it does the following:

1. Given an array of unique values, say `[1,2,3,4,5]` we create bitmasks of the
   same lenght as the numbers of elements (such as `10101`) to represent which
   elements are present and which are not. Take these examples:

   - `11111` would represent all 5 elements `[1,2,3,4,5]`
   - `10101` would represent elements `[1,3,5]`
   - `00000` would represent an empty set `[]`

2. These bitmasks are then encoded as BigInt values which we can operate with
   bitwise operations. You use these methods instead of looping and comparing
  in the usual way.

Please note that althogh here we use the word `set` the actual
implementation is based on `arrays` since we need the indexes of elements to
maintain the internal consistency of the associated bitmasks.

## Development / testing

1. Clone repo.
2. ```npm install```
3. ```npm test```

## Debugging

If you want to interactively debug the code/tests you might want to invoke mocha as follows:

Place a `debugger` call anywhere to create a breakpoint for use with the NodeJS built-in debugger.

Then, run:

```
mocha inspect
```

and input `c` to continue to your breakpoint.


Or, alternatively run with the `NODE_INSPECT_RESUME_ON_START=1` flag to continue on to your breakpoint, without pausing at the high-level imports (which is a bit confusing initially).

```
NODE_INSPECT_RESUME_ON_START=1 mocha inspect
```

See [https://mochajs.org/#-inspect-inspect-brk-inspect](https://mochajs.org/#-inspect-inspect-brk-inspect) and [https://nodejs.org/api/debugger.html](https://nodejs.org/api/debugger.html) for more information.


*Note:* If the `mocha` command is not found, you might want to either install globally (npm install -g mocha) or add the specific `<project_root>/node_modules/.bin` to your $PATH.

## Possible upgrades

It may be possible to add the following features to this implementation:

1. Provide reasonable behaviour and API whenever the set's elements is empty on initialization.
2. Be able to extend the `BitmaskSet` with more elements dynamically.
3. Remove JSBI for native BigInt. https://github.com/GoogleChromeLabs/babel-plugin-transform-jsbi-to-bigint. Or perhaps completely use ArrayBuffer.

## Further development

1. Provide benchmarking against some other more "tradditional" approaches.
2. Remove JSBI library.

## Benchmarking

This package was extracted from a particular implementation we had to create
some time ago.

Actual performance for this library hasn't been measured yet, but at the time
this approach was the one to be easier to reason about and worked very well for
our use case, which was finding elements in common with many dozens of
thousand-element arrays quickly in the browser (for UI updates).

The approach implemented here might work best if you need to operate with many
arrays/sets instead of just a few.

Benchmarking this properly may require hundreds of arrays of thousands of
elements before computing the final elements, which is closer to the original
issue we had to solve.

## Alternatives?

Yes!, actually, try these ones first:

1. https://lodash.com/
1. https://github.com/lovasoa/fast_array_intersect
2. https://github.com/YuJianrong/fast-array-diff
3. https://github.com/chouguleds/array-operations
4. https://socket.dev/npm/package/fast-loops
5. https://npmmirror.com/package/nv-array-fast
6. https://www.npmjs.com/package/gonfalon
7. https://www.npmjs.com/package/big-bit-mask
8. https://www.npmjs.com/package/easy-bits
9. https://github.com/namuol/bm

_We didn't tested them all, we just put a reasonble list for your reference._

## License

MIT