import assert from 'assert'
import { BitmaskSet, Bitmask } from '../index.js'

describe('BitmaskSet', function () {
  describe('#constructor', function () {
    describe('with invalid arguments', function () {
      it('throws an error if constructed with `undefined`', function () {
        assert.throws(function () { new BitmaskSet() }, Error, 'The set defined by all elements must be an array!')
        assert.throws(function () { new BitmaskSet(undefined) }, Error, 'The set defined by all elements must be an array!')
      })
      it('throws an error if constructed with `null`', function () {
        assert.throws(function () { new BitmaskSet(null) }, Error, 'The set defined by all elements must be an array!')
      })
      it('throws an error if constructed with an empty array `[]`', function () {
        assert.throws(function () { new BitmaskSet([]) }, Error, 'The set defined by all elements cannot be empty!')
      })
    })

    describe('with valid arguments', function () {
      it('correctly populates elements, size, ones, zeros, options', function () {
        const bitmask_set = new BitmaskSet([1, 2, 3, 4], { sort: true })
        assert(bitmask_set.elements.every(function (element) { return [1, 2, 3, 4].includes(element) }))
        assert.equal(bitmask_set.options.sort, true)
        assert.equal(bitmask_set.size, 4)
        assert.equal(bitmask_set.ones, '1111')
        assert.equal(bitmask_set.zeros, '0000')
      })
      it('correctly populates elements, size, ones, zeros, and default options', function () {
        const bitmask_set = new BitmaskSet([1, 2, 3, 4])
        assert(bitmask_set.elements.every(function (element) { return [1, 2, 3, 4].includes(element) }))
        assert.equal(bitmask_set.options.sort, false)
        assert.equal(bitmask_set.size, 4)
        assert.equal(bitmask_set.ones, '1111')
        assert.equal(bitmask_set.zeros, '0000')
      })
    })
  })

  describe('with valid sets', function () {
    let small_random_set
    let small_ordered_set
    let small_sorted_set

    before(function (done) {
      small_random_set = new BitmaskSet([0, 8, 1, 9, 3, 2, 4, 6, 7, 5])
      small_ordered_set = new BitmaskSet([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      small_sorted_set = new BitmaskSet([0, 7, 4, 6, 3, 1, 2, 8, 8, 5], { sort: true })
      done()
    })

    /// ///////////////////////////////////////////////////////////////////////////
    // Querying
    /// ///////////////////////////////////////////////////////////////////////////
    describe('Querying', function () {
      it('#indexOf', function () {
        // String should follow the set order
        assert.equal(small_random_set.indexOf(8), 1)
        assert.equal(small_random_set.indexOf(5), 9)

        assert.equal(small_ordered_set.indexOf(4), 4)
        assert.equal(small_ordered_set.indexOf(8), 8)
      })
    })
  })

  // The rest of the methods are tested on `bitmask_test.js`
  describe('#bitmask', function () {
    it('creates a new bitmask, whose set is `this`', function () {
      const bitmask_set = new BitmaskSet([1, 2, 3, 4])
      const bitmask = bitmask_set.bitmask([1, 2])
      assert(bitmask instanceof Bitmask)
      assert(bitmask.set instanceof BitmaskSet)
      assert.equal(bitmask.set, bitmask_set)
    })
  })

  describe('#indexOf', function () {
    it('returns the index of the element in the set', function () {
      const bitmask_set = new BitmaskSet([1, 2, 3])
      assert.equal(bitmask_set.indexOf(1), 0)
      assert.equal(bitmask_set.indexOf(2), 1)
      assert.equal(bitmask_set.indexOf(3), 2)
    })
  })
})
