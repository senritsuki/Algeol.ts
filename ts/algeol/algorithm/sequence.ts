/**
 * Sequence - 数列の生成
 */

import * as ut from '../common';

export {ut}

/** 
 * Arithmetic Sequence - 等差数列
 * @code (4) -> [0, 1, 2, 3]
 * @code (4, 5) -> [5, 6, 7, 8]
 * @code (4, 5, 2) -> [5, 7, 9, 11]
 * @code (4, 5, -1) -> [5, 4, 3, 2]
 */
export function arithmetic(count: number, start: number = 0, diff: number = 1): number[] {
    const seq: number[] = new Array(count);
    for (let i = 0; i < count; i++) {
        seq[i] = start + diff * i;
    }
    return seq;
}

/**
 * Geometric Sequence - 等比数列
 * @code (4) -> [1, 2, 4, 8]
 * @code (4, 5) -> [5, 10, 20, 40]
 * @code (4, 5, 3) -> [5, 15, 45, 135]
 */
export function geometric(count: number, start: number = 1, ratio: number = 2): number[] {
    const seq: number[] = new Array(count);
    for (let i = 0, n = start; i < count; i++, n *= ratio) {
        seq[i] = n;
    }
    return seq;
}

/** 
 * @code (4, 10, 3) -> [4, 7, 10]
 * @code (0, 12, 4) -> [0, 4, 8, 12]
 * @code (4, 10, 3, false) -> [4, 6, 8]
 * @code (0, 12, 4, false) -> [0, 3, 6, 9]
 */
export function range(first: number, last: number, count: number, skip_last: boolean = false): number[] {
    const i_max = skip_last ? count - 1 : count;
    const seq: number[] = new Array(i_max);
    for (let i = 0; i < i_max; i++) {
        const r = i / (count - 1);  // 0.0 ... 1.0
        const n = (1 - r) * first + r * last;
        seq[i] = n;
    }
    return seq;
}
/** 
 * @code (0, 12, 4) -> [0, 4, 8, 12]
 * @code (0, 10, 4) -> [0, 4, 8]
 */
export function range_step(first: number, last: number, step: number): number[] {
    const seq: number[] = new Array(Math.floor((last - first) / step) + 1);
    for (let i = 0, n = first; n <= last; i++, n += step) {
        seq[i] = n;
    }
    return seq;
}

/**
 * Recurrence Relation - 初期値1つの漸化式による数列
 * @code (3, 1, n=>n+1) -> [1, 2, 3]
 * @code (4, 2, n=>n*2) -> [2, 4, 8, 16]
 * @code (5, 0, n=>n*2+1) -> [0, 1, 3, 7, 15]
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
 * @code (12, 0, 1, (a,b)=>a+b) -> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
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
 * @code (1) -> [0]
 * @code (6) -> [0, 1, 1, 2, 3, 5]
 * @code (12) -> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
 */
export function fibonacci(count: number): number[] {
    return recurrence_relation_2(count, 0, 1, (n0, n1) => n0 + n1);
}

/**
 * Binomial Coefficients - 2項係数
 * @code (0) -> [1]
 * @code (1) -> [1, 1]
 * @code (2) -> [1, 2, 1]
 * @code (3) -> [1, 3, 3, 1]
 * @code (4) -> [1, 4, 6, 4, 1]
 */
export function binomial_coefficients(n: number): number[] {
    return arithmetic(n + 1).map(i => ut.combination(n, i));
}

/**
 * Bernstein Basis Coefficients - n次バーンスタイン基底関数により得られる係数の数列
 * @code (3, 0/4) -> [1, 0, 0, 0]
 * @code (3, 1/4) -> [27/64, 27/64, 9/64, 1/64]
 * @code (3, 2/4) -> [1/8, 3/8, 3/8, 1/8]
 * @code (3, 3/4) -> [1/64, 9/64, 27/64, 27/64]
 * @code (3, 4/4) -> [0, 0, 0, 1]
 */
export function bernstein_basis_coefficients(n: number, t: number): number[] {
    return arithmetic(n + 1).map(i => ut.bernsteinBasis(n, i, t));
}

export function to_2d(seq1: number[], seq2: number[]): [number, number][] {
    const d: [number, number][] = new Array(seq1.length * seq2.length);
    seq1.forEach((n1, i1) => {
        const j = seq2.length * i1;
        seq2.forEach((n2, i2) => {
            d[j + i2] = [n1, n2];
        });
    });
    return d;
}

export function to_3d(seq1: number[], seq2: number[], seq3: number[]): [number, number, number][] {
    const d: [number, number, number][] = new Array(seq1.length * seq2.length);
    seq1.forEach((n1, i1) => {
        const j1 = seq3.length * seq2.length * i1;
        seq2.forEach((n2, i2) => {
            const j2 = seq3.length * i2;
            seq3.forEach((n3, i3) => {
                d[j1 + j2 + i3] = [n1, n2, n3];
            });
        });
    });
    return d;
}
