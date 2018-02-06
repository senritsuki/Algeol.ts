/** Utility - 便利な定数・関数 */

export * from './utility_const';

import * as c from './utility_const';

export function normalize_rad(rad: number): number {
    rad %= c.pi2;
    if (c.pi2 < 0) rad += c.pi2;
    return rad;
}
export function normalize_deg(deg: number): number {
    deg %= 360;
    if (deg < 0) deg += 360;
    return deg;
}

/**
 * 度数法の角度を弧度法に変換
 * (0) -> 0
 * (180) -> 3.14
 * (360) -> 6.28
 */
export const deg_to_rad = (deg: number): number => c.pi2 * deg / 360;

/** 
 * 弧度法の角度を度数法に変換
 * (0) -> 0
 * (3.14) -> 180
 * (6.28) -> 360
 */
export const rad_to_deg = (rad: number): number => 360 * rad / c.pi2;

/**
 * Factorial - 階乗
 * (0) -> 1
 * (1) -> 1
 * (2) -> 2
 * (3) -> 6
 * (4) -> 24
 * (5) -> 120
 */
export const factorial = (n: number): number => priv.reduce_mul(priv.sequence(n, 1));

/**
 * Combination - 組み合わせ
 * (5, 0) -> 1
 * (5, 1) -> 5
 * (5, 2) -> 10
 * (5, 3) -> 10
 * (5, 4) -> 5
 * (5, 5) -> 1
 */
export function combination(n: number, k: number): number {
    const k2 = Math.min(k, n - k);
    return priv.reduce_mul(priv.sequence(k2, n, -1)) / factorial(k2);
}

/**
 * 二次元配列を行列に見立てた転置
 * ([[1, 2], [3, 4], [5, 6]]) -> [[1, 3, 5], [2, 4, 6]]
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

/** 0 -> '00', 255 -> 'ff' */
export const format_02x = (n: number): string => ('00' + Math.round(clamp(n, 0, 255)).toString(16)).slice(-2);

export function clamp(n: number, min: number, max: number): number {
    return n < min ? min : n > max ? max : n;
}
export function format_n(n: number, f: (n: number) => string): string {
    let b = '';
    if (n < 0) { b = '-'; n = -n; }
    return b + f(n);
}

/** 1 -> '01' */
export const format_02d = (n: number): string => format_n(n, n => ('00' + n).slice(-2));
/** 1 -> '001' */
export const format_03d = (n: number): string => format_n(n, n => ('000' + n).slice(-3));

/** 3.1415 -> '3.1' */
export const format_01f = (n: number): string => format_n(n, n => `${Math.floor(n)}.${Math.floor(n*10)%10}`);
/** 3.1415 -> '3.14' */
export const format_02f = (n: number): string => format_n(n, n => `${Math.floor(n)}.${format_02d(Math.floor(n*100)%100)}`);
/** 3.1415 -> '3.141' */
export const format_03f = (n: number): string => format_n(n, n => `${Math.floor(n)}.${format_03d(Math.floor(n*1000)%1000)}`);

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

/** サイン関数（引数は360で一周の度数法） */
export const sin_deg = compose_2f(deg_to_rad, Math.sin);
/** コサイン関数（引数は360で一周の度数法） */
export const cos_deg = compose_2f(deg_to_rad, Math.cos);
/** タンジェント関数（引数は360で一周の度数法） */
export const tan_deg = compose_2f(deg_to_rad, Math.tan);

export function isin(min: number, max: number, n: number): boolean {
    return min <= n && n <= max;
}
