var assert = require('assert');
_ = require('lodash');
var colors = require('colors');

// Basic configuration
users_per_team            = 10 // Number of users per team
team_count                = 100    // Number of teams
users_with_no_team_factor = 0    // Proportion of users with no team (use valurs from 0 to INF) example: 0.25

// Advanced configuration
team_collission_factor    = 0    // 0 means no collission, increase the number as an integer to increase likelyhood of collission
                                 // No collission means that teams do not repeat team members

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

function zeroPad(num, places) {
  return String(num).padStart(places, '0')
}

// This is required!, you cannot trust the toString(2) method alone, since you
// need to pad the output to the length of the all_elements array!
function bitmap_to_string(all_elements, bitmap){
  unpadded_bitmap_string = bitmap.toString(2)
  space_size = all_elements.length // Defining new concept here for later encapsulation
  return _.padStart(unpadded_bitmap_string, space_size, '0')
}

// search a given element in a bitmap
function search_in_bitmap(all_elements, bitmap, element, implementation = 'string'){
  if(implementation === "string"){

    bitmap_string = bitmap_to_string(all_elements, bitmap) // Convert the bitmap to its binary representation as astring
    index = all_elements.indexOf(element) // check the index in the array of all elements
    console.log("index is: " +  index)
    if(index === -1) throw "Element " + element + " not found." // element not found
    console.log("bitmap_string is: " +  bitmap_string)
    console.log("bitmap_string.charAt(index) is: " +  bitmap_string.charAt(index))
    return bitmap_string.charAt(index) === '1'

  }else if(implementation === "bitmask"){
    throw "Not implemented yet! -> Idea is to do a bitwise mask on the bitmap with 2^pos and check if >0"
  }
}

// Easily inspect the elements of a bitmap
function print(all_elements, bitmap, highlighted_elements){
  chunk_size = 10

  highlighted_bitmap_string = highlight_bitmap_elements(all_elements, bitmap_to_string(all_elements, bitmap), highlight_bitmap_elements)
  bits = highlighted_bitmap_string.split('') // Split to bits
  // _.chunk(bits, chunk_size)

  max = Math.max(...all_elements) // Get the max out of all elements (assuming they are integers)
  digits = Math.floor(Math.log10(max)) + 1 // Get how many digits it requires

  all_elements_padded = _.map(all_elements, function(element){
    return zeroPad(element, digits)
  })

  // all_elements_padded_chunked = _.chunk(all_elements_padded, chunk_size)

  // _.each(highlighted_elements, function(element){
  //
  // };

  all_indexes = _.map(range(1, all_elements.length), function(i){
    return zeroPad(i - 1, digits)
  })


  output = _.zip(all_indexes, all_elements_padded, bits)

  console.log("index | element | bit")
  _.each(output, function(output_triplet){
    console.log("" + output_triplet[0] + " | " + output_triplet[1] + " | " + output_triplet[2])
  });

}

function highlight_bitmap_elements(all_elements, bitmap_string, elements){
  _.each(elements, function(element){
    index = all_elements.indexOf(element)
    if(index === -1) throw "Element " + element + " not found." // element not found
    bitmap_string = replaceCharAtArray(bitmap_string, index, bitmap_string.charAt(index).green) // Replace a "1" in positions where the element is found
  });
  return bitmap_string
}


// This is the least efficient way according to https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
// TIP: Optimize even further using split and join, see arrayReplaceCharAt below
function replaceCharAt(string, index, char){
  if(index > string.length-1) return string;
  return string.substr(0,index) + char + string.substr(index+1);
}

function arrayReplaceCharAt(string, index, char){
  if(index > string.length-1) return string;
  letters = string.split('')
  letters[index] = char
  return letters.join('')
}


// all_elements: The set within to constrain the map (an array of all possible elements)
//               This array must have unique values
// elements:     An array of ids within
//               It is not necessary that this array is unique
// returns a string where positions of elements  "10001010110100000...011"
function elements_to_bitmap_string(all_elements, elements) {
  bitmap_string = "0".repeat(all_elements.length) // Create a string full of 0's, the same size as the array of all elements
  _.each(elements, function(element){
    index = all_elements.indexOf(element)
    if(index === -1) throw "Element " + element + " not found." // element not found
    bitmap_string = replaceCharAt(bitmap_string, index, '1') // Replace a "1" in positions where the element is found
  });
  return bitmap_string
}

// Return the actual BigInt object suitable for bitwise operations
function elements_to_bitmap(all_elements, elements) {
  return BigInt("0b" + elements_to_bitmap_string(all_elements, elements))
}

