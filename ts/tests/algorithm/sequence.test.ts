import * as seq from "../../algeol/algorithm/sequence";

test('arithmetic', () => {
    expect(seq.arithmetic(4)).toEqual([0, 1, 2, 3]);
    expect(seq.arithmetic(4, 5)).toEqual([5, 6, 7, 8]);
    expect(seq.arithmetic(4, 5, 2)).toEqual([5, 7, 9, 11]);
    expect(seq.arithmetic(4, 5, -1)).toEqual([5, 4, 3, 2]);
});

test('geometric', () => {
    expect(seq.geometric(4)).toEqual([1, 2, 4, 8]);
    expect(seq.geometric(4, 5)).toEqual([5, 10, 20, 40]);
    expect(seq.geometric(4, 5, 3)).toEqual([5, 15, 45, 135]);
    expect(seq.geometric(3, 1, -1)).toEqual([1, -1, 1]);
});

test('range', () => {
    expect(seq.range(0, 12, 4)).toEqual([0, 4, 8, 12]);
    expect(seq.range(4, 10, 3)).toEqual([4, 7, 10]);
});

test('range_wo_last', () => {
    expect(seq.range(0, 12, 5, true)).toEqual([0, 3, 6, 9]);
    expect(seq.range(4, 10, 4, true)).toEqual([4, 6, 8]);
});

test('range_step', () => {
    expect(seq.range_step(0, 12, 4)).toEqual([0, 4, 8, 12]);
    expect(seq.range_step(0, 10, 4)).toEqual([0, 4, 8]);
});

test('recurrence_relation_1', () => {
    expect(seq.recurrence_relation_1(5, 1, n=>n+1)).toEqual([1, 2, 3, 4, 5]);
    expect(seq.recurrence_relation_1(4, 2, n=>n*2)).toEqual([2, 4, 8, 16]);
    expect(seq.recurrence_relation_1(6, 0, n=>n*2+1)).toEqual([0, 1, 3, 7, 15, 31]);
});

test('recurrence_relation_2', () => {
    expect(seq.recurrence_relation_2(12, 0, 1, (a,b)=>a+b)).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]);
});

test('fibonacci', () => {
    expect(seq.fibonacci(1)).toEqual([0]);
    expect(seq.fibonacci(6)).toEqual([0, 1, 1, 2, 3, 5]);
    expect(seq.fibonacci(12)).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]);
});

test('binomial_coefficients', () => {
    expect(seq.binomial_coefficients(0)).toEqual([1]);
    expect(seq.binomial_coefficients(1)).toEqual([1, 1]);
    expect(seq.binomial_coefficients(2)).toEqual([1, 2, 1]);
    expect(seq.binomial_coefficients(3)).toEqual([1, 3, 3, 1]);
    expect(seq.binomial_coefficients(4)).toEqual([1, 4, 6, 4, 1]);
});

test('bernstein_basis_coefficients', () => {
    expect(seq.bernstein_basis_coefficients(2, 0/4)).toEqual([1, 0, 0]);
    expect(seq.bernstein_basis_coefficients(2, 1/4)).toEqual([9/16, 6/16, 1/16]);
    expect(seq.bernstein_basis_coefficients(2, 2/4)).toEqual([1/4, 2/4, 1/4]);
    expect(seq.bernstein_basis_coefficients(2, 3/4)).toEqual([1/16, 6/16, 9/16]);
    expect(seq.bernstein_basis_coefficients(2, 4/4)).toEqual([0, 0, 1]);
    expect(seq.bernstein_basis_coefficients(3, 0/4)).toEqual([1, 0, 0, 0]);
    expect(seq.bernstein_basis_coefficients(3, 1/4)).toEqual([27/64, 27/64, 9/64, 1/64]);
    expect(seq.bernstein_basis_coefficients(3, 2/4)).toEqual([1/8, 3/8, 3/8, 1/8]);
    expect(seq.bernstein_basis_coefficients(3, 3/4)).toEqual([1/64, 9/64, 27/64, 27/64]);
    expect(seq.bernstein_basis_coefficients(3, 4/4)).toEqual([0, 0, 0, 1]);
});

test('to_2d', () => {
    expect(seq.to_2d([1, 2], [3, 4])).toEqual([[1, 3], [1, 4], [2, 3], [2, 4]]);
});

test('to_3d', () => {
    expect(seq.to_3d([1, 2], [3, 4], [5, 6])).toEqual([[1, 3, 5], [1, 3, 6], [1, 4, 5], [1, 4, 6], [2, 3, 5], [2, 3, 6], [2, 4, 5], [2, 4, 6]]);
});
