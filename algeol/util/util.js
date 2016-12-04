// MathのProxy
exports.sqrt = Math.sqrt;
exports.cos = Math.cos;
exports.sin = Math.sin;
exports.acos = Math.acos;
exports.atan2 = Math.atan2;
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
/** Golden Ratio - 黄金比 */
exports.phi = (1 + exports.r5) / 2;
/** (角度:度数法) -> 角度:弧度法 */
function deg_rad(deg) { return exports.pi2 * deg / 360; }
exports.deg_rad = deg_rad;
/** (角度:弧度法) -> 角度:度数法 */
function rad_deg(rad) { return 360 * rad / exports.pi2; }
exports.rad_deg = rad_deg;
/** Arithmetic Sequence - 等差数列 */
function arith(count, start, step) {
    if (start === void 0) { start = 0; }
    if (step === void 0) { step = 1; }
    var seq = new Array(count);
    for (var i = 0, n = start; i < count; i++, n += step) {
        seq[i] = n;
    }
    return seq;
}
exports.arith = arith;
var ArithmeticSequence = (function () {
    function ArithmeticSequence(_count, _start, _step) {
        this._count = _count;
        this._start = _start;
        this._step = _step;
    }
    ArithmeticSequence.prototype.seq = function () {
        return arith(this._count, this._start, this._step);
    };
    ArithmeticSequence.prototype.toJSON = function () {
        return {
            "object": "ArithmeticSequence",
            "count": this._count,
            "start": this._start,
            "step": this._step,
        };
    };
    ArithmeticSequence.prototype.toString = function () {
        return JSON.stringify(this.toJSON());
    };
    return ArithmeticSequence;
})();
function arithObj(count, start, step) {
    if (start === void 0) { start = 0; }
    if (step === void 0) { step = 1; }
    return new ArithmeticSequence(count, start, step);
}
exports.arithObj = arithObj;
//# sourceMappingURL=util.js.map