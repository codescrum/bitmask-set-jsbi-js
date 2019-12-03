var assert = require('assert');
const { BitmaskSpace, Bitmask } = require('../lib/index')

describe('Bitmask', function() {

  describe('#constructor', function() {
    it('throws an error if constructed without a space', function() {
      assert.throws(function(){ new Bitmask() },              Error, 'You need to specify a space for the bitmap to make sense.');
      assert.throws(function(){ new Bitmask(undefined) },     Error, 'You need to specify a space for the bitmap to make sense.');
      assert.throws(function(){ new Bitmask(null) },          Error, 'You need to specify a space for the bitmap to make sense.');
    });

    it('throws an error if constructed with a space but no elements specified', function() {
      let bitmask_space = new BitmaskSpace([1,2,3,4])
      assert.throws(function(){ new Bitmask(bitmask_space) }, Error, 'You must pass an array of elements to the bitmask.');
    });
  });

  describe('#elements_to_bitmask_string', function() {
    it('creates the bitmask string based on the space and elements', function() {
      let bitmask_space = new BitmaskSpace([1,2,3,4,5,6,7,8])
      let bitmask = bitmask_space.bitmask([2,4,5,6,8])
      bitmask.toString()

    });
  });

});
