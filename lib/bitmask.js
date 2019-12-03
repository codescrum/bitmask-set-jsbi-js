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

    // this.ones  = "1".repeat(this.size)   // "1111...1111"  used for operations (Strings are immutable in JS)
    // this.zeros = "0".repeat(this.size)  // "0000...0000"  used for operations (Strings are immutable in JS)
  }
  // all_elements: The set within to constrain the map (an array of all possible elements)
  //               This array must have unique values
  // elements:     An array of ids within
  //               It is not necessary that this array is unique
  // returns a string where positions of elements  "10001010110100000...011"
  elements_to_bitmask_string(elements) {
    let bitmask_string = "0".repeat(space.all_elements.length) // Create a string full of 0's, the same size as the array of all elements
    _.each(elements, function(element){
      index = all_elements.indexOf(element)
      if(index === -1) throw "Element " + element + " not found." // element not found
      bitmask_string = replaceCharAt(bitmask_string, index, '1') // Replace a "1" in positions where the element is found
    });
    return bitmask_string
  }

  // Return the actual BigInt object suitable for bitwise operations
  elements_to_bigint(elements) {
    return BigInt("0b" + elements_to_bitmask_string(elements))
  }

}

// Using direct object
module.exports = {
  Bitmask: Bitmask
}
