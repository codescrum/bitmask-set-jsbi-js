var assert = require('assert');
const { BitmaskSpace, Bitmask } = require('../lib/index')

describe('Bitmask', function() {

  describe('#constructor', function() {
    it('throws an error if constructed without a space', function() {
      assert.throws(function(){ new Bitmask() },              Error, 'You need to specify a space for the bitmask to make sense.');
      assert.throws(function(){ new Bitmask(undefined) },     Error, 'You need to specify a space for the bitmask to make sense.');
      assert.throws(function(){ new Bitmask(null) },          Error, 'You need to specify a space for the bitmask to make sense.');
    });

    it('throws an error if constructed with a space but no elements specified', function() {
      let bitmask_space = new BitmaskSpace([1,2,3,4])
      assert.throws(function(){ new Bitmask(bitmask_space) }, Error, 'You must pass an array of elements to the bitmask.');
    });
  });

  describe('With valid spaces', function() {

    var small_random_space;
    var small_ordered_space;

    before(function(done){
        small_random_space =  new BitmaskSpace([0,8,1,9,3,2,4,6,7,5])
        small_ordered_space = new BitmaskSpace([0,1,2,3,4,5,6,7,8,9])
        done();
    });

    //////////////////////////////////////////////////////////////////////////////
    // Querying
    //////////////////////////////////////////////////////////////////////////////
    describe('Querying', function() {

      it('#indexOf', function() {
        let random_bitmask = small_random_space.bitmask(_.shuffle([9,2,4,6,5])) // Test shuffling it
        let ordered_bitmask = small_ordered_space.bitmask(_.shuffle([9,2,4,6,5])) // Test shuffling it

        // String should follow the space order
        assert.equal(random_bitmask.indexOf(8), 1)
        assert.equal(random_bitmask.indexOf(5), 9)

        assert.equal(ordered_bitmask.indexOf(3), 3)
        assert.equal(ordered_bitmask.indexOf(6), 6)
      });
    });
    //////////////////////////////////////////////////////////////////////////////
    // Representations
    //////////////////////////////////////////////////////////////////////////////
    describe('Representations', function() {

      it('creates the bitmask string based on the space and elements', function() {
        let bitmask = small_random_space.bitmask(_.shuffle([9,2,4,6,5])) // Test shuffling it

        // String should follow the space order
        assert.equal(bitmask.toString(), "0001011101")
        assert.equal(bitmask.toBigInt(), 93n)
        assert.equal(bitmask.bits, 93n)
      });

      it('creates the bitmask string based on the space and elements (sorted)', function() {
        let bitmask = small_ordered_space.bitmask(_.shuffle([1,2,3,4,5])) // Test shuffling it

        // String should follow the space order
        assert.equal(bitmask.toString(), "0111110000")
        assert.equal(bitmask.toBigInt(), 496n)
        assert.equal(bitmask.bits, 496n)
      });

      it('creates the bitmask representations when constructed from bits/bigint, elements not present, until computed', function() {
        let bitmask = small_ordered_space.bitmask(496n) // Test shuffling it

        // String should follow the space order
        assert.equal(bitmask.toString(), "0111110000")
        assert.equal(bitmask.toBigInt(), 496n)
        assert.equal(bitmask.bits, 496n)
        assert.equal(bitmask.elements, undefined)
        bitmask.compute_elements()
        assert(bitmask.elements.every(function(element){ return [1,2,3,4,5].includes(element)}))
      });

    });

    //////////////////////////////////////////////////////////////////////////////
    // Operations
    //////////////////////////////////////////////////////////////////////////////
    describe('Operations', function() {

      it('succesfully operates with `and`', function() {
        let bitmask_a = small_ordered_space.bitmask([2,4,5,6,9])
        let bitmask_b = small_ordered_space.bitmask([1,2,3,4,5])

        let bitmask = bitmask_a.and(bitmask_b)

        assert.equal(bitmask.bits, 176n)
        assert.equal(bitmask.toString(), "0010110000")
      });

      it('succesfully operates with `or`', function() {
        let bitmask_a = small_ordered_space.bitmask([2,4,5,6,9])
        let bitmask_b = small_ordered_space.bitmask([1,2,3,4,5])

        let bitmask = bitmask_a.or(bitmask_b)

        assert.equal(bitmask.bits, 505n)
        assert.equal(bitmask.toString(), "0111111001")
      });

      it('succesfully operates with `xor`', function() {
        let bitmask_a = small_ordered_space.bitmask([2,4,5,6,9])
        let bitmask_b = small_ordered_space.bitmask([1,2,3,4,5])

        let bitmask = bitmask_a.xor(bitmask_b)

        assert.equal(bitmask.bits, 329n)
        assert.equal(bitmask.toString(), "0101001001")
      });

      it('succesfully inverts the bitmask', function() {
        let normal_bitmask = small_ordered_space.bitmask([2,4,5,6,9])
        let bitmask = normal_bitmask.invert()

        assert.equal(normal_bitmask.toString(),   "0010111001")
        assert.equal(bitmask.toString(), "1101000110")
        assert.equal(bitmask.bits, 838n)
      });

    });

  });
});
