/** 
 * Utility constants and functions - 汎用的な定数と関数
 * 
 * Copyright (c) 2016 senritsuki
 */

export * from './utility_const';

import * as c from './utility_const';

/** 
 * 0以上2π未満にする
 * @code (3π) -> π
 * @code (-5π) -> π
 */
export function normalize_rad(rad: number): number {
    rad %= c.pi2;
    if (rad < 0) rad += c.pi2;
    return rad;
}

/** 
 * 0以上360未満にする
 * @code (540) -> 180
 * @code (-900) -> 180
 */
export function normalize_deg(deg: number): number {
    deg %= 360;
    if (deg < 0) deg += 360;
    return deg;
}

/**
 * 度数法の角度を弧度法に変換する
 * @code (180) -> π
 * @code (360) -> 2π
 */
export function deg_to_rad(deg: number): number {
    return c.pi2 * deg / 360;
}

/** 
 * 弧度法の角度を度数法に変換する
 * @code (π) -> 180
 * @code (2π) -> 360
 */
export function rad_to_deg(rad: number): number {
    return 360 * rad / c.pi2;
}

/**
 * Factorial - 階乗
 * @code (1) -> 1
 * @code (2) -> 2
 * @code (3) -> 6
 * @code (4) -> 24
 */
export function factorial(n: number): number {
    return priv.reduce_mul(priv.sequence(n, 1));
}

/**
 * Combination - 組み合わせ
 * @code (6, 1) -> 6
 * @code (6, 2) -> 15
 * @code (6, 3) -> 20
 * @code (6, 4) -> 15
 */
export function combination(n: number, k: number): number {
    const k2 = Math.min(k, n - k);
    return priv.reduce_mul(priv.sequence(k2, n, -1)) / factorial(k2);
}

/**
 * 二次元配列を行列に見立てた転置
 * @code ([[1, 2], [3, 4]]) -> [[1, 3], [2, 4]]
 * @code ([[1, 2], [3, 4], [5, 6]]) -> [[1, 3, 5], [2, 4, 6]]
 */
export function transpose<T>(m1: T[][]): T[][] {
    const orderRC = m1.length;
    const orderCR = m1[0].length;
    const m: T[][] = new Array(orderCR);
    for (let cr = 0; cr < orderCR; cr++) {
        m[cr] = new Array(orderRC);
        for (let rc = 0; rc < orderRC; rc++) {
            m[cr][rc] = m1[rc][cr];
        }
    }
    return m;
}

type int = number;
type float = number;

/**
 * Bernstein basis - バーンスタイン基底関数
 * @param n     次数. 0以上の整数（3次ベジェ曲線では3）
 * @param i     0以上n以下の整数（3次ベジェ曲線では0, 1, 2, 3）
 * @param t
 */
export function bernstein_basis(n: int, i: int, t: float): float {
    return combination(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i);
}

/**
 * B-spline basis - Bスプライン基底関数
 * @param knot      ノットベクトル（数は制御点数+次数+1）
 * @param i         i = 0; i < 制御点数; i++
 * @param degree    次数（基本は2）（n+1は階数）
 * @param t 
 */
export function b_spline_basis(knot: float[], i: int, degree: int, t: float): float {
    if (degree <= 0) {
        return knot[i] <= t && t < knot[i+1] ? 1.0 : 0.0;
    } else {
        const n1 = (t - knot[i]) / (knot[i+degree] - knot[i]);
        const n2 = (knot[i+degree+1] - t) / (knot[i+degree+1] - knot[i+1]);
        return n1 * b_spline_basis(knot, i, degree-1, t) + n2 * b_spline_basis(knot, i+1, degree-1, t);
    }
}

/** 2関数の合成 */
export const compose_2f = <R, S, T>(a: (r: R) => S, b: (s: S) => T): (r: R) => T => (r: R) => b(a(r));
/** 3関数の合成 */
export const compose_3f = <R, S, T, U>(a: (r: R) => S, b: (s: S) => T, c: (t: T) => U): (r: R) => U => (r: R) => c(b(a(r)));

/**
 * @code (0) -> '00'
 * @code (255) -> 'ff'
 */
export function format_02x(n: number): string {
    return ('00' + Math.round(clamp(0, 255, n)).toString(16)).slice(-2);
}

/**
 * @code (1) -> '01'
 */
export const format_02d = (n: number): string => format_n(n, n => ('00' + n).slice(-2));
/**
 * @code (1) -> '001'
 */
export const format_03d = (n: number): string => format_n(n, n => ('000' + n).slice(-3));

/**
 * @code (0, 255, -10) -> 0
 * @code (0, 255, 100) -> 100
 * @code (0, 255, 300) -> 255
 */
export function clamp(min: number, max: number, n: number): number {
    return n < min ? min : n > max ? max : n;
}

export function format_n(n: number, f: (n: number) => string): string {
    let b = '';
    if (n < 0) { b = '-'; n = -n; }
    return b + f(n);
}

/** 非公開関数 */
namespace priv {
    export const reduce_mul = (n: number[]): number => n.reduce((a, b) => a * b, 1);

    export const sequence = (count: number, start: number = 0, diff: number = 1): number[] => {
        const seq: number[] = new Array(count);
        for (let i = 0, n = start; i < count; i++ , n += diff) {
            seq[i] = n;
        }
        return seq;
    };
}

/** 
 * サイン関数（Math.sinの引数は弧度法だが、こちらは度数法）
 */
export const sin_deg = compose_2f(deg_to_rad, Math.sin);
/**
 * コサイン関数（Math.cosの引数は弧度法だが、こちらは度数法）
 */
export const cos_deg = compose_2f(deg_to_rad, Math.cos);
/**
 * タンジェント関数（Math.tanの引数は弧度法だが、こちらは度数法）
 */
export const tan_deg = compose_2f(deg_to_rad, Math.tan);

/**
 * @code (0, 255, -1) -> false
 * @code (0, 255, 0) -> true
 * @code (0, 255, 100) -> true
 * @code (0, 255, 255) -> true
 * @code (0, 255, 256) -> false
 */
export function isin(min: number, max: number, n: number): boolean {
    return min <= n && n <= max;
}

/**
 * @code (true, true) -> false
 * @code (true, false) -> true
 * @code (false, true) -> true
 * @code (false, false) -> false
 */
export function xor(b1: boolean, b2: boolean): boolean {
    return b1 && b2 ? false : !(b1 || b2) ? false : true;
}

export function zip<A, B>(a: A[], b: B[]): [A, B][] {
    return priv.sequence(Math.max(a.length, b.length)).map(i => <[A, B]>[a[i], b[i]]);
}
