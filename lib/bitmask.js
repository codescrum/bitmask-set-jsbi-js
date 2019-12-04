_ = require('lodash');

class Bitmask {
  constructor(space, elements, options = {}) {

    if(space == undefined || space == null){ throw Error("You need to specify a space for the bitmap to make sense.") }
    if(!Array.isArray(elements)){ throw Error('You must pass an array of elements to the bitmask.') }

    options = _.defaults(options, {
      'inherit_sort': true,  // inherits the `sort` option from the space
      'sort': false          // forces the sort, regardless of the `inherit_sort` property
    });

    // Initialize
    this.space = space            // associates it to a space
    this.size  = this.space.size  // size must be the same as the space size


    // Regardless of the order of the array, the bitmask will always
    // repect the order of elements as it is on the space
    // sorting here is only made to ease debugging if required

    let sort = options['sort']
    sort = options['inherit_sort'] ? (space.options['sort'] || sort) : sort

    if(sort){
      this.elements = elements.sort()
    }else {
      this.elements = elements
    }

    // Compute representations
    this.string_representation = this.elements_to_bitmask_string(this.elements)
    this.bigint_representation = BigInt("0b" + this.string_representation)
  }


  //////////////////////////////////////////////////////////////////////////////
  // Representations
  //////////////////////////////////////////////////////////////////////////////

  // convenience method
  // bits and BigInt are actually the same for bitwise operations
  bits(){
    return this.bigint_representation;
  }

  toString(){
    return this.string_representation;
  }

  // Return the actual BigInt object suitable for bitwise operations
  toBigInt() {
    return this.bits();
  }

  //////////////////////////////////////////////////////////////////////////////
  // Operations
  //////////////////////////////////////////////////////////////////////////////



  // elements:     An array of ids within
  //               It is not necessary that this array is unique
  // returns a string where positions of elements  "10001010110100000...011"
  elements_to_bitmask_string(elements) {
    let space = this.space
    let bitmask_array = space.zeros.split('') // Create array of 0's

    _.each(elements, function(element){
      let index = space.elements.indexOf(element)
      if(index === -1) throw "Element " + element + " not found in space." // element not found
      bitmask_array[index] = '1'
    });

    return bitmask_array.join('')
  }

}

// Using direct object
module.exports = {
  Bitmask: Bitmask
}
