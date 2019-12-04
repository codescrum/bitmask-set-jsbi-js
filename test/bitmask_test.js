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


  //////////////////////////////////////////////////////////////////////////////
  // Representations
  //////////////////////////////////////////////////////////////////////////////
  describe('Representations', function() {

    var small_random_space;
    var small_ordered_space;

    before(function(done){
        let elements = [0,8,1,9,3,2,4,6,7,5]
        small_random_space = new BitmaskSpace(elements)
        small_ordered_space = new BitmaskSpace(elements, {'sort': true})
        done();
    });
    it('creates the bitmask string based on the space and elements', function() {
      let bitmask = small_random_space.bitmask(_.shuffle([9,2,4,6,5])) // Test shuffling it

      // String should follow the space order
      assert.equal(bitmask.toString(), "0010111001")
      assert.equal(bitmask.toBigInt(), 185n)
      assert.equal(bitmask.bits, 185n)
    });

    it('creates the bitmask string based on the space and elements (sorted)', function() {
      let bitmask = small_ordered_space.bitmask(_.shuffle([1,2,3,4,5])) // Test shuffling it

      // String should follow the space order
      assert.equal(bitmask.toString(), "0111110000")
      assert.equal(bitmask.toBigInt(), 496n)
      assert.equal(bitmask.bits, 496n)
    });
  });

  //////////////////////////////////////////////////////////////////////////////
  // Operations
  //////////////////////////////////////////////////////////////////////////////

  describe('Operations', function() {

    var small_random_space;
    var small_ordered_space;

    before(function(done){
        let elements = [0,8,1,9,3,2,4,6,7,5]
        small_random_space = new BitmaskSpace(elements)
        small_ordered_space = new BitmaskSpace(elements, {'sort': true})
        done();
    });
    it('succesfully operates with `and`', function() {
      let bitmask_a = small_ordered_space.bitmask([2,4])
      let bitmask_b = small_ordered_space.bitmask([1,2,3,4,5])



      // String should follow the space order
      assert.equal(bitmask.toString(), "0010111001")
      assert.equal(bitmask.toBigInt(), 185n)
      assert.equal(bitmask.bits, 185n)
    });

    it('creates the bitmask string based on the space and elements', function() {
      let bitmask = small_ordered_space.bitmask(_.shuffle([1,2,3,4,5])) // Test shuffling it

      // String should follow the space order
      assert.equal(bitmask.toString(), "0111110000")
      assert.equal(bitmask.toBigInt(), 496n)
      assert.equal(bitmask.bits, 496n)
    });
  });

});
