"use strict";
/** Utility - 便利な定数・関数 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./utility_const"));
var c = require("./utility_const");
function normalize_rad(rad) {
    rad %= c.pi2;
    if (c.pi2 < 0)
        rad += c.pi2;
    return rad;
}
exports.normalize_rad = normalize_rad;
function normalize_deg(deg) {
    deg %= 360;
    if (deg < 0)
        deg += 360;
    return deg;
}
exports.normalize_deg = normalize_deg;
/**
 * 度数法の角度を弧度法に変換
 * (0) -> 0
 * (180) -> 3.14
 * (360) -> 6.28
 */
exports.deg_to_rad = function (deg) { return c.pi2 * deg / 360; };
/**
 * 弧度法の角度を度数法に変換
 * (0) -> 0
 * (3.14) -> 180
 * (6.28) -> 360
 */
exports.rad_to_deg = function (rad) { return 360 * rad / c.pi2; };
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
/** 1 -> '01' */
exports.format_02d = function (n) { return format_n(n, function (n) { return ('00' + n).slice(-2); }); };
/** 1 -> '001' */
exports.format_03d = function (n) { return format_n(n, function (n) { return ('000' + n).slice(-3); }); };
/** 3.1415 -> '3.1' */
exports.format_01f = function (n) { return format_n(n, function (n) { return Math.floor(n) + "." + Math.floor(n * 10) % 10; }); };
/** 3.1415 -> '3.14' */
exports.format_02f = function (n) { return format_n(n, function (n) { return Math.floor(n) + "." + exports.format_02d(Math.floor(n * 100) % 100); }); };
/** 3.1415 -> '3.141' */
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
function isin(min, max, n) {
    return min <= n && n <= max;
}
exports.isin = isin;
function xor(b1, b2) {
    return b1 && b2 ? false : !(b1 || b2) ? false : true;
}
exports.xor = xor;
