"use strict";
/** Vector - ベクトル */
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("./utility");
/** 関数 */
var fn;
(function (fn_1) {
    /** 配列の単項演算を行い、新しい配列を返す */
    function op1(a, dim, fn) {
        var v = [];
        for (var i = 0; i < dim; i++) {
            v.push(fn(a[i]));
        }
        return v;
    }
    fn_1.op1 = op1;
    /** 配列同士の二項演算を行い、新しい配列を返す */
    function op2(a, b, dim, fn) {
        var v = [];
        for (var i = 0; i < dim; i++) {
            v.push(fn(a[i], b[i]));
        }
        return v;
    }
    fn_1.op2 = op2;
    /** Addition 加算 */
    function add(a, b) {
        return op2(a, b, ut.min(a.length, b.length), function (n1, n2) { return n1 + n2; });
    }
    fn_1.add = add;
    /** Subtraction 減算 */
    function sub(a, b) {
        return op2(a, b, ut.min(a.length, b.length), function (n1, n2) { return n1 - n2; });
    }
    fn_1.sub = sub;
    /** スカラー倍 */
    function scalar(a, n) {
        return op1(a, a.length, function (n1) { return n1 * n; });
    }
    fn_1.scalar = scalar;
    /** 要素ごとの積, アダマール積 */
    function hadamart(a, b) {
        return op2(a, b, ut.min(a.length, b.length), function (n1, n2) { return n1 * n2; });
    }
    fn_1.hadamart = hadamart;
    /** Inner Product, Dot Product 内積 */
    function ip(a, b) {
        return hadamart(a, b).reduce(function (a, b) { return a + b; });
    }
    fn_1.ip = ip;
    /** Cross Product 2-D 外積（二次元） */
    function cp2(a, b) {
        return a[0] * b[1] - a[1] * b[0];
    }
    fn_1.cp2 = cp2;
    /** Cross Product 3-D 外積（三次元） */
    function cp3(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0],
        ];
    }
    fn_1.cp3 = cp3;
})(fn = exports.fn || (exports.fn = {}));
/** 非公開処理 */
var priv;
(function (priv) {
    var toArray = function (n) { return n instanceof Array ? n : n._v; };
    var V2Impl = (function () {
        function V2Impl(x, y) {
            var _this = this;
            // 取得
            this.array = function () { return _this._v.slice(0); };
            this.clone = function () { return new V2Impl(_this.x(), _this.y()); };
            this.x = function () { return _this._v[0]; };
            this.y = function () { return _this._v[1]; };
            // 単項演算
            this.unit = function () { return _this.scalar(1 / _this.length()); };
            this.lenght2 = function () { return _this.ip(_this); };
            this.length = function () { return ut.sqrt(_this.lenght2()); };
            // 二項演算
            this.add = function (dist) { return V2Impl.FromArray(fn.add(_this._v, toArray(dist))); };
            this.sub = function (dist) { return V2Impl.FromArray(fn.sub(_this._v, toArray(dist))); };
            this.hadamart = function (dist) { return V2Impl.FromArray(fn.hadamart(_this._v, toArray(dist))); };
            this.scalar = function (n) { return V2Impl.FromArray(fn.scalar(_this._v, n)); };
            this.ip = function (dist) { return fn.ip(_this.array(), toArray(dist)); };
            this.cp = function (dist) { return fn.cp2(_this._v, toArray(dist)); };
            this._v = [x, y];
        }
        V2Impl.FromArray = function (v) {
            return new V2Impl(v[0], v[1]);
        };
        return V2Impl;
    }());
    priv.V2Impl = V2Impl;
    var V3Impl = (function () {
        function V3Impl(x, y, z) {
            var _this = this;
            // 単項演算
            this.lenght2 = function () { return _this.ip(_this); };
            this.length = function () { return ut.sqrt(_this.lenght2()); };
            this.unit = function () { return _this.scalar(1 / _this.length()); };
            // 取得
            this.array = function () { return _this._v.slice(0); };
            this.clone = function () { return new V3Impl(_this.x(), _this.y(), _this.z()); };
            this.x = function () { return _this._v[0]; };
            this.y = function () { return _this._v[1]; };
            this.z = function () { return _this._v[2]; };
            // 二項演算
            this.add = function (dist) { return V3Impl.FromArray(fn.add(_this._v, toArray(dist))); };
            this.sub = function (dist) { return V3Impl.FromArray(fn.sub(_this._v, toArray(dist))); };
            this.hadamart = function (dist) { return V3Impl.FromArray(fn.hadamart(_this._v, toArray(dist))); };
            this.scalar = function (n) { return V3Impl.FromArray(fn.scalar(_this._v, n)); };
            this.ip = function (dist) { return fn.ip(_this.array(), toArray(dist)); };
            this.cp = function (dist) { return V3Impl.FromArray(fn.cp3(_this._v, toArray(dist))); };
            this._v = [x, y, z];
        }
        V3Impl.FromArray = function (v) {
            return new V3Impl(v[0], v[1], v[2]);
        };
        return V3Impl;
    }());
    priv.V3Impl = V3Impl;
    var V4Impl = (function () {
        function V4Impl(x, y, z, w) {
            var _this = this;
            // 取得
            this.array = function () { return _this._v.slice(0); };
            this.clone = function () { return new V4Impl(_this.x(), _this.y(), _this.z(), _this.w()); };
            this.x = function () { return _this._v[0]; };
            this.y = function () { return _this._v[1]; };
            this.z = function () { return _this._v[2]; };
            this.w = function () { return _this._v[3]; };
            // 単項演算
            this.unit = function () { return _this.scalar(1 / _this.length()); };
            this.lenght2 = function () { return _this.ip(_this); };
            this.length = function () { return ut.sqrt(_this.lenght2()); };
            // 二項演算
            this.add = function (dist) { return V4Impl.FromArray(fn.add(_this._v, toArray(dist))); };
            this.sub = function (dist) { return V4Impl.FromArray(fn.sub(_this._v, toArray(dist))); };
            this.hadamart = function (dist) { return V4Impl.FromArray(fn.hadamart(_this._v, toArray(dist))); };
            this.scalar = function (n) { return V4Impl.FromArray(fn.scalar(_this._v, n)); };
            this.ip = function (dist) { return fn.ip(_this.array(), toArray(dist)); };
            this._v = [x, y, z, w];
        }
        V4Impl.FromArray = function (v) {
            return new V4Impl(v[0], v[1], v[2], v[3]);
        };
        return V4Impl;
    }());
    priv.V4Impl = V4Impl;
})(priv || (priv = {}));
// --------------------------------------------------------
// 直交座標系による生成
/** (x成分, y成分) -> 2次元ベクトル */
exports.v2 = function (x, y) { return new priv.V2Impl(x, y); };
/** (x成分, y成分, z成分) -> 3次元ベクトル */
exports.v3 = function (x, y, z) { return new priv.V3Impl(x, y, z); };
/** (x成分, y成分, z成分, w成分) -> 4次元ベクトル */
exports.v4 = function (x, y, z, w) { return new priv.V4Impl(x, y, z, w); };
/** ([x成分, y成分]) -> 2次元ベクトル */
exports.array_to_v2 = function (n) { return priv.V2Impl.FromArray(n); };
/** ([x成分, y成分, z成分]) -> 3次元ベクトル */
exports.array_to_v3 = function (n) { return priv.V3Impl.FromArray(n); };
/** ([x成分, y成分, z成分, w成分]) -> 4次元ベクトル */
exports.array_to_v4 = function (n) { return priv.V4Impl.FromArray(n); };
// --------------------------------------------------------
// 極座標系による生成
/**
 * 極座標系から直交座標系の2次元ベクトルを生成する
 * @param r     極形式の長さ
 * @param rad   極形式の偏角(radian). 0でx軸正方向、1/2PIでy軸正方向とする
 * <ul>
 * <li> polar_to_v2(2, 0) -> v2(2, 0)
 * <li> polar_to_v2(2, PI/2) -> v2(0, 2)
 * <li> polar_to_v2(2, PI) -> v2(-2, 0)
 * </ul>
 */
