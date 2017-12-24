

// --------------------------------------------------------
// 定数

/** Square Root of 2 - 2の平方根 (≒ 1.414) */
export const r2 = Math.sqrt(2);
/** Square Root of 3 - 3の平方根 (≒ 1.732) */
export const r3 = Math.sqrt(3);
/** Square Root of 5 - 5の平方根 (≒ 2.236) */
export const r5 = Math.sqrt(5);

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

/*
# バーンスタイン基底関数
def bernstein_basis(n: int, i: int, t: float) -> float:
    return combination(n, i) * np.power(t, i) * np.power(1-t, n-i)

# B-スプライン基底関数
# @param n: 次数+1  3次曲線の場合は4
def b_spline_basis(T: list, i: int, n: int, t: float) -> float:
    if n <= 0:
        if T[i] <= t and t < T[i+1]:
            return 1.0
        else:
            return 0.0
    else:
        n1 = (t - T[i]) / (T[i+n] - T[i])
        n2 = (T[i+n+1] - t) / (T[i+n+1] - T[i+1])
        return n1 * b_spline_basis(T, i, n-1, t) + n2 * b_spline_basis(T, i+1, n-1, t)

# ベジェ曲線
# @param B: 制御点vのリスト  vはnp.arrayのベクトルとする
# @param t: 時刻  値域は 0.0 .. 1.0
# @return tに対応する位置v
def besier(B: list, t: float) -> np.array:
    N = len(B) - 1  # ベジェ曲線の次元 制御点が4つの場合、3次ベジェ曲線となる
    p = np.array([0. for i in range(len(B[0]))])  # zero vector
    for i in range(len(B)):
        p += B[i] * bernstein_basis(N, i, t)
    return p

# B-スプライン曲線
# @param P: 制御点vのリスト  vはnp.arrayのベクトルとする
# @param T: ノットtのリスト  tは実数であり昇順であること T[i]<=T[i+1]
# @param t: 時刻   値域は T[n] .. T[-n-1]  3次の場合、先頭と末尾の3つずつを除外するイメージ
# @return tに対応する位置v
def b_spline(P: list, T: list, t: float) -> np.array:
    N = len(T) - len(P) - 1  # degree, ノット数T=制御点数P+次元数N+1
    p = np.array([0. for i in range(len(P[0]))])  # zero vector
    for i in range(len(P)):
        p += P[i] * b_spline_basis(T, i, N, t)
    return p
*/

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

export const format_02d = (n: number): string => format_n(n, n => ('00' + n).slice(-2));
export const format_03d = (n: number): string => format_n(n, n => ('000' + n).slice(-3));

export const format_01f = (n: number): string => format_n(n, n => `${Math.floor(n)}.${Math.floor(n*10)%10}`);
export const format_02f = (n: number): string => format_n(n, n => `${Math.floor(n)}.${format_02d(Math.floor(n*100)%100)}`);
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

