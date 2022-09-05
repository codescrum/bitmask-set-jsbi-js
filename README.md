# Bitmask Set

*Convert arrays to bitmask representations to quickly operate with them through bitwise operations.*

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
npm install @codescrum/bitmask-set-jsbi
```

```javascript
import { BitmaskSet, Bitmask } from "@codescrum/bitmask-set-jsbi"

// Given an array that you want to operate on
let myArray = [1,2,3,4,5,6,7,8,9]

// We first define the `BitmaskSet` which we will work with.
let set = new BitmaskSet(myArray)

// Then we define some bitmasks, representing different sets of elements
// you pass either their elements, or a strings of 1's and 0's

let a = set.bitmask([1,3,5,7,9]) // let a = set.bitmask("101010101")
let b = set.bitmask([2,4,6,8])   // let b = set.bitmask("010101010")
let c = set.bitmask([1,3,5])     // let c = set.bitmask("101010000")
let d = set.bitmask([6,8])       // let d = set.bitmask("000001010")
let e = set.bitmask([1,2,3,4,5]) // let e = set.bitmask("111110000")
let f = set.bitmask([6,7,8,9])   // let e = set.bitmask("000001111")
let g = set.bitmask([1,9])       // let g = set.bitmask("100000001")

// For ease of visualization we defined the elements in order when
// creating the bitmasks, but you can pass the elements in any order, even
// if they include duplicates when creating the bitmasks.
//
// Note that you must use the `BitmaskSet` instance to create the
// bitmasks based on it, or alternatively instantiate them as:
let bitmask = new Bitmask(set, [1,2,3]) // same as set.bitmask([1,3,5])

// Print a bitmask's string representation
console.log("bitmask: " + bitmask) // bitmask: 111000000

//// All the following methods return bitmasks

// These methods are the most basic ones and can only take other
// bitmasks as arguments

a.and(b)              // 000000000 bitwise and
a.or(b)               // 111111111 bitwise or
a.xor(e)              // 010100101 bitwise xor
a.invert()            // 010101010 (like bitwise not)

// These methods can take both bitmasks and elements as arguments
// Also, they always return a new bitmask (they don't mutate the bitmask
// you call them on.
//
// Note that some are just the same with different names for
// semantics convenience (expressiveness)

a.add([1,2,3,4,5])    // 111110101 you can add an array of elements
a.add(e)              // 111110101 you can add elements from another bitmask too
a.union(e)            // 000000101 same as add (added for convenience)
a.include(e)          // 111110101 same as add (added for convenience)
a.remove([1,2,3,4,5]) // 000000101 you can remove an array of elements
a.remove(e)           // 000000101 you can remove elements from another bitmask too
a.exclude(e)          // 000000101 same as remove (added for convenience)
a.distinct(e)         // 000000101 same as xor (added for convenience)
a.unlike(e)           // 000000101 same as xor (added for convenience)
a.different(e)        // 000000101 same as xor (added for convenience)
a.intersection(e)     // 101010000 return elements in common
a.intersect(e)        // 101010000 same as intersection (added for convenience)

a.is_in(b)            // true  - checks if all elements of a are in b.
a.is_not_in(b)        // false - a.is_not_in(b) == !a.is_in(b)
a.is_full()           // false - checks if all elements are present (i.e. "111111111")
a.is_empty()          // false - checks if no elements are present (i.e. "000000000")
a.is_zero()           // false - same as is_empty (i.e. "000000000")

// All bitmask methods are `lazy` in the sense they don't compute any
// elements while you perform operations on them.
// As long as you are in "bitmask space" you manipulate everything through
// bitwise operations.
// Once you are ready to get your final items, just call `elements()`

a.invert().elements() // [2,4,6,8] (note: this result will be memoized)

//// Some more examples

// Compare to string representation
console.log("a == '101010101': ", (a == '101010101'))       // true

// Equality between bitmasks
console.log("a.invert().equals(b): ", a.invert().equals(b)) // true

console.log(`${a}.is_in(${b}): `, a.is_in(b)) // false
console.log(`${a}.is_in(${c}): `, a.is_in(c)) // false
console.log(`${c}.is_in(${a}): `, c.is_in(a)) // true
console.log(`${d}.is_in(${f}): `, d.is_in(f)) // true
console.log(`${g}.is_in(${a}): `, g.is_in(a)) // true
console.log(`${g}.is_in(${b}): `, g.is_in(b)) // false

// Note that you can chain methods since they keep returning
// bitmasks, so a given selection of elements can be expressed
// as follows:

let result = a             // Take all elements from `a`
              .distinct(b) // mutually excluding those from `b`
              .and(e)      // that are also in `e`
              .add(f)      // then add the ones in `f`
              .remove(g)   // then remove those in `g`
              .invert()    // invert the current selection
              
console.log("result: " + result)   // result: 100000001

// After manipulations, compute final resulting elements.
// Elements get computed when you first call `elements()`
// in your resulting bitmask:
console.debug(result.elements()) // [ 1, 9 ]
```

A few things to keep in mind:

- The array of elements you pass in to create the `BitmaskSet` is assumed to be of unique values (no duplicates). This _may_ not be an issue, since the internal presentation will remove duplicate elements anyway.
- The order of the elements you pass in to create the BitmaskSet or the bitmasks
  is really not important. But the internal operations do rely on this order being preserved.
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

## Contributors

Miguel Diaz (@gato-omega)[https://github.com/gato-omega]