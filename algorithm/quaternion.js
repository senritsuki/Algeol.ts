"use strict";
/** Quaternion - クォータニオン・四元数 */
Object.defineProperty(exports, "__esModule", { value: true });
var vc = require("./vector");
var mx = require("./matrix");
var QuaternionImpl = /** @class */ (function () {
    function QuaternionImpl(real, imag) {
        this._v = [real, imag[0], imag[1], imag[2]];
    }
    // 取得
    QuaternionImpl.prototype.array = function () {
        return this._v.slice(0);
    };
    QuaternionImpl.prototype.r = function () {
        return this._v[0];
    };
    QuaternionImpl.prototype.i = function () {
        return this._v.slice(1);
    };
    QuaternionImpl.prototype.clone = function () {
        return new QuaternionImpl(this.r(), this.i());
    };
    // 単項演算
    QuaternionImpl.prototype.conjugate = function () {
        return new QuaternionImpl(this.r(), vc.scalar(this.i(), -1));
    };
    QuaternionImpl.prototype.abs2 = function () {
        return vc.ip(this._v, this._v);
    };
    QuaternionImpl.prototype.abs = function () {
        return Math.sqrt(this.abs2());
    };
    QuaternionImpl.prototype.invAdd = function () {
        return this.scalar(-1);
    };
    QuaternionImpl.prototype.invMul = function () {
        return this.conjugate().scalar(1 / this.abs2());
    };
    QuaternionImpl.prototype.unit = function () {
        return this.scalar(1 / this.abs());
    };
    // 変換
    QuaternionImpl.prototype.mx3 = function () {
        var r = this.r();
        var i = this.i();
        var x = i[0];
        var y = i[1];
        var z = i[2];
        var row1 = [
            1 - 2 * (y * y + z * z),
            2 * (x * y - r * z),
            2 * (x * z + r * y),
        ];
        var row2 = [
            2 * (y * x + r * z),
            1 - 2 * (x * x + z * z),
            2 * (y * z - r * x),
        ];
        var row3 = [
            2 * (z * x - r * y),
            2 * (z * y + r * x),
            1 - 2 * (x * x + y * y),
        ];
        return mx.rows_to_m3([row1, row2, row3]);
    };
    // 二項演算
    QuaternionImpl.prototype.add = function (dist) {
        var r = this.r() + dist.r();
        var i = vc.add(this.i(), dist.i());
        return new QuaternionImpl(r, i);
    };
    QuaternionImpl.prototype.sub = function (dist) {
        var r = this.r() + dist.r();
        var i = vc.sub(this.i(), dist.i());
        return new QuaternionImpl(r, i);
    };
    QuaternionImpl.prototype.mul = function (dist) {
        var r1 = this.r();
        var r2 = dist.r();
        var i1 = this.i();
        var i2 = dist.i();
        var r = r1 * r2 - vc.ip(i1, i2);
        var i_1 = vc.scalar(i2, r1);
        var i_2 = vc.scalar(i1, r2);
        var i_3 = vc.cp3(i1, i2);
        var i = vc.add(vc.add(i_1, i_2), i_3);
        return new QuaternionImpl(r, i);
    };
    QuaternionImpl.prototype.scalar = function (n) {
        var r = this.r() * n;
        var i = vc.scalar(this.i(), n);
        return new QuaternionImpl(r, i);
    };
    // 写像
    QuaternionImpl.prototype._mul3 = function (q1, q2, q3) {
        return q1.mul(q2).mul(q3);
    };
    QuaternionImpl.prototype.map_ar = function (v) {
        var q = this._mul3(this, new QuaternionImpl(0, v), this.invMul());
        return q.i();
    };
    QuaternionImpl.prototype.map_v3 = function (v) {
        return vc.array_to_v3(this.map_ar(v._v));
    };
    QuaternionImpl.prototype.map_v3ar = function (vl) {
        var _this = this;
        var q1 = this;
        var q3 = this.invMul();
        return vl
            .map(function (v) { return _this._mul3(q1, new QuaternionImpl(0, v._v), q3); })
            .map(function (q) { return vc.array_to_v3(q.i()); });
    };
    return QuaternionImpl;
}());
/** (実部, 虚部[0],[1],[2]からなる配列) -> クォータニオン */
function qt(real, imag) {
    return new QuaternionImpl(real, imag);
}
exports.qt = qt;
/** (実部, 虚部, 虚部, 虚部) -> クォータニオン */
function riii_qt(real, imag1, imag2, imag3) {
    return new QuaternionImpl(real, [imag1, imag2, imag3]);
}
exports.riii_qt = riii_qt;
/** (実部[0]と虚部[1],[2],[3]からなる配列) -> クォータニオン */
function ar_qt(v) {
    return new QuaternionImpl(v[0], v.slice(1));
}
exports.ar_qt = ar_qt;
