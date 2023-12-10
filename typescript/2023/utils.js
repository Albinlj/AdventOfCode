export function gcd2(a, b) {
  // Greatest common divisor of 2 integers
  if (!b) return b === 0 ? a : NaN
  return gcd2(b, a % b)
}
export function gcd(array) {
  // Greatest common divisor of a list of integers
  var n = 0
  for (var i = 0; i < array.length; ++i)
    n = gcd2(array[i], n)
  return n
}
export function lcm2(a, b) {
  // Least common multiple of 2 integers
  return (a * b) / gcd2(a, b)
}
export function lcm(array) {
  // Least common multiple of a list of integers
  var n = 1
  for (var i = 0; i < array.length; ++i)
    n = lcm2(array[i], n)
  return n
}
