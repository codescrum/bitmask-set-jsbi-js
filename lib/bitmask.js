var _ = require('lodash');
var JSBI = require('jsbi');

class Bitmask {

  // We accept either an array of elements or bits
  constructor(field, elements, options = {}) {

    if(field == undefined || field == null){ throw Error("You need to specify a field for the bitmask to make sense.") }

    /////// Initialize

    // Associate with field
    this.field = field            // associates it to a field
    this.size  = this.field.size  // size must be the same as the field size

    // Deal with options
    options = _.defaults(options, {
      'inherit_sort': true,  // inherits the `sort` option from the field
      'sort': false          // forces the sort, regardless of the `inherit_sort` property
    });

    // Initialize sort
    let sort = options['sort']

    // Check constructor arguments
    // Careful here: JSBI instances DO evaluate to being arrays.
    if(Array.isArray(elements) && !(elements instanceof JSBI)){

      // Regardless of the order of the array, the bitmask will always
      // repect the order of elements as it is on the field
      // sorting here is only made to ease debugging if required

      sort = options['inherit_sort'] ? (field.options['sort'] || sort) : sort

      if(sort){
        this.elements = elements.sort()
      }else {
        this.elements = elements
      }

      // Compute representations (elements passed)
      this.string_representation = this.elements_to_bitmask_string(this.elements)
      this.bigint_representation = JSBI.BigInt("0b" + this.string_representation)
      this.bits = this.bigint_representation // For convenience on operations

    }else if(elements instanceof JSBI){

      let bits = elements; // For readability

      if(sort){ console.log("WARNING: Element sorting is not done if you build the bitmask from bits.") }

      // Compute representations (elements passed)

      let unpadded_string = bits.toString(2);

      // This may happen when you apply "not"
      // if(bits < 0){
      //   unpadded_string = unpadded_string.replace()
      // }

      this.string_representation = _.padStart(unpadded_string, this.size, '0');
      this.bigint_representation = bits;
      this.bits = bits;

    }else{
      throw Error('You must pass an array of elements or bits (BigInt) to create the bitmask.');
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Querying
  //////////////////////////////////////////////////////////////////////////////
  includes(element){
    let index = this.indexOf(element)
    return this.string_representation[index] === '1';
  }

  indexOf(element){
    return this.field.indexOf(element)
  }

  //////////////////////////////////////////////////////////////////////////////
  // Representations
  //////////////////////////////////////////////////////////////////////////////

  toString(){
    return this.string_representation;
  }

  // Return the actual BigInt object suitable for bitwise operations
  toBigInt() {
    return this.bits;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Operations
  //////////////////////////////////////////////////////////////////////////////
  //
  // IMPORTANT: We are assuming that all operations are being done on bitmasks
  //            which belong to the same field!
  //
  //            For performance reasons we are not checking that this is the
  //            case.
  //
  //////////////////////////////////////////////////////////////////////////////

  and(other){
    return this.field.bitmask(JSBI.bitwiseAnd(this.bits, other.bits));
  }

  or(other){
    return this.field.bitmask(JSBI.bitwiseOr(this.bits, other.bits));
  }

  xor(other){
    return this.field.bitmask(JSBI.bitwiseXor(this.bits, other.bits));
  }

  not(){
    throw('Not supported - elements must reside in the field (check Galois Field)');
    return this.field.bitmask(JSBI.bitwiseNot(this.bits));
  }

  invert(){
    return this.field.bitmask(JSBI.BigInt('0b' + this.flip_string_bits(this.toString())))
  }

  in(other){
    return (JSBI.equal(JSBI.bitwiseAnd(this.bits, other.bits), this.bits));
  }

  not_in(other){
    return (JSBI.equal(JSBI.bitwiseAnd(this.bits, other.bits), JSBI.BigInt(0)));
  }

  add(elements){
    return this.field.bitmask(JSBI.bitwiseOr(this.bits, this.field.bitmask(elements).bits))
  }

  remove(elements){
    return this.field.bitmask(JSBI.bitwiseOr(this.bits, this.field.bitmask(elements).invert().bits))
  }

  //////////////////////////////////////////////////////////////////////////////
  // Computations
  //////////////////////////////////////////////////////////////////////////////

  compute_elements(){
    let string_representation = this.string_representation
    let elements = []

    _.each(string_representation.split(''), (bit, index) => {
      if(bit === '1'){
        elements.push(this.field.elements[index])
      }
    });

    this.elements = elements;
    return this.elements;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Utils
  //////////////////////////////////////////////////////////////////////////////

  // elements:     An array of ids within
  //               It is not necessary that this array is unique
  // returns a string where positions of elements  "10001010110100000...011"
  elements_to_bitmask_string(elements) {
    let bitmask_array = this.field.zeros.split('') // Create array of 0's

    _.each(elements, (element) => {
      let index = this.indexOf(element)
      if(index === -1) throw "Element " + element + " not found in field." // element not found
      bitmask_array[index] = '1'
    });

    return bitmask_array.join('')
  }

  flip_string_bits(string){
    let string_temp = string.replace(/1/g, 'X')
    string_temp = string_temp.replace(/0/g, '1')
    return string_temp.replace(/X/g, '0')
  }

}

// Using direct object
module.exports = {
  Bitmask: Bitmask
}
