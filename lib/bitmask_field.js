'use strict'
var _ = require('lodash');
var JSBI = require('jsbi');
const { Bitmask } = require('./bitmask')

class BitmaskField {
  constructor(elements, options = {}) {
    options = _.defaults(options, {'sort': false});

    // Check if elements is effectively an array
    if(!Array.isArray(elements)){ throw Error('The field defined by all elements must be an array!') }
    // Check if elements is actually a value
    if(elements.length === 0){ throw Error("The field defined by all elements cannot be empty!") }

    // Initialize
    if(options['sort'] == true){
      this.elements = elements.sort() // Not strictly required, but eases debugging
    }else {
      this.elements = elements
    }

    this.options = options
    this.size    = elements.length
    this.ones    = "1".repeat(this.size)         // "1111...1111"  used for operations (Strings are immutable in JS)
    this.zeros   = "0".repeat(this.size)         // "0000...0000"  used for operations (Strings are immutable in JS)
    this.max     = JSBI.BigInt("0b" + this.ones) // Max value
  }

  bitmask(elements){
    return new Bitmask(this, elements)
  }

  indexOf(element){
    return this.elements.indexOf(element)
  }

  // The field is composed of all 1's by definition
  toString(){
    return this.ones;
  }

  // returns true if the arrays contain the same elements
  // they must have the same length of course
  compareArrays(a,b){
    if(a.length !== b.length){ return false } // quick stop
    var lookup = {};

    // O(N+M) ; size(a) = N ; size(b) = M.
    for (var i in a) {
        lookup[a[i]] = a[i];
    }
    for (var j in b) {
      if (typeof lookup[b[i]] == 'undefined') {
          return false; // return false on the first mismatch
      }
    }
    return true; // If it reaches this point all elements of `a` are in `b`
  }

}

// Using direct object
module.exports = {
  BitmaskField: BitmaskField
}
