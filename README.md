# Bitmask Field

Bitmask Field allows you to define a closed field of bitmasks, all of which represent
the selection of elements across an array of defined elements.

By manipulating the bitmasks you can quickly optimize typical multiple-selection
operations which would otherwise require many array iterations and accesses to perform.

# Basic operation

Given an existing array of predefined values which we call the `field`, it converts any other array consisting of a subset of such values into a `bitmask` with every bit corresponding to whether
the value is present or not in the `field`.

Once you have one or more arrays represented in this way, you can operate with the bitmasks to perform
quick comparisons of whether sets of elements match or not (using bitwise AND/OR/XOR, etc.).

Please see `test/bitmask_test,js` for example usage.

# Development / testing

1. Clone repo.
2. ```npm install```
3. ```npm test``

# Debugging

If you want to interactively debug the code/tests you might want to invoke mocha as follows:

Place a `debugger;` call anywhere to create a breakpoint for use with the NodeJS built-in debugger.

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

# Other, perhaps similar libraries

1. https://www.npmjs.com/package/bm
2. https://www.npmjs.com/package/gonfalon
3. https://www.npmjs.com/package/big-bit-mask
4. https://www.npmjs.com/package/easy-bits