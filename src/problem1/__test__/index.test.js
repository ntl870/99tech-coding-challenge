const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = require("../index");

describe("sum_to_n", () => {
  it("should return the correct sum using recursion", () => {
    expect(sum_to_n_a(1)).toBe(1);
    expect(sum_to_n_a(5)).toBe(15);
    expect(sum_to_n_a(10)).toBe(55);
  });

  it("should return the correct sum using iteration", () => {
    expect(sum_to_n_b(1)).toBe(1);
    expect(sum_to_n_b(5)).toBe(15);
    expect(sum_to_n_b(10)).toBe(55);
  });

  it("should return the correct sum using formula", () => {
    expect(sum_to_n_c(1)).toBe(1);
    expect(sum_to_n_c(5)).toBe(15);
    expect(sum_to_n_c(10)).toBe(55);
  });

  it("should handle edge cases", () => {
    expect(sum_to_n_a(0)).toBe(0);
    expect(sum_to_n_b(0)).toBe(0);
    expect(sum_to_n_c(0)).toBe(0);
  });
});
