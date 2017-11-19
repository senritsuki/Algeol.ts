
// --------------------------------------------------------
// 基本演算
// ※自作に挑戦しようとも考えたが、組み込みMathオブジェクトを使う
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math

/** = Math.sqrt */
export const sqrt = Math.sqrt;
/** = Math.pow */
export const pow = Math.pow;
/** = Math.cos */
export const cos = Math.cos;
/** = Math.sin */
export const sin = Math.sin;
/** = Math.acos */
export const acos = Math.acos;
/** = Math.atan2 */
export const atan2 = Math.atan2;
/** = Math.min */
export const min = Math.min;
/** = Math.max */
export const max = Math.max;
/** = Math.floor */
export const floor = Math.floor;
/** = Math.ceil */
export const ceil = Math.ceil;
/** = Math.round */
export const round = Math.round;
/** = Math.abs */
export const abs = Math.abs;


// --------------------------------------------------------
// 定数

/** Square Root of 2 - 2の平方根 (≒ 1.414) */
export const r2 = sqrt(2);
/** Square Root of 3 - 3の平方根 (≒ 1.732) */
export const r3 = sqrt(3);
/** Square Root of 5 - 5の平方根 (≒ 2.236) */
export const r5 = sqrt(5);

/** 円周率 (≒ 3.14) */
export const pi = Math.PI;
/** 円周率の2倍 (≒ 6.28) */
export const pi2 = pi * 2;

/** 弧度法における360度 (≒ 6.28) */
export const deg360 = pi2;
/** 弧度法における180度 (≒ 3.14) */
export const deg180 = pi;
/** 弧度法における90度 (≒ 1.57) */
export const deg90 = pi / 2;
/** 弧度法における60度 (≒ 1.05) */
export const deg60 = pi / 3;
/** 弧度法における45度 (≒ 0.79) */
export const deg45 = pi / 4;
/** 弧度法における30度 (≒ 0.52) */
export const deg30 = pi / 6;
/** 弧度法における15度 (≒ 0.26) */
export const deg15 = pi / 12;
/** 弧度法における5度 (≒ 0.087) */
export const deg5 = pi / 36;
/** 弧度法における1度 (≒ 0.01745) */
export const deg1 = pi / 180;

/** Golden Ratio - 黄金比 (≒ 1.618) */
export const phi = (1 + r5) / 2;


// --------------------------------------------------------
// 関数

/**
 * 度数法の角度を弧度法に変換
 * (0) -> 0
 * (180) -> 3.14
 * (360) -> 6.28
 */
export const deg_to_rad = (deg: number): number => pi2 * deg / 360;

/** 
 * 弧度法の角度を度数法に変換
 * (0) -> 0
 * (3.14) -> 180
 * (6.28) -> 360
 */
export const rad_to_deg = (rad: number): number => 360 * rad / pi2;

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
    const k2 = min(k, n - k);
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
