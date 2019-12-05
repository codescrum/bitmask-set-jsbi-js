var assert = require('assert');
const { BitmaskSpace, Bitmask } = require('../lib/index')

describe('BitmaskSpace', function() {
  describe('#constructor', function() {
    describe('with invalid arguments', function(){
      it('throws an error if constructed with `undefined`', function() {
        assert.throws(function(){ new BitmaskSpace() }, Error, 'The space defined by all elements must be an array!');
        assert.throws(function(){ new BitmaskSpace(undefined) }, Error, 'The space defined by all elements must be an array!');
      });
      it('throws an error if constructed with `null`', function() {
        assert.throws(function(){ new BitmaskSpace(null) }, Error, 'The space defined by all elements must be an array!');
      });
      it('throws an error if constructed with an empty array `[]`', function() {
        assert.throws(function(){ new BitmaskSpace([]) }, Error, 'The space defined by all elements cannot be empty!');
      });
    });

    describe('with valid arguments', function(){
      it('correctly populates elements, size, ones, zeros, options', function() {
        let bitmask_space = new BitmaskSpace([1,2,3,4], {sort: true})
        assert(bitmask_space.elements.every(function(element){ return [1,2,3,4].includes(element)}))
        assert.equal(bitmask_space.options['sort'], true)
        assert.equal(bitmask_space.size, 4)
        assert.equal(bitmask_space.ones,  "1111")
        assert.equal(bitmask_space.zeros, "0000")
      });
      it('correctly populates elements, size, ones, zeros, and default options', function() {
        let bitmask_space = new BitmaskSpace([1,2,3,4])
        assert(bitmask_space.elements.every(function(element){ return [1,2,3,4].includes(element)}))
        assert.equal(bitmask_space.options['sort'], false)
        assert.equal(bitmask_space.size, 4)
        assert.equal(bitmask_space.ones,  "1111")
        assert.equal(bitmask_space.zeros, "0000")
      });
    });
  });

  // The rest of the methods are tested on `bitmask_test.js`
  describe('#bitmask', function() {
    it('creates a new bitmask, whose space is `this`', function() {
      let bitmask_space = new BitmaskSpace([1,2,3,4])
      let bitmask = bitmask_space.bitmask([1,2])
      assert(bitmask instanceof Bitmask)
      assert(bitmask.space instanceof BitmaskSpace)
      assert.equal(bitmask.space, bitmask_space)
    });
  });

  // S
  describe('#indexOf', function() {
    it('returns the index of the element in the space', function() {
      let bitmask_space = new BitmaskSpace([1,2,3])
      assert.equal(bitmask_space.indexOf(1), 0)
      assert.equal(bitmask_space.indexOf(2), 1)
      assert.equal(bitmask_space.indexOf(3), 2)
    });
  });

});
