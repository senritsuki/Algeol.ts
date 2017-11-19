"use strict";
/** Sequence - 数列 */
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("./utility");
/**
 * Arithmetic Sequence - 等差数列
 * <ul>
 * <li> arith(5) -> [0, 1, 2, 3, 4]
 * <li> arith(3, 11) -> [11, 12, 13]
 * <li> arith(6, 1.0, -0.2) -> [1.0, 0.8, 0.6, 0.4, 0.2, 0.0]
 * </ul>
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
 * <ul>
 * <li> geo(5) -> [1, 2, 4, 8, 16]
 * <li> geo(3, 5) -> [5, 10, 20]
 * <li> geo(4, 1, 10) -> [1, 10, 100, 1000]
 * </ul>
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
/**
 * Recurrence Relation - 初期値1つの漸化式による数列
 * <ul>
 * <li> recurrence_relation_1(5, 1, n=>n+1) -> [1, 2, 3, 4, 5]
 * <li> recurrence_relation_1(4, 2, n=>n*2) -> [2, 4, 8, 16]
 * <li> recurrence_relation_1(6, 0, n=>n*2+1) -> [0, 1, 3, 7, 15, 31]
 * </ul>
 */
function recurrence_relation_1(count, n0, lambda) {
    var ini = [n0];
    var seq = new Array(count);
    var count2 = ut.min(count, ini.length);
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
 * <ul>
 * <li> recurrence_relation_2(12, 0, 1, (a,b)=>a+b) -> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
 * </ul>
 */
function recurrence_relation_2(count, n0, n1, lambda) {
    var ini = [n0, n1];
    var seq = new Array(count);
    var count2 = ut.min(count, ini.length);
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
 * <ul>
 * <li> fibonacci(1) -> [0]
 * <li> fibonacci(6) -> [0, 1, 1, 2, 3, 5]
 * <li> fibonacci(12) -> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
 * </ul>
 */
function fibonacci(count) {
    return recurrence_relation_2(count, 0, 1, function (n0, n1) { return n0 + n1; });
}
exports.fibonacci = fibonacci;
/**
 * Binomial Coefficients - 2項係数の数列
 * <ul>
 * <li> binomial_coefficients(0) -> [1]
 * <li> binomial_coefficients(1) -> [1, 1]
 * <li> binomial_coefficients(2) -> [1, 2, 1]
 * <li> binomial_coefficients(3) -> [1, 3, 3, 1]
 * <li> binomial_coefficients(4) -> [1, 4, 6, 4, 1]
 * </ul>
 */
function binomial_coefficients(n) {
    return arith(n + 1).map(function (i) { return ut.combination(n, i); });
}
exports.binomial_coefficients = binomial_coefficients;
/**
 * n次バーンスタイン基底関数のブレンディング関数？の数列
 * <ul>
 * <li> bernstein(2, 0/4) -> [1, 0, 0]
 * <li> bernstein(2, 1/4) -> [9/16, 6/16, 1/16]
 * <li> bernstein(2, 2/4) -> [1/4, 2/4, 1/4]
 * <li> bernstein(2, 4/4) -> [0, 0, 1]
 * <li> bernstein(3, 0/4) -> [1, 0, 0, 0]
 * <li> bernstein(3, 1/4) -> [27/64, 27/64, 9/64, 1/64]
 * <li> bernstein(3, 2/4) -> [1/8, 3/8, 3/8, 1/8]
 * <li> bernstein(3, 4/4) -> [0, 0, 0, 1]
 * </ul>
 */
function bernstein(n, x) {
    return binomial_coefficients(n)
        .map(function (d, i) { return d * ut.pow(1 - x, n - i) * ut.pow(x, i); });
}
exports.bernstein = bernstein;
