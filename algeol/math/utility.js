// MathのProxy
exports.sqrt = Math.sqrt;
exports.pow = Math.pow;
exports.cos = Math.cos;
exports.sin = Math.sin;
exports.acos = Math.acos;
exports.atan2 = Math.atan2;
exports.min = Math.min;
exports.max = Math.max;
exports.floor = Math.floor;
/** Square Root of 2 - 2の平方根 */
exports.r2 = exports.sqrt(2);
/** Square Root of 3 - 3の平方根 */
exports.r3 = exports.sqrt(3);
/** Square Root of 5 - 5の平方根 */
exports.r5 = exports.sqrt(5);
/** 円周率 */
exports.pi = Math.PI;
/** 円周率の2倍 */
exports.pi2 = exports.pi * 2;
exports.deg360 = exports.pi2;
exports.deg180 = exports.pi;
exports.deg90 = exports.pi / 2;
exports.deg60 = exports.pi / 3;
exports.deg45 = exports.pi / 4;
exports.deg30 = exports.pi / 6;
exports.deg15 = exports.pi / 12;
exports.deg5 = exports.pi / 36;
exports.deg1 = exports.pi / 180;
/** Golden Ratio - 黄金比 */
exports.phi = (1 + exports.r5) / 2;
/** (角度:度数法) -> 角度:弧度法 */
function deg_rad(deg) { return exports.pi2 * deg / 360; }
exports.deg_rad = deg_rad;
/** (角度:弧度法) -> 角度:度数法 */
function rad_deg(rad) { return 360 * rad / exports.pi2; }
exports.rad_deg = rad_deg;
function mulall(n) {
    return n.reduce(function (a, b) { return a * b; }, 1);
}
/** Factorial - 階乗 */
function factorial(n) {
    return mulall(seq.arith(n, 1));
}
exports.factorial = factorial;
/** Combination - 組み合わせ */
function combination(n, k) {
    var k2 = exports.min(k, n - k);
    return mulall(seq.arith(k2, n, -1)) / factorial(k2);
}
exports.combination = combination;
/** 数列 */
var seq;
(function (seq_1) {
    /** Arithmetic Sequence - 等差数列 */
    function arith(count, start, diff) {
        if (start === void 0) { start = 0; }
        if (diff === void 0) { diff = 1; }
        var seq = new Array(count);
        for (var i = 0, n = start; i < count; i++, n += diff) {
            seq[i] = n;
        }
        return seq;
    }
    seq_1.arith = arith;
    /** Geometric Sequence - 等比数列 */
    function geo(count, start, ratio) {
        if (start === void 0) { start = 1; }
        if (ratio === void 0) { ratio = 2; }
        var seq = new Array(count);
        for (var i = 0, n = start; i < count; i++, n *= ratio) {
            seq[i] = n;
        }
        return seq;
    }
    seq_1.geo = geo;
    /** Recurrence Relation - 1階漸化式による数列 */
    function recurrenceRelation1(count, n0, lambda) {
        var ini = [n0];
        var seq = new Array(count);
        var count2 = exports.min(count, ini.length);
        for (var i = 0; i < count2; i++) {
            seq[i] = ini[i];
        }
        for (var i = ini.length; i < count; i++) {
            seq[i] = lambda(seq[i - 1]);
        }
        return seq;
    }
    seq_1.recurrenceRelation1 = recurrenceRelation1;
    /** Recurrence Relation - 2階漸化式による数列 */
    function recurrenceRelation2(count, n0, n1, lambda) {
        var ini = [n0, n1];
        var seq = new Array(count);
        var count2 = exports.min(count, ini.length);
        for (var i = 0; i < count2; i++) {
            seq[i] = ini[i];
        }
        for (var i = ini.length; i < count; i++) {
            seq[i] = lambda(seq[i - 2], seq[i - 1]);
        }
        return seq;
    }
    seq_1.recurrenceRelation2 = recurrenceRelation2;
    /** Fibonacci Sequence - フィボナッチ数列 */
    function fibonacci(count) {
        return recurrenceRelation2(count, 0, 1, function (n0, n1) { return n0 + n1; });
    }
    seq_1.fibonacci = fibonacci;
    /** Binomial Coefficients - 2項係数の数列 */
    function binomialCoefficients(n) {
        return arith(n + 1).map(function (i) { return combination(n, i); });
    }
    seq_1.binomialCoefficients = binomialCoefficients;
    /** n次バーンスタイン基底関数のブレンディング関数の数列 */
    function bernstein(n, x) {
        return binomialCoefficients(n).map(function (d, i) { return d * exports.pow(1 - x, n - i) * exports.pow(x, i); });
    }
    seq_1.bernstein = bernstein;
})(seq = exports.seq || (exports.seq = {}));
/** 二次元配列を行列に見立てた転置 */
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
//# sourceMappingURL=utility.js.map