function polar_to_v2(r, rad) {
    var x = r * ut.cos(rad);
    var y = r * ut.sin(rad);
    return new priv.V2Impl(x, y);
}
exports.polar_to_v2 = polar_to_v2;
/**
 * 円柱座標系から直交座標系の3次元ベクトルを生成する
 * @param r     極形式のxy成分の長さ
 * @param rad   極形式のxy成分の偏角(radian). 0でx軸正方向、1/2PIでy軸正方向とする
 * @param z     z成分
 * <ul>
 * <li> polar_to_v3(2, 0, 3) -> v3(2, 0, 3)
 * <li> polar_to_v3(2, PI/2, 4) -> v3(0, 2, 4)
 * <li> polar_to_v3(2, PI, 5) -> v3(-2, 0, 5)
 * </ul>
 */
function polar_to_v3(r, rad, z) {
    var x = r * ut.cos(rad);
    var y = r * ut.sin(rad);
    return new priv.V3Impl(x, y, z);
}
exports.polar_to_v3 = polar_to_v3;
/**
 * 球面座標系から直交座標系の3次元ベクトルを生成する
 * @param r     極形式の長さ
 * @param radH  水平偏角。0でx軸正方向、1/2PIでy軸正方向とする
 * @param radV  垂直偏角。0でz軸と直交、1/2PIでz軸正方向、-1/2PIでz軸負方向とする
 * <ul>
 * <li> sphere_to_v3(2, 0, 0) -> v3(2, 0, 0)
 * <li> sphere_to_v3(2, PI/2, 0) -> v3(0, 2, 0)
 * <li> sphere_to_v3(2, PI, 0) -> v3(-2, 0, 0)
 * <li> sphere_to_v3(2, 0, PI/3) -> v3(1, 0, sqrt(3))
 * <li> sphere_to_v3(2, PI/2, PI/3) -> v3(0, 1, sqrt(3))
 * <li> sphere_to_v3(2, PI, PI/3) -> v3(-1, 0, sqrt(3))
 * </ul>
 */
