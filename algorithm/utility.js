"use strict";
// --------------------------------------------------------
// 定数
Object.defineProperty(exports, "__esModule", { value: true });
/** Square Root of 2 - 2の平方根 (≒ 1.414) */
exports.r2 = Math.sqrt(2);
/** Square Root of 3 - 3の平方根 (≒ 1.732) */
exports.r3 = Math.sqrt(3);
/** Square Root of 5 - 5の平方根 (≒ 2.236) */
exports.r5 = Math.sqrt(5);
/** 円周率 (≒ 3.14) */
exports.pi = Math.PI;
/** 円周率の2倍 (≒ 6.28) */
exports.pi2 = exports.pi * 2;
/** 弧度法における360度 (≒ 6.28) */
exports.deg360 = exports.pi2;
/** 弧度法における180度 (≒ 3.14) */
exports.deg180 = exports.pi;
/** 弧度法における90度 (≒ 1.57) */
exports.deg90 = exports.pi / 2;
/** 弧度法における60度 (≒ 1.05) */
exports.deg60 = exports.pi / 3;
/** 弧度法における45度 (≒ 0.79) */
exports.deg45 = exports.pi / 4;
/** 弧度法における30度 (≒ 0.52) */
exports.deg30 = exports.pi / 6;
/** 弧度法における15度 (≒ 0.26) */
exports.deg15 = exports.pi / 12;
/** 弧度法における5度 (≒ 0.087) */
exports.deg5 = exports.pi / 36;
/** 弧度法における1度 (≒ 0.01745) */
exports.deg1 = exports.pi / 180;
/** Golden Ratio - 黄金比 (≒ 1.618) */
exports.phi = (1 + exports.r5) / 2;
// --------------------------------------------------------
// 関数
/**
 * 度数法の角度を弧度法に変換
 * (0) -> 0
 * (180) -> 3.14
 * (360) -> 6.28
 */
exports.deg_to_rad = function (deg) { return exports.pi2 * deg / 360; };
/**
 * 弧度法の角度を度数法に変換
 * (0) -> 0
 * (3.14) -> 180
 * (6.28) -> 360
 */
exports.rad_to_deg = function (rad) { return 360 * rad / exports.pi2; };
/**
 * Factorial - 階乗
 * (0) -> 1
 * (1) -> 1
 * (2) -> 2
 * (3) -> 6
 * (4) -> 24
 * (5) -> 120
 */
exports.factorial = function (n) { return priv.reduce_mul(priv.sequence(n, 1)); };
/**
 * Combination - 組み合わせ
 * (5, 0) -> 1
 * (5, 1) -> 5
 * (5, 2) -> 10
 * (5, 3) -> 10
 * (5, 4) -> 5
 * (5, 5) -> 1
 */
function combination(n, k) {
    var k2 = Math.min(k, n - k);
    return priv.reduce_mul(priv.sequence(k2, n, -1)) / exports.factorial(k2);
}
exports.combination = combination;
/**
 * 二次元配列を行列に見立てた転置
 * ([[1, 2], [3, 4], [5, 6]]) -> [[1, 3, 5], [2, 4, 6]]
 */
function transpose(m1) {
    var orderRC = m1.length;
    var orderCR = m1[0].length;
    var m = new Array(orderCR);
    for (var cr = 0; cr < orderCR; cr++) {
        m[cr] = new Array(orderRC);
        for (var rc = 0; rc < orderRC; rc++) {
            m[cr][rc] = m1[rc][cr];
        }
    }
    return m;
}
exports.transpose = transpose;
/**
 * Bernstein basis - バーンスタイン基底関数
 * @param n     次数. 0以上の整数（3次ベジェ曲線では3）
 * @param i     0以上n以下の整数（3次ベジェ曲線では0, 1, 2, 3）
 * @param t
 */
function bernstein_basis(n, i, t) {
    return combination(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i);
}
exports.bernstein_basis = bernstein_basis;
/**
 * B-spline basis - Bスプライン基底関数
 * @param knot      ノットベクトル（数は制御点数+次数+1）
 * @param i         i = 0; i < 制御点数; i++
 * @param degree    次数（基本は2）（n+1は階数）
 * @param t
 */
function b_spline_basis(knot, i, degree, t) {
    if (degree <= 0) {
        return knot[i] <= t && t < knot[i + 1] ? 1.0 : 0.0;
    }
    else {
        var n1 = (t - knot[i]) / (knot[i + degree] - knot[i]);
        var n2 = (knot[i + degree + 1] - t) / (knot[i + degree + 1] - knot[i + 1]);
        return n1 * b_spline_basis(knot, i, degree - 1, t) + n2 * b_spline_basis(knot, i + 1, degree - 1, t);
    }
}
exports.b_spline_basis = b_spline_basis;
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
exports.compose_2f = function (a, b) { return function (r) { return b(a(r)); }; };
/** 3関数の合成 */
exports.compose_3f = function (a, b, c) { return function (r) { return c(b(a(r))); }; };
/** 0 -> '00', 255 -> 'ff' */
exports.format_02x = function (n) { return ('00' + Math.round(clamp(n, 0, 255)).toString(16)).slice(-2); };
function clamp(n, min, max) {
    return n < min ? min : n > max ? max : n;
}
exports.clamp = clamp;
function format_n(n, f) {
    var b = '';
    if (n < 0) {
        b = '-';
        n = -n;
    }
    return b + f(n);
}
exports.format_n = format_n;
exports.format_02d = function (n) { return format_n(n, function (n) { return ('00' + n).slice(-2); }); };
exports.format_03d = function (n) { return format_n(n, function (n) { return ('000' + n).slice(-3); }); };
exports.format_01f = function (n) { return format_n(n, function (n) { return Math.floor(n) + "." + Math.floor(n * 10) % 10; }); };
exports.format_02f = function (n) { return format_n(n, function (n) { return Math.floor(n) + "." + exports.format_02d(Math.floor(n * 100) % 100); }); };
exports.format_03f = function (n) { return format_n(n, function (n) { return Math.floor(n) + "." + exports.format_03d(Math.floor(n * 1000) % 1000); }); };
/** 非公開関数 */
var priv;
(function (priv) {
    priv.reduce_mul = function (n) { return n.reduce(function (a, b) { return a * b; }, 1); };
    priv.sequence = function (count, start, diff) {
        if (start === void 0) { start = 0; }
        if (diff === void 0) { diff = 1; }
        var seq = new Array(count);
        for (var i = 0, n = start; i < count; i++, n += diff) {
            seq[i] = n;
        }
        return seq;
    };
})(priv || (priv = {}));
/** サイン関数（引数は360で一周の度数法） */
exports.sin_deg = exports.compose_2f(exports.deg_to_rad, Math.sin);
/** コサイン関数（引数は360で一周の度数法） */
exports.cos_deg = exports.compose_2f(exports.deg_to_rad, Math.cos);
/** タンジェント関数（引数は360で一周の度数法） */
exports.tan_deg = exports.compose_2f(exports.deg_to_rad, Math.tan);
