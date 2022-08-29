'use strict';
import assert from 'assert';
import _  from 'lodash';
import JSBI from 'jsbi';
import { BitmaskField, Bitmask } from '../index.js';

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

    describe('with a valid field but invalid arguments', function() {

      var test_field;

      before(function(done){
          test_field = new BitmaskField([0,1,2,3,4,5,6,7,8,9]);
          done();
      });


      it('throws an error if undefined elements', function() {
        assert.throws(function(){ new Bitmask(test_field, undefined) }, Error, 'You must pass an array of elements to the bitmask.');
      });

      it('throws an error if constructed with more bits than what the field size can manage', function() {
        assert.throws(function(){ new Bitmask(test_field, JSBI.BigInt(1023 + 10)) }, Error, "You are passing more bits than the field's size.");
      });

      it("throws an error if constructed with a string which is larger than the field's size", function() {
        assert.throws(function(){ new Bitmask(test_field, "0101110111" + "1") }, Error, "The string to build the bitmask from does not match the field's size.");
      });

      it("throws an error if constructed with a string which is smaller than the field's size", function() {
        assert.throws(function(){ new Bitmask(test_field, "010111") }, Error, "The string to build the bitmask from does not match the field's size (string is larger in length).");
      });

      it("throws an error if constructed with a string which is empty", function() {
        assert.throws(function(){ new Bitmask(test_field, "") }, Error, "The string to build the bitmask from does not match the field's size (string is smaller in length).");
      });

      it("throws an error if constructed with a string which contains characters other than 0's or 1's", function() {
        assert.throws(function(){ new Bitmask(test_field, "0101A10B11") }, Error, "The string to build the bitmask from must only contain 0's or 1's.");
      });
    });

  });

  describe('With valid fields', function() {

    var small_random_field;
    var small_ordered_field;

    before(function(done){
        small_random_field =  new BitmaskField([0,8,1,9,3,2,4,6,7,5]);
        small_ordered_field = new BitmaskField([0,1,2,3,4,5,6,7,8,9]);
        done();
    });

    it('created when a valid string is passed', function() {
      let bitmask = small_ordered_field.bitmask("0101101001");
      assert.equal(bitmask.toString(), "0101101001");
      assert(JSBI.equal(bitmask.bits, JSBI.BigInt(361)))
      assert.equal(bitmask.elements, undefined); // Elements not computed yet is ok

      // Now, compute the elements ("applies" the changes)
      bitmask.compute_elements()
      assert(_.difference(bitmask.elements, [1,3,4,6,9]).length == 0)
    });

    //////////////////////////////////////////////////////////////////////////////
    // Querying
    //////////////////////////////////////////////////////////////////////////////
    describe('Querying', function() {

      it('#indexOf', function() {
        let random_bitmask = small_random_field.bitmask(_.shuffle([9,2,4,6,5])); // Test shuffling it
        let ordered_bitmask = small_ordered_field.bitmask(_.shuffle([9,2,4,6,5])); // Test shuffling it

        // String should follow the field order
        assert.equal(random_bitmask.indexOf(8), 1);
        assert.equal(random_bitmask.indexOf(5), 9);

        assert.equal(ordered_bitmask.indexOf(3), 3);
        assert.equal(ordered_bitmask.indexOf(6), 6);
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

        // Now, compute the elements
        bitmask.compute_elements()
        assert(_.difference(bitmask.elements, [1,2,3,4,5]).length == 0)
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

        assert.equal(normal_bitmask.toString(), "0010111001")
        assert.equal(bitmask.toString(),        "1101000110")
        assert(JSBI.equal(bitmask.bits, JSBI.BigInt(838)))
      });

      it('succesfully checks for inclusion (#in) of a bitmask inside another', function() {
        let bitmask              = small_ordered_field.bitmask("0101000101")
        let included_bitmask     = small_ordered_field.bitmask("0101000100")
        let non_included_bitmask = small_ordered_field.bitmask("1101000000")

        assert(included_bitmask.in(bitmask));
        assert(!non_included_bitmask.in(bitmask));
        // assert.equal(normal_bitmask.toString(),   "0010111001")
        // assert.equal(bitmask.toString(), "1101000110")
        // assert(JSBI.equal(bitmask.bits, JSBI.BigInt(838)))
      });

      it("succesfully checks for inclusion (#in) of a bitmask inside another (edge cases - all 1's)", function() {
        let all  = small_ordered_field.bitmask("1111111111")
        let some = small_ordered_field.bitmask("0101010101")
        let none = small_ordered_field.bitmask("0000000000")

        assert(all.in(all)); // Everything IS included in everything
        assert(some.in(all));
        assert(none.in(all));
      });

      it("succesfully checks for inclusion (#in) of a bitmask inside another (edge cases - all 0's)", function() {
        let all  = small_ordered_field.bitmask("1111111111")
        let some = small_ordered_field.bitmask("0101010101")
        let none = small_ordered_field.bitmask("0000000000")

        assert(!all.in(none));
        assert(!some.in(none));
        assert(none.in(none)); // Nothing IS included in nothing
      });

      it('succesfully checks for the non-inclusion (#not_in) of a bitmask inside another', function() {
        let bitmask              = small_ordered_field.bitmask("1111100000")
        let included_bitmask     = small_ordered_field.bitmask("0101100000")
        let non_included_bitmask = small_ordered_field.bitmask("0000011111")

        assert(non_included_bitmask.not_in(bitmask));
        assert(!included_bitmask.not_in(bitmask));
        // assert.equal(normal_bitmask.toString(),   "0010111001")
        // assert.equal(bitmask.toString(), "1101000110")
        // assert(JSBI.equal(bitmask.bits, JSBI.BigInt(838)))
      });

      it("succesfully for the non-inclusion (#not_in) of a bitmask inside another (edge cases - all 1's)", function() {
        let all  = small_ordered_field.bitmask("1111111111")
        let some = small_ordered_field.bitmask("0101010101")
        let none = small_ordered_field.bitmask("0000000000")

        assert(!some.not_in(all));
        assert(!none.not_in(all));
      });

      it("succesfully for the non-inclusion (#not_in) of a bitmask inside another (edge cases - all 0's)", function() {
        let all  = small_ordered_field.bitmask("1111111111")
        let some = small_ordered_field.bitmask("0101010101")
        let none = small_ordered_field.bitmask("0000000000")

        assert(all.not_in(none));
        assert(some.not_in(none));
        assert(!none.not_in(none)); // The empty set is contained in itself.
      });

      it("succesfully adds elements", function() {
        let bitmask = small_ordered_field.bitmask("0011000100")
        let result = bitmask.add([0,2,9]);

        assert.equal(result.toString(), "1011000101")
        assert.equal(result.elements, undefined)

        // Now, compute the elements
        result.compute_elements()
        assert(_.difference(result.elements, [0,2,3,7,9]).length == 0)
      });

      it("succesfully removes elements", function() {
        let bitmask = small_ordered_field.bitmask("1011000101")
        let result = bitmask.remove([0,2,9]);

        assert.equal(result.toString(), "0001000100")
        assert.equal(result.elements, undefined)

        // Now, compute the elements
        result.compute_elements()
        // debugger;
        assert(_.difference(result.elements, [3,7]).length == 0)
      });

    });

  });
});
