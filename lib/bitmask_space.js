class BitmaskSpace {
  constructor(all_elements) {
    // Check if all_elements is actually a value
    if(all_elements == undefined || all_elements == null || all_elements.length === 0){
      throw "The space defined by all elements cannot be empty!"
    }
    // Check if all_elements is effectively an array
    if(!Array.isArray(all_elements)){ throw "The space defined by all elements must be an array!"}
    this.all_elements = elements
  }
}
module['exports'] = BitmaskSpace;
