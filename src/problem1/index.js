// worst solution - using recursion, time complexity O(n), space complexity O(n)
const sum_to_n_a = function (n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return n + sum_to_n_a(n - 1);
};

// better solution - using iteration, time complexity O(n), space complexity O(1)
const sum_to_n_b = function (n) {
  if (n === 0) return 0;
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// best solution - using formula, time complexity O(1), space complexity O(1)
const sum_to_n_c = function (n) {
  if (n === 0) return 0;
  return (n * (n + 1)) / 2;
};

module.exports = { sum_to_n_a, sum_to_n_b, sum_to_n_c };
