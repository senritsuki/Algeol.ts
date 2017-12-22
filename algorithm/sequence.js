"use strict";
/** Sequence - 数列 */
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("./utility");
/**
 * Arithmetic Sequence - 等差数列
 * (4) -> [0, 1, 2, 3]
 * (4, 5) -> [5, 6, 7, 8]
 * (4, 5, -1) -> [5, 4, 3, 2]
 */
function arith(count, start, diff) {
    if (start === void 0) { start = 0; }
    if (diff === void 0) { diff = 1; }
    var seq = new Array(count);
    for (var i = 0, n = start; i < count; i++, n += diff) {
        seq[i] = n;
    }
    return seq;
}
exports.arith = arith;
/**
 * Geometric Sequence - 等比数列
 * (4) -> [1, 2, 4, 8]
 * (4, 5) -> [5, 10, 20, 40]
 * (4, 5, 3) -> [5, 15, 45, 135]
 */
function geo(count, start, ratio) {
    if (start === void 0) { start = 1; }
    if (ratio === void 0) { ratio = 2; }
    var seq = new Array(count);
    for (var i = 0, n = start; i < count; i++, n *= ratio) {
        seq[i] = n;
    }
    return seq;
}
exports.geo = geo;
function range_step(first, last, step) {
    var seq = new Array(Math.floor((last - first) / step) + 1);
    for (var i = 0, n = first; n <= last; i++, n += step) {
        seq[i] = n;
    }
    return seq;
}
exports.range_step = range_step;
/**
 * (5, 10, 3) -> [5, 7.5, 10]
 */
function range(first, last, count) {
    var seq = new Array(count);
    for (var i = 0; i < count; i++) {
        var r = i / (count - 1); // 0.0 ... 1.0
        var n = (1 - r) * first + r * last;
        seq[i] = n;
    }
    return seq;
}
exports.range = range;
/**
 * Recurrence Relation - 初期値1つの漸化式による数列
 * (3, 1, n=>n+1) -> [1, 2, 3]
 * (4, 2, n=>n*2) -> [2, 4, 8, 16]
 * (5, 0, n=>n*2+1) -> [0, 1, 3, 7, 15]
 */
function recurrence_relation_1(count, n0, lambda) {
    var ini = [n0];
    var seq = new Array(count);
    var count2 = Math.min(count, ini.length);
    for (var i = 0; i < count2; i++) {
        seq[i] = ini[i];
    }
    for (var i = ini.length; i < count; i++) {
        seq[i] = lambda(seq[i - 1]);
    }
    return seq;
}
exports.recurrence_relation_1 = recurrence_relation_1;
/**
 * Recurrence Relation - 初期値2つの漸化式による数列
 * (12, 0, 1, (a,b)=>a+b) -> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
 */
function recurrence_relation_2(count, n0, n1, lambda) {
    var ini = [n0, n1];
    var seq = new Array(count);
    var count2 = Math.min(count, ini.length);
    for (var i = 0; i < count2; i++) {
        seq[i] = ini[i];
    }
    for (var i = ini.length; i < count; i++) {
        seq[i] = lambda(seq[i - 2], seq[i - 1]);
    }
    return seq;
}
exports.recurrence_relation_2 = recurrence_relation_2;
/**
 * Fibonacci Sequence - フィボナッチ数列
 * (1) -> [0]
 * (6) -> [0, 1, 1, 2, 3, 5]
 * (12) -> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
 */
function fibonacci(count) {
    return recurrence_relation_2(count, 0, 1, function (n0, n1) { return n0 + n1; });
}
exports.fibonacci = fibonacci;
/**
 * Binomial Coefficients - 2項係数の数列
 * (0) -> [1]
 * (1) -> [1, 1]
 * (2) -> [1, 2, 1]
 * (3) -> [1, 3, 3, 1]
 * (4) -> [1, 4, 6, 4, 1]
 */
function binomial_coefficients(n) {
    return arith(n + 1).map(function (i) { return ut.combination(n, i); });
}
exports.binomial_coefficients = binomial_coefficients;
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
function bernstein_basis(n, t) {
    //return binomial_coefficients(n).map((d, i) => d * ut.pow(1 - t, n - i) * ut.pow(t, i));
    return arith(n + 1).map(function (i) { return ut.bernstein_basis(n, i, t); });
}
exports.bernstein_basis = bernstein_basis;
