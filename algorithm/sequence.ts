/** Sequence - 数列 */

import * as ut from "./utility";

/** 
 * Arithmetic Sequence - 等差数列
 * (4) -> [0, 1, 2, 3]
 * (4, 5) -> [5, 6, 7, 8]
 * (4, 5, -1) -> [5, 4, 3, 2]
 */
export function arith(count: number, start: number = 0, diff: number = 1): number[] {
    const seq: number[] = new Array(count);
    for (let i = 0, n = start; i < count; i++, n += diff) {
        seq[i] = n;
    }
    return seq;
}

/**
 * Geometric Sequence - 等比数列
 * (4) -> [1, 2, 4, 8]
 * (4, 5) -> [5, 10, 20, 40]
 * (4, 5, 3) -> [5, 15, 45, 135]
 */
export function geo(count: number, start: number = 1, ratio: number = 2): number[] {
    const seq: number[] = new Array(count);
    for (let i = 0, n = start; i < count; i++, n *= ratio) {
        seq[i] = n;
    }
    return seq;
}

export function range_step(first: number, last: number, step: number): number[] {
    const seq: number[] = new Array(Math.floor((last - first) / step) + 1);
    for (let i = 0, n = first; n <= last; i++, n += step) {
        seq[i] = n;
    }
    return seq;
}
/** 
 * (5, 10, 3) -> [5, 7.5, 10]
 */
export function range(first: number, last: number, count: number): number[] {
    const seq: number[] = new Array(count);
    for (let i = 0; i < count; i++) {
        const r = i / (count - 1);  // 0.0 ... 1.0
        const n = (1 - r) * first + r * last;
        seq[i] = n;
    }
    return seq;
}
/** 
 * (4, 10, 3) -> [4, 6, 8]
 */
export function range_wo_last(first: number, last: number, count: number): number[] {
    const seq: number[] = new Array(count);
    for (let i = 0; i < count; i++) {
        const r = i / count;    // 0.0 ... (count-1) / count
        const n = (1 - r) * first + r * last;
        seq[i] = n;
    }
    return seq;
}

/**
 * Recurrence Relation - 初期値1つの漸化式による数列
 * (3, 1, n=>n+1) -> [1, 2, 3]
 * (4, 2, n=>n*2) -> [2, 4, 8, 16]
 * (5, 0, n=>n*2+1) -> [0, 1, 3, 7, 15]
 */
export function recurrence_relation_1(count: number, n0: number, lambda: (n0: number) => number): number[] {
    const ini: number[] = [n0];
    const seq: number[] = new Array(count);
    const count2 = Math.min(count, ini.length);
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
 * (12, 0, 1, (a,b)=>a+b) -> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
 */
export function recurrence_relation_2(count: number, n0: number, n1: number, lambda: (n0: number, n1: number) => number): number[] {
    const ini: number[] = [n0, n1];
    const seq: number[] = new Array(count);
    const count2 = Math.min(count, ini.length);
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
 * (1) -> [0]
 * (6) -> [0, 1, 1, 2, 3, 5]
 * (12) -> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
 */
export function fibonacci(count: number): number[] {
    return recurrence_relation_2(count, 0, 1, (n0, n1) => n0 + n1);
}

/**
 * Binomial Coefficients - 2項係数の数列
 * (0) -> [1]
 * (1) -> [1, 1]
 * (2) -> [1, 2, 1]
 * (3) -> [1, 3, 3, 1]
 * (4) -> [1, 4, 6, 4, 1]
 */
export function binomial_coefficients(n: number): number[] {
    return arith(n + 1).map(i => ut.combination(n, i));
}

/**
 * Bernstein basis polynomials - n次バーンスタイン基底関数により得られる数列
 * (2, 0/4) -> [1, 0, 0]
 * (2, 1/4) -> [9/16, 6/16, 1/16]
 * (2, 2/4) -> [1/4, 2/4, 1/4]
 * (2, 3/4) -> [1/16, 6/16, 9/16]
 * (2, 4/4) -> [0, 0, 1]
 * (3, 0/4) -> [1, 0, 0, 0]
 * (3, 1/4) -> [27/64, 27/64, 9/64, 1/64]
 * (3, 2/4) -> [1/8, 3/8, 3/8, 1/8]
 * (3, 3/4) -> [1/64, 9/64, 27/64, 27/64]
 * (3, 4/4) -> [0, 0, 0, 1]
 */
export function bernstein_basis(n: number, t: number): number[] {
    //return binomial_coefficients(n).map((d, i) => d * ut.pow(1 - t, n - i) * ut.pow(t, i));
    return arith(n + 1).map(i => ut.bernstein_basis(n, i, t));
}
