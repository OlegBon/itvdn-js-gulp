
/**
 * Adds numbers together.
 * @param {int} x The first number.
 * @param {int} y The second number.
 * @param {int} z The second number. numbers.
 * @return {int}
 */
function sum(x, y, z) {
  return x + y + z;
}

const numbers = [1, 2, 3];

console.log(sum(...numbers));

console.log(sum.apply(null, numbers));

let numberStore = [0, 1, 2];
const newNumber = 12;
numberStore = [...numberStore, newNumber];

console.log(numberStore);

