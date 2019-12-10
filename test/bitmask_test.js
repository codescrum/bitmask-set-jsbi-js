var assert = require('assert');
var JSBI = require('jsbi')
const { BitmaskField, Bitmask } = require('../lib/index')

describe('Bitmask', function() {

  describe('#constructor', function() {
    it('throws an error if constructed without a field', function() {
      assert.throws(function(){ new Bitmask() },              Error, 'You need to specify a field for the bitmask to make sense.');
      assert.throws(function(){ new Bitmask(undefined) },     Error, 'You need to specify a field for the bitmask to make sense.');
      assert.throws(function(){ new Bitmask(null) },          Error, 'You need to specify a field for the bitmask to make sense.');
    });

    it('throws an error if constructed with a field but no elements specified', function() {
      let bitmask_field = new BitmaskField([1,2,3,4])
      assert.throws(function(){ new Bitmask(bitmask_field) }, Error, 'You must pass an array of elements to the bitmask.');
    });
  });

  describe('With valid fields', function() {

    var small_random_field;
    var small_ordered_field;

    before(function(done){
        small_random_field =  new BitmaskField([0,8,1,9,3,2,4,6,7,5])
        small_ordered_field = new BitmaskField([0,1,2,3,4,5,6,7,8,9])
        done();
    });

    //////////////////////////////////////////////////////////////////////////////
    // Querying
    //////////////////////////////////////////////////////////////////////////////
    describe('Querying', function() {

      it('#indexOf', function() {
        let random_bitmask = small_random_field.bitmask(_.shuffle([9,2,4,6,5])) // Test shuffling it
        let ordered_bitmask = small_ordered_field.bitmask(_.shuffle([9,2,4,6,5])) // Test shuffling it

        // String should follow the field order
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

      it('creates the bitmask string based on the field and elements', function() {
        let bitmask = small_random_field.bitmask(_.shuffle([9,2,4,6,5])) // Test shuffling it

        // String should follow the field order
        assert.equal(bitmask.toString(), "0001011101")
        assert(JSBI.equal(bitmask.toBigInt(), JSBI.BigInt(93)))
        assert(JSBI.equal(bitmask.bits, JSBI.BigInt(93)))
      });

      it('creates the bitmask string based on the field and elements (sorted)', function() {
        let bitmask = small_ordered_field.bitmask(_.shuffle([1,2,3,4,5])) // Test shuffling it

        // String should follow the field order
        assert.equal(bitmask.toString(), "0111110000")
        assert(JSBI.equal(bitmask.toBigInt(), JSBI.BigInt(496)))
        assert(JSBI.equal(bitmask.bits, JSBI.BigInt(496)))
      });

      it('creates the bitmask representations when constructed from bits/bigint, elements not present, until computed', function() {
        let bitmask = small_ordered_field.bitmask(JSBI.BigInt(496)) // Test shuffling it

        // String should follow the field order
        assert.equal(bitmask.toString(), "0111110000")
        assert(JSBI.equal(bitmask.toBigInt(), JSBI.BigInt(496)))
        assert(JSBI.equal(bitmask.bits, JSBI.BigInt(496)))
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
        let bitmask_a = small_ordered_field.bitmask([2,4,5,6,9])
        let bitmask_b = small_ordered_field.bitmask([1,2,3,4,5])

        let bitmask = bitmask_a.and(bitmask_b)

        assert(JSBI.equal(bitmask.bits, JSBI.BigInt(176)))
        assert.equal(bitmask.toString(), "0010110000")
      });

      it('succesfully operates with `or`', function() {
        let bitmask_a = small_ordered_field.bitmask([2,4,5,6,9])
        let bitmask_b = small_ordered_field.bitmask([1,2,3,4,5])

        let bitmask = bitmask_a.or(bitmask_b)

        assert(JSBI.equal(bitmask.bits, JSBI.BigInt(505)))
        assert.equal(bitmask.toString(), "0111111001")
      });

      it('succesfully operates with `xor`', function() {
        let bitmask_a = small_ordered_field.bitmask([2,4,5,6,9])
        let bitmask_b = small_ordered_field.bitmask([1,2,3,4,5])

        let bitmask = bitmask_a.xor(bitmask_b)

        assert(JSBI.equal(bitmask.bits, JSBI.BigInt(329)))
        assert.equal(bitmask.toString(), "0101001001")
      });

      it('succesfully inverts the bitmask', function() {
        let normal_bitmask = small_ordered_field.bitmask([2,4,5,6,9])
        let bitmask = normal_bitmask.invert()

        assert.equal(normal_bitmask.toString(),   "0010111001")
        assert.equal(bitmask.toString(), "1101000110")
        assert(JSBI.equal(bitmask.bits, JSBI.BigInt(838)))
      });

    });

  });
});
