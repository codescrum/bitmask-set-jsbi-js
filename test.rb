require 'pry'
require 'active_support/all'
require 'bitarray'

users_per_team = 5000
team_count = 10

users_in_teams_count = users_per_team*team_count
all_user_count = (users_in_teams_count*1.25).to_i # Add 25% more users not in teams

user_ids = (1..all_user_count).to_a
teams = {}

# Put the users at random into teams
user_ids.sample(users_in_teams_count).in_groups_of(users_per_team).map.with_index do |group, index|
  teams[index+1] = group
end




# example
au_ids = [1,2,3,4,5,6,7,8,9,10]
au_size = au_ids.size
ta_ids = [1,3,5,7,8,9]

ba = BitArray.new(1000)

team_a_powers = ta_ids.map{|e| au_size - au_ids.index(e) -1}
team_a_powers.inject(0){|a,k| a + k**2}.to_s(2)

binding.pry
1


# Resources

# https://github.com/peterc/bitarray
# https://nithinbekal.com/posts/bit-arrays-ruby/
# https://www.rubydoc.info/stdlib/core/Array:pack
# https://www.geeksforgeeks.org/ruby-array-replace-function/
# http://www.java2s.com/Code/Ruby/Array/Replacingsubarrayswith.htm

# Bloom filters
#
# https://en.wikipedia.org/wiki/Bloom_filter
# https://github.com/cbetta/json-bloomfilter
# https://github.com/mceachen/bloomer
