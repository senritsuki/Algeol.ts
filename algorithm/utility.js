"use strict";
// --------------------------------------------------------
// 基本演算
// ※自作に挑戦しようとも考えたが、組み込みMathオブジェクトを使う
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math
Object.defineProperty(exports, "__esModule", { value: true });
/** = Math.sqrt */
exports.sqrt = Math.sqrt;
/** = Math.pow */
exports.pow = Math.pow;
/** = Math.cos */
exports.cos = Math.cos;
/** = Math.sin */
exports.sin = Math.sin;
/** = Math.acos */
exports.acos = Math.acos;
/** = Math.atan2 */
exports.atan2 = Math.atan2;
/** = Math.min */
exports.min = Math.min;
/** = Math.max */
exports.max = Math.max;
/** = Math.floor */
exports.floor = Math.floor;
/** = Math.ceil */
exports.ceil = Math.ceil;
/** = Math.round */
exports.round = Math.round;
/** = Math.abs */
exports.abs = Math.abs;
// --------------------------------------------------------
// 定数
/** Square Root of 2 - 2の平方根 (≒ 1.414) */
exports.r2 = exports.sqrt(2);
/** Square Root of 3 - 3の平方根 (≒ 1.732) */
exports.r3 = exports.sqrt(3);
/** Square Root of 5 - 5の平方根 (≒ 2.236) */
exports.r5 = exports.sqrt(5);
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
    var k2 = exports.min(k, n - k);
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
