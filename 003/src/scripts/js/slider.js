const MAX = 100;
/**
 * Check x.
 * @param {int} x value for check
 */
function doSomeWork(x) {
  if (x > MAX) {
    throw new Error(`At most ${MAX} allowed: ${x}!`);
  }
}

doSomeWork(10);

