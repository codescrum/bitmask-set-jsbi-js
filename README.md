# Bitmask Field

Bitmask Field allows you to define a closed field of bitmasks, all of which represent
the selection of elements across an array of defined elements.

By manipulating the bitmasks you can quickly optimize typical multiple-selection
operations which would otherwise require many array iterations and accesses to perform.

The bitmask field implemented here is a closed space in which all operations on
bitmasks yield other bitmasks in the field.