// Just a simple test
function test(){
  assert.equal("111001011", elements_to_bitmap_string([16,13,14,21,20,25,35,37,30], [13,16,14,25,30,37]), "elements_to_bitmap_string - Test 1 failed")
  assert.equal("011001011", elements_to_bitmap_string([16,13,14,21,20,25,35,37,30], [13,14,25,30,37]), "elements_to_bitmap_string - Test 2 failed")
  assert.equal("000000000", elements_to_bitmap_string([16,13,14,21,20,25,35,37,30], []), "elements_to_bitmap_string - Test 3 failed")
  assert.equal("111111111", elements_to_bitmap_string([16,13,14,21,20,25,35,37,30], [13,14,16,20,21,25,35,37,30]), "elements_to_bitmap_string - Test 3 failed")

  assert.equal("011001011", bitmap_to_string([16,13,14,21,20,25,35,37,30], BigInt("0b011001011")), "bitmap_to_string - Test 1 failed")
  assert.equal("111001011", bitmap_to_string([16,13,14,21,20,25,35,37,30], BigInt("0b111001011")), "bitmap_to_string - Test 2 failed")
  assert.equal("000000000", bitmap_to_string([16,13,14,21,20,25,35,37,30], BigInt("0b000000000")), "bitmap_to_string - Test 3 failed")
  assert.equal("000000001", bitmap_to_string([16,13,14,21,20,25,35,37,30], BigInt("0b000000001")), "bitmap_to_string - Test 4 failed")
  assert.equal("100000000", bitmap_to_string([16,13,14,21,20,25,35,37,30], BigInt("0b100000000")), "bitmap_to_string - Test 5 failed")
  assert.equal("100000001", bitmap_to_string([16,13,14,21,20,25,35,37,30], BigInt("0b100000001")), "bitmap_to_string - Test 6 failed")

  assert.equal("X234567890", arrayReplaceCharAt("1234567890", 0, "X"), "arrayReplaceCharAt - Test 1 failed")
  assert.equal("1234X67890", arrayReplaceCharAt("1234567890", 4, "X"), "arrayReplaceCharAt - Test 2 failed")
  assert.equal("123456789X", arrayReplaceCharAt("1234567890", 9, "X"), "arrayReplaceCharAt - Test 3 failed")
}

test() //validate

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

users_in_teams_count = users_per_team*team_count
all_user_count = Math.round(users_in_teams_count*(users_with_no_team_factor+1)) // Add 25% more users not in teams

all_user_ids = _.shuffle(range(1,all_user_count)) // Shuffle to make sure it does not have anything to do with the order



number_of_layers = team_collission_factor + 1
// We iterate at least once to create the teams


layers = _.flatMap(range(1, number_of_layers),function(i){
  console.log("Creating team id layer "+ i)
  users_in_teams_ids = _.sampleSize(all_user_ids, users_in_teams_count)
  return _.chunk(users_in_teams_ids, users_per_team)
});


console.log("BEGIN - shuffled_layers")
shuffled_layers = _.shuffle(layers)
// console.log(shuffled_layers)
console.log("END   - shuffled_layers")

console.log("BEGIN - layer_stacks")
layer_stacks = _.chunk(layers, number_of_layers)
// console.log(layer_stacks)
console.log("END   - layer_stacks")

console.log("BEGIN - merged_stacks")
merged_stacks = _.map(layer_stacks, function(layer_stack){
  return _.sampleSize(_.uniq(_.flatten(layer_stack)), users_per_team)
});
// console.log(merged_stacks)
console.log("END   - merged_stacks")

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

teams = {} // 0: [88, 70, 98], 1: [45,32,13]

console.log("BEGIN - creating_team hashes {'team_1': [12,45,...]}")
merged_stacks.map(function(group, index){
  teams[`team_${index+1}`] = group
});
console.log("END -   creating_team hashes {'team_1': [12,45,...]}")
//console.log(all_user_ids_per_team)

team_bitmaps = {}

console.log("BEGIN - creating_team bitmaps!")
_.each(teams, function(ids, team_id){
  // console.log("team_id: " + team_id)
  // console.log("ids: " + ids)
  team_bitmaps[team_id] = elements_to_bitmap(all_user_ids, ids)
});
console.log("END -   creating_team bitmaps!")
// console.log(team_bitmaps)


all_users_bitmap = BigInt("0b" + "1".repeat(all_user_count)) // By definition it is all to "1"
chosen_team = "team_1"
team1_bitmap = team_bitmaps[chosen_team]
console.log("Bitmap for " + chosen_team + "\n")
console.log(bitmap_to_string(all_user_ids, team1_bitmap))

// chosen_user_id = _.sample(all_user_ids) // Chose from all users at random
chosen_user_id = _.sample(teams[chosen_team]) // Make sure it is from a chosen team

console.log("All user ids: " + all_user_ids)


console.log("chosen_user_id: " + chosen_user_id)
found = search_in_bitmap(all_user_ids, team1_bitmap, chosen_user_id)
console.log("found: " + found)


print(all_user_ids, team1_bitmap, [chosen_user_id])


// test_big_int = BigInt("0b0000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000001000000001000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000100000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000100100001001000000000000000000000001000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000010000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000010000000000000000000100000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000001000000000000000000000000000010000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000010000000000000010000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000100000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010100000000000000000000000000000000001000000000000000000000000000000000000000000000000001000000000000000000000100000000010000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000001000000000000000000000000000001000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000010000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000100000000000100000000100000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000001000000000000000000000000000000000000000000000000001000000000000001000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000100000000000000000000000000000000000000000000000000000000000000000000000000010000010010000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000100000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000010000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000")
//
// console.log(test_big_int)
// console.log(bitmap_to_string(all_user_ids, test_big_int))



// TEST: OR-ing all of the teams!

final = _.reduce(team_bitmaps, function(a, team_bitmap){
  return (a | team_bitmap)
},);

// // TEST: AND-ing all of the teams!
// final = _.reduce(team_bitmaps, function(a, team_bitmap){
//   return (a & team_bitmap)
// },);

console.log(final)
console.log(bitmap_to_string(all_user_ids, final))