function sphere_to_v3(r, radH, radV) {
    var rh = r * ut.cos(radV);
    var z = r * ut.sin(radV);
    var x = rh * ut.cos(radH);
    var y = rh * ut.sin(radH);
    return new priv.V3Impl(x, y, z);
}
exports.sphere_to_v3 = sphere_to_v3;
// 変換
/**
 * (2次元ベクトル, z成分) -> 3次元ベクトル
 * <ul>
 * <li> v2_to_v3(v2(1, 2), 3) -> v3(1, 2, 3)
 * </ul>
 */
exports.v2_to_v3 = function (v2, z) { return priv.V3Impl.FromArray(v2._v.concat(z)); };
/**
 * (3次元ベクトル) -> 2次元ベクトル
 * <ul>
 * <li> v3_to_v2(v3(1, 2, 3)) -> v2(1, 2)
 * </ul>
 */
exports.v3_to_v2 = function (v3) { return priv.V2Impl.FromArray(v3._v); };
/**
 * (3次元ベクトル, w成分) -> 4次元ベクトル
 * <ul>
 * <li> v3_to_v4(v3(1, 2, 3), 4) -> v4(1, 2, 3, 4)
 * </ul>
 */
exports.v3_to_v4 = function (v3, w) { return priv.V4Impl.FromArray(v3._v.concat(w)); };
/**
 * (4次元ベクトル) -> 3次元ベクトル
 * <ul>
 * <li> v4_to_v3(v4(1, 2, 3, 4)) -> v3(1, 2, 3)
 * </ul>
 */
exports.v4_to_v3 = function (v4) { return priv.V3Impl.FromArray(v4._v); };
// 定数
/** 2次元ゼロベクトル v2(0, 0) */
exports.v2_zero = exports.v2(0, 0);
/** 3次元ゼロベクトル v3(0, 0, 0 */
exports.v3_zero = exports.v3(0, 0, 0);
/** x軸と平行な3次元単位ベクトル v3(1, 0, 0) */
exports.v3_unit_x = exports.v3(1, 0, 0);
/** y軸と平行な3次元単位ベクトル v3(0, 1, 0) */
exports.v3_unit_y = exports.v3(0, 1, 0);
/** z軸と平行な3次元単位ベクトル v3(0, 0, 1) */
exports.v3_unit_z = exports.v3(0, 0, 1);
