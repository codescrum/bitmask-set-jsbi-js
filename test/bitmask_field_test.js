import assert from 'assert';
import { BitmaskField, Bitmask } from '../index.js';

describe('BitmaskField', function() {
  describe('#constructor', function() {
    describe('with invalid arguments', function(){
      it('throws an error if constructed with `undefined`', function() {
        assert.throws(function(){ new BitmaskField() }, Error, 'The field defined by all elements must be an array!');
        assert.throws(function(){ new BitmaskField(undefined) }, Error, 'The field defined by all elements must be an array!');
      });
      it('throws an error if constructed with `null`', function() {
        assert.throws(function(){ new BitmaskField(null) }, Error, 'The field defined by all elements must be an array!');
      });
      it('throws an error if constructed with an empty array `[]`', function() {
        assert.throws(function(){ new BitmaskField([]) }, Error, 'The field defined by all elements cannot be empty!');
      });
    });

    describe('with valid arguments', function(){
      it('correctly populates elements, size, ones, zeros, options', function() {
        let bitmask_field = new BitmaskField([1,2,3,4], {sort: true})
        assert(bitmask_field.elements.every(function(element){ return [1,2,3,4].includes(element)}))
        assert.equal(bitmask_field.options['sort'], true)
        assert.equal(bitmask_field.size, 4)
        assert.equal(bitmask_field.ones,  "1111")
        assert.equal(bitmask_field.zeros, "0000")
      });
      it('correctly populates elements, size, ones, zeros, and default options', function() {
        let bitmask_field = new BitmaskField([1,2,3,4])
        assert(bitmask_field.elements.every(function(element){ return [1,2,3,4].includes(element)}))
        assert.equal(bitmask_field.options['sort'], false)
        assert.equal(bitmask_field.size, 4)
        assert.equal(bitmask_field.ones,  "1111")
        assert.equal(bitmask_field.zeros, "0000")
      });
    });
  });

  describe('with valid fields', function() {

    var small_random_field;
    var small_ordered_field;
    var small_sorted_field;

    before(function(done){
        small_random_field =  new BitmaskField([0,8,1,9,3,2,4,6,7,5])
        small_ordered_field = new BitmaskField([0,1,2,3,4,5,6,7,8,9])
        small_sorted_field = new BitmaskField([0,7,4,6,3,1,2,8,8,5], {'sort': true})
        done();
    });

    //////////////////////////////////////////////////////////////////////////////
    // Querying
    //////////////////////////////////////////////////////////////////////////////
    describe('Querying', function() {

      it('#indexOf', function() {

        // String should follow the field order
        assert.equal(small_random_field.indexOf(8), 1)
        assert.equal(small_random_field.indexOf(5), 9)

        assert.equal(small_ordered_field.indexOf(4), 4)
        assert.equal(small_ordered_field.indexOf(8), 8)
      });
    });
  });

  // The rest of the methods are tested on `bitmask_test.js`
  describe('#bitmask', function() {
    it('creates a new bitmask, whose field is `this`', function() {
      let bitmask_field = new BitmaskField([1,2,3,4])
      let bitmask = bitmask_field.bitmask([1,2])
      assert(bitmask instanceof Bitmask)
      assert(bitmask.field instanceof BitmaskField)
      assert.equal(bitmask.field, bitmask_field)
    });
  });

  describe('#indexOf', function() {
    it('returns the index of the element in the field', function() {
      let bitmask_field = new BitmaskField([1,2,3])
      assert.equal(bitmask_field.indexOf(1), 0)
      assert.equal(bitmask_field.indexOf(2), 1)
      assert.equal(bitmask_field.indexOf(3), 2)
    });
  });

});
