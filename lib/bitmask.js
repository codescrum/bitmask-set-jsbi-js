'use strict'
import JSBI from 'jsbi'

class Bitmask {
  // We accept either an array of elements or bits
  constructor (set, elements, options = { inherit_sort: true, sort: false }) {
    if (set === undefined || set === null) { throw Error('You need to specify a set for the bitmask to make sense.') }

    /// //// Initialize

    // Associate with set
    this.set = set
    this.size = this.set.size // size must be the same as the BitmaskSet's size

    // Initialize sort
    let sort = options.sort

    // Check constructor arguments
    // Careful here: JSBI instances DO evaluate to being arrays.
    if (Array.isArray(elements) && !(elements instanceof JSBI)) {
      // Regardless of the order of the array, the bitmask will always
      // repect the order of elements as they comes in the BitmaskSet
      // sorting here is only made to ease debugging, if required

      sort = options.inherit_sort ? (set.options.sort || sort) : sort

      if (sort) {
        this._elements = elements.sort()
      } else {
        this._elements = elements
      }

      // Computed representations (elements passed)
      this.string_representation = this.elements_to_bitmask_string(this._elements)
      this.bigint_representation = JSBI.BigInt('0b' + this.string_representation)
      this.bits = this.bigint_representation // For convenience on operations
    } else if (elements instanceof JSBI) {
      const bits = elements // For readability

      if (sort) { console.log('WARNING: Element sorting is not available if you build the bitmask from bits.') }

      const unpadded_string = bits.toString(2)

      if (unpadded_string.length > this.set.size) { throw Error("You are passing more bits than the set's size.") }

      // Computed representations (elements passed)
      this.string_representation = this.padStart(unpadded_string, this.size, '0')
      this.bigint_representation = bits
      this.bits = bits
    } else if (typeof (elements) === 'string') {
      const string = elements // Let's call it string for readability.

      if (string.length === 0) { throw Error('The string to build the bitmask from is empty!') }
      if (string.length < this.set.size) { throw Error("The string to build the bitmask from does not match the set's size (string is smaller in length).") }
      if (string.length > this.set.size) { throw Error("The string to build the bitmask from does not match the set's size (string is larger in length).") }
      if (!string.match('^[01]+$')) { throw Error("The string to build the bitmask from must only contain 0's or 1's.") }

      // Warn about sorting
      if (sort) { console.log('WARNING: Element sorting is not available if you build the bitmask from a string.') }

      // Computed representations (elements passed)
      this.string_representation = string
      this.bigint_representation = JSBI.BigInt('0b' + this.string_representation)
      this.bits = this.bigint_representation // For convenience on operations
    } else {
      throw Error('You must pass an array of elements or bits (BigInt) to create the bitmask.')
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Querying
  //////////////////////////////////////////////////////////////////////////////
  includes (element) {
    const index = this.indexOf(element)
    return this.string_representation[index] === '1'
  }

  indexOf (element) {
    return this.set.indexOf(element)
  }

  //////////////////////////////////////////////////////////////////////////////
  // Representations
  //////////////////////////////////////////////////////////////////////////////

  toString () {
    return this.string_representation
  }

  // Return the actual BigInt object suitable for bitwise operations
  toBigInt () {
    return this.bits
  }

  //////////////////////////////////////////////////////////////////////////////
  // Operations
  //////////////////////////////////////////////////////////////////////////////
  //
  // IMPORTANT: We are assuming that all operations are being done on bitmasks
  //            which belong to the same set!
  //
  //            For performance reasons we are not checking that this is the
  //            case.
  //
  //////////////////////////////////////////////////////////////////////////////

  and (other) {
    return this.set.bitmask(JSBI.bitwiseAnd(this.bits, other.bits))
  }

  or (other) {
    return this.set.bitmask(JSBI.bitwiseOr(this.bits, other.bits))
  }

  xor (other) {
    return this.set.bitmask(JSBI.bitwiseXor(this.bits, other.bits))
  }

  invert () {
    return this.set.bitmask(JSBI.bitwiseXor(this.bits, this.set.max))
  }

  is_in (other) {
    return (JSBI.equal(JSBI.bitwiseAnd(this.bits, other.bits), this.bits))
  }

  is_not_in (other) {
    return !this.is_in(other)
  }

  add (elements) {
    if(Array.isArray(elements)){
      return this.or(this.set.bitmask(elements))
    } else if(elements instanceof Bitmask){
      return this.or(elements)
    }
    else {
      throw Error('Unsupported argument for Bitmask#add()')
    }
  }

  remove (elements) {
    if(Array.isArray(elements)){
      return this.and(this.set.bitmask(elements).invert())
    } else if(elements instanceof Bitmask){
      return this.and(elements.invert())
    }
    else {
      throw Error('Unsupported argument for Bitmask#remove()')
    }
  }

  is_full () {
    return JSBI.equal(this.bits, this.set.max)
  }

  is_empty () {
    return JSBI.equal(this.bits, JSBI.BigInt(0))
  }

  is_zero () {
    return JSBI.equal(this.bits, JSBI.BigInt(0))
  }

  //////////////////////////////////////////////////////////////////////////////
  // Computations
  //////////////////////////////////////////////////////////////////////////////

  compute_elements () {
    
    this._elements = []

    this.string_representation.split('').forEach((bit, index) => {
      if (bit === '1') {
        this._elements.push(this.set.elements[index])
      }
    })

    return this._elements
  }

  // Calling elements() will force the computation of elements if not done before
  // By design, you can only compute the elements once.
  elements () {
    return this._elements || this.compute_elements()
  }

  //////////////////////////////////////////////////////////////////////////////
  // Operators*
  //////////////////////////////////////////////////////////////////////////////

  valueOf () {
    return this.toString()
  }

  equals (other) {
    return this.toString() === other.toString()
  }

  //////////////////////////////////////////////////////////////////////////////
  // Utils
  //////////////////////////////////////////////////////////////////////////////

  // elements:     An subset of elements of the set
  //               It is not necessary that this array is unique
  // returns a string where positions of elements  "10001010110100000...011"
  elements_to_bitmask_string (elements) {
    const bitmask_array = this.set.zeros.split('') // Create array of 0's
    elements.forEach((element) => {
      const index = this.indexOf(element)
      if (index === -1) throw Error('Element ' + element + ' not found in set.') // element not found
      bitmask_array[index] = '1'
    })

    return bitmask_array.join('')
  }

  // flip the bits (via string replace)
  flip_string_bits (string) {
    let string_temp = string.replace(/1/g, 'X')
    string_temp = string_temp.replace(/0/g, '1')
    return string_temp.replace(/X/g, '0')
  }

  // Pad the string to a given length from the left using `char`
  padStart (string, length, char) {
    const padding_length = length - string.length
    return char.repeat(padding_length) + string
  }
}

export { Bitmask }
