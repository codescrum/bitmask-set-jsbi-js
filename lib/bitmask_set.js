'use strict'
import JSBI from 'jsbi'
import { Bitmask } from './bitmask.js'

class BitmaskSet {
  constructor (elements, options = { sort: false }) {
    // Check if elements is effectively an array
    if (!Array.isArray(elements)) { throw Error('The set defined by all elements must be an array!') }
    // Check if elements has at least one element
    if (elements.length === 0) { throw Error('The set defined by all elements cannot be empty!') }

    // Initialize
    if (options.sort === true) {
      this.elements = elements.sort() // Not strictly required, but eases debugging
    } else {
      this.elements = elements
    }

    this.options = options
    this.size = elements.length
    this.ones = '1'.repeat(this.size) // "1111...1111"  used for operations (Strings are immutable in JS)
    this.zeros = '0'.repeat(this.size) // "0000...0000"  used for operations (Strings are immutable in JS)
    this.max = JSBI.BigInt('0b' + this.ones) // Max value
  }

  bitmask (elements) {
    return new Bitmask(this, elements)
  }

  indexOf (element) {
    return this.elements.indexOf(element)
  }

  // The set is composed of all elements (all 1's) by definition
  toString () {
    return this.ones
  }
}
export { BitmaskSet }
