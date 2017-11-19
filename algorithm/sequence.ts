/** Sequence - 数列 */

import * as ut from "./utility";

/** 
 * Arithmetic Sequence - 等差数列
 * <ul>
 * <li> arith(5) -> [0, 1, 2, 3, 4]
 * <li> arith(3, 11) -> [11, 12, 13]
 * <li> arith(6, 1.0, -0.2) -> [1.0, 0.8, 0.6, 0.4, 0.2, 0.0]
 * </ul>
 */
export function arith(count: number, start: number = 0, diff: number = 1): number[] {
    const seq: number[] = new Array(count);
    for (let i = 0, n = start; i < count; i++ , n += diff) {
        seq[i] = n;
    }
    return seq;
}

/**
 * Geometric Sequence - 等比数列
 * <ul>
 * <li> geo(5) -> [1, 2, 4, 8, 16]
 * <li> geo(3, 5) -> [5, 10, 20]
 * <li> geo(4, 1, 10) -> [1, 10, 100, 1000]
 * </ul>
 */
export function geo(count: number, start: number = 1, ratio: number = 2): number[] {
    const seq: number[] = new Array(count);
    for (let i = 0, n = start; i < count; i++ , n *= ratio) {
        seq[i] = n;
    }
    return seq;
}

/**
 * Recurrence Relation - 初期値1つの漸化式による数列
 * <ul>
 * <li> recurrence_relation_1(5, 1, n=>n+1) -> [1, 2, 3, 4, 5]
 * <li> recurrence_relation_1(4, 2, n=>n*2) -> [2, 4, 8, 16]
 * <li> recurrence_relation_1(6, 0, n=>n*2+1) -> [0, 1, 3, 7, 15, 31]
 * </ul>
 */
export function recurrence_relation_1(count: number, n0: number, lambda: (n0: number) => number): number[] {
    const ini: number[] = [n0];
    const seq: number[] = new Array(count);
    const count2 = ut.min(count, ini.length);
    for (let i = 0; i < count2; i++) {
        seq[i] = ini[i];
    }
    for (let i = ini.length; i < count; i++) {
        seq[i] = lambda(seq[i-1]);
    }
    return seq;
}

/**
 * Recurrence Relation - 初期値2つの漸化式による数列
 * <ul>
 * <li> recurrence_relation_2(12, 0, 1, (a,b)=>a+b) -> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
 * </ul>
 */
export function recurrence_relation_2(count: number, n0: number, n1: number, lambda: (n0: number, n1: number) => number): number[] {
    const ini: number[] = [n0, n1];
    const seq: number[] = new Array(count);
    const count2 = ut.min(count, ini.length);
    for (let i = 0; i < count2; i++) {
        seq[i] = ini[i];
    }
    for (let i = ini.length; i < count; i++) {
        seq[i] = lambda(seq[i-2], seq[i-1]);
    }
    return seq;
}

/**
 * Fibonacci Sequence - フィボナッチ数列
 * <ul>
 * <li> fibonacci(1) -> [0]
 * <li> fibonacci(6) -> [0, 1, 1, 2, 3, 5]
 * <li> fibonacci(12) -> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
 * </ul>
 */
export function fibonacci(count: number): number[] {
    return recurrence_relation_2(count, 0, 1, (n0, n1) => n0 + n1);
}

/**
 * Binomial Coefficients - 2項係数の数列
 * <ul>
 * <li> binomial_coefficients(0) -> [1]
 * <li> binomial_coefficients(1) -> [1, 1]
 * <li> binomial_coefficients(2) -> [1, 2, 1]
 * <li> binomial_coefficients(3) -> [1, 3, 3, 1]
 * <li> binomial_coefficients(4) -> [1, 4, 6, 4, 1]
 * </ul>
 */
export function binomial_coefficients(n: number): number[] {
    return arith(n + 1).map(i => ut.combination(n, i));
}

/**
 * n次バーンスタイン基底関数のブレンディング関数？の数列
 * <ul>
 * <li> bernstein(2, 0/4) -> [1, 0, 0]
 * <li> bernstein(2, 1/4) -> [9/16, 6/16, 1/16]
 * <li> bernstein(2, 2/4) -> [1/4, 2/4, 1/4]
 * <li> bernstein(2, 4/4) -> [0, 0, 1]
 * <li> bernstein(3, 0/4) -> [1, 0, 0, 0]
 * <li> bernstein(3, 1/4) -> [27/64, 27/64, 9/64, 1/64]
 * <li> bernstein(3, 2/4) -> [1/8, 3/8, 3/8, 1/8]
 * <li> bernstein(3, 4/4) -> [0, 0, 0, 1]
 * </ul>
 */
export function bernstein(n: number, x: number) {
    return binomial_coefficients(n)
        .map((d, i) => d * ut.pow(1 - x, n - i) * ut.pow(x, i));
}
