"use strict";
// Complex Number - 複素数・二元数
Object.defineProperty(exports, "__esModule", { value: true });
var vc = require("./vector");
var ComplexNumberImpl = (function () {
    function ComplexNumberImpl(real, imag) {
        this._v = [real, imag];
    }
    // 取得
    ComplexNumberImpl.prototype.array = function () {
        return this._v.slice(0);
    };
    ComplexNumberImpl.prototype.r = function () {
        return this._v[0];
    };
    ComplexNumberImpl.prototype.i = function () {
        return this._v[1];
    };
    ComplexNumberImpl.prototype.clone = function () {
        return new ComplexNumberImpl(this.r(), this.i());
    };
    // 単項演算
    ComplexNumberImpl.prototype.conjugate = function () {
        return new ComplexNumberImpl(this.r(), -this.i());
    };
    ComplexNumberImpl.prototype.abs2 = function () {
        return vc.ip(this._v, this._v);
    };
    ComplexNumberImpl.prototype.abs = function () {
        return Math.sqrt(this.abs2());
    };
    ComplexNumberImpl.prototype.polarRad = function () {
        return Math.atan2(this.i(), this.r());
    };
    ComplexNumberImpl.prototype.invAdd = function () {
        return this.scalar(-1);
    };
    ComplexNumberImpl.prototype.invMul = function () {
        return this.conjugate().scalar(1 / this.abs2());
    };
    ComplexNumberImpl.prototype.unit = function () {
        return this.scalar(1 / this.abs());
    };
    // 変換
    ComplexNumberImpl.prototype.v2 = function () {
        return vc.v2(this.r(), this.i());
    };
    // 二項演算
    ComplexNumberImpl.prototype.add = function (dist) {
        var v = vc.add(this._v, dist._v);
        return new ComplexNumberImpl(v[0], v[1]);
    };
    ComplexNumberImpl.prototype.sub = function (dist) {
        var v = vc.sub(this._v, dist._v);
        return new ComplexNumberImpl(v[0], v[1]);
    };
    ComplexNumberImpl.prototype.mul = function (dist) {
        var r = this.r() * dist.r() - this.i() * dist.i();
        var i = this.r() * dist.i() + this.r() * dist.i();
        return new ComplexNumberImpl(r, i);
    };
    ComplexNumberImpl.prototype.scalar = function (n) {
        var v = vc.scalar(this._v, n);
        return new ComplexNumberImpl(v[0], v[1]);
    };
    // 写像
    ComplexNumberImpl.prototype.map_ar = function (v) {
        return this.mul(new ComplexNumberImpl(v[0], v[1])).array();
    };
    ComplexNumberImpl.prototype.map_v2 = function (v) {
        return this.mul(new ComplexNumberImpl(v.x(), v.y())).v2();
    };
    ComplexNumberImpl.prototype.map_v2ar = function (vl) {
        var _this = this;
        return vl.map(function (v) { return _this.map_v2(v); });
    };
    return ComplexNumberImpl;
}());
/** (実部, 虚部) -> 複素数 */
function ri_cn(real, imag) {
    return new ComplexNumberImpl(real, imag);
}
exports.ri_cn = ri_cn;
/** (実部[0]と虚部[1]からなる配列) -> 複素数 */
function ar_cn(v) {
    return new ComplexNumberImpl(v[0], v[1]);
}
exports.ar_cn = ar_cn;
/** (実部xと虚部yからなる2次元ベクトル) -> 複素数 */
function v2_cn(v) {
    return new ComplexNumberImpl(v.x(), v.y());
}
exports.v2_cn = v2_cn;
/** (極形式の長さ, 極形式の偏角(radian)) -> 複素数 */
function polar_cn(r, rad) {
    return new ComplexNumberImpl(r * Math.cos(rad), r * Math.sin(rad));
}
exports.polar_cn = polar_cn;
