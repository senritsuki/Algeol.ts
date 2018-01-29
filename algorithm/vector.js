"use strict";
/** Vector - ベクトル */
Object.defineProperty(exports, "__esModule", { value: true });
/** 配列の単項演算を行い、新しい配列を返す */
function op1(a, dim, fn) {
    var v = new Array(dim);
    for (var i = 0; i < dim; i++) {
        v[i] = fn(a[i]);
    }
    return v;
}
exports.op1 = op1;
/** 配列同士の二項演算を行い、新しい配列を返す */
function op2(a, b, dim, fn) {
    var v = new Array(dim);
    for (var i = 0; i < dim; i++) {
        v[i] = fn(a[i], b[i]);
    }
    return v;
}
exports.op2 = op2;
/** Addition 加算 */
function add(a, b) {
    return op2(a, b, Math.min(a.length, b.length), function (n1, n2) { return n1 + n2; });
}
exports.add = add;
/** Subtraction 減算 */
function sub(a, b) {
    return op2(a, b, Math.min(a.length, b.length), function (n1, n2) { return n1 - n2; });
}
exports.sub = sub;
/** スカラー倍 */
function scalar(a, n) {
    return op1(a, a.length, function (n1) { return n1 * n; });
}
exports.scalar = scalar;
/** 要素ごとの乗算 */
function el_mul(a, b) {
    return op2(a, b, Math.min(a.length, b.length), function (n1, n2) { return n1 * n2; });
}
exports.el_mul = el_mul;
/** 要素ごとの除算 */
function el_div(a, b) {
    return op2(a, b, Math.min(a.length, b.length), function (n1, n2) { return n1 / n2; });
}
exports.el_div = el_div;
/** Inner Product, Dot Product 内積 */
function ip(a, b) {
    return el_mul(a, b).reduce(function (a, b) { return a + b; });
}
exports.ip = ip;
/** Cross Product 2-D 外積（二次元） */
function cp2(a, b) {
    return a[0] * b[1] - a[1] * b[0];
}
exports.cp2 = cp2;
/** Cross Product 3-D 外積（三次元） */
function cp3(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];
}
exports.cp3 = cp3;
/** 二つの方向ベクトルのなす角 radian */
function angle(a, b) {
    // 余弦定理 abs(a)*abs(b)*cos(rad) = ip(a,b) を用いればよい
    var al = Math.sqrt(ip(a, a));
    var bl = Math.sqrt(ip(b, b));
    var i = ip(a, b);
    var rad = Math.acos(i / (al * bl));
    return rad;
}
exports.angle = angle;
/** 2D Vector - 2次元ベクトル */
var V2Impl = /** @class */ (function () {
    function V2Impl(x, y) {
        var _this = this;
        this.array = function () { return _this._v.slice(0); };
        this.clone = function () { return new V2Impl(_this.x, _this.y); };
        // 単項演算
        this.unit = function () { return _this.scalar(1 / _this.length()); };
        this.length2 = function () { return _this.ip(_this); };
        this.length = function () { return Math.sqrt(_this.length2()); };
        // 二項演算
        this.add = function (dist) { return V2Impl.fm_array(add(_this._v, exports.to_array_if(dist))); };
        this.sub = function (dist) { return V2Impl.fm_array(sub(_this._v, exports.to_array_if(dist))); };
        this.el_mul = function (dist) { return V2Impl.fm_array(el_mul(_this._v, exports.to_array_if(dist))); };
        this.el_div = function (dist) { return V2Impl.fm_array(el_div(_this._v, exports.to_array_if(dist))); };
        this.scalar = function (n) { return V2Impl.fm_array(scalar(_this._v, n)); };
        this.ip = function (dist) { return ip(_this.array(), exports.to_array_if(dist)); };
        this.cp = function (dist) { return cp2(_this._v, exports.to_array_if(dist)); };
        this.angle = function (dist) { return angle(_this._v, exports.to_array_if(dist)); };
        this.toString = function () { return "[" + _this._v.join(', ') + "]"; };
        this.toString03f = function () { return "[" + _this._v.map(function (n) { return Math.round(n * 1000) / 1000; }).join(', ') + "]"; };
        this._v = [x, y];
    }
    V2Impl.fm_array = function (v) {
        return new V2Impl(v[0], v[1]);
    };
    Object.defineProperty(V2Impl.prototype, "x", {
        // 取得
        get: function () { return this._v[0]; },
        set: function (n) { this._v[0] = n; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(V2Impl.prototype, "y", {
        get: function () { return this._v[1]; },
        set: function (n) { this._v[1] = n; },
        enumerable: true,
        configurable: true
    });
    return V2Impl;
}());
var V3Impl = /** @class */ (function () {
    function V3Impl(x, y, z) {
        var _this = this;
        // 単項演算
        this.length2 = function () { return _this.ip(_this); };
        this.length = function () { return Math.sqrt(_this.length2()); };
        this.unit = function () { return _this.scalar(1 / _this.length()); };
        this.array = function () { return _this._v.slice(0); };
        this.clone = function () { return new V3Impl(_this.x, _this.y, _this.z); };
        // 二項演算
        this.add = function (dist) { return V3Impl.fm_array(add(_this._v, exports.to_array_if(dist))); };
        this.sub = function (dist) { return V3Impl.fm_array(sub(_this._v, exports.to_array_if(dist))); };
        this.el_mul = function (dist) { return V3Impl.fm_array(el_mul(_this._v, exports.to_array_if(dist))); };
        this.el_div = function (dist) { return V3Impl.fm_array(el_div(_this._v, exports.to_array_if(dist))); };
        this.scalar = function (n) { return V3Impl.fm_array(scalar(_this._v, n)); };
        this.ip = function (dist) { return ip(_this.array(), exports.to_array_if(dist)); };
        this.cp = function (dist) { return V3Impl.fm_array(cp3(_this._v, exports.to_array_if(dist))); };
        this.angle = function (dist) { return angle(_this._v, exports.to_array_if(dist)); };
        this.toString = function () { return "[" + _this._v.join(', ') + "]"; };
        this.toString03f = function () { return "[" + _this._v.map(function (n) { return Math.round(n * 1000) / 1000; }).join(', ') + "]"; };
        this._v = [x, y, z];
    }
    V3Impl.fm_array = function (v) {
        return new V3Impl(v[0], v[1], v[2]);
    };
    Object.defineProperty(V3Impl.prototype, "x", {
        // 取得
        get: function () { return this._v[0]; },
        set: function (n) { this._v[0] = n; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(V3Impl.prototype, "y", {
        get: function () { return this._v[1]; },
        set: function (n) { this._v[1] = n; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(V3Impl.prototype, "z", {
        get: function () { return this._v[2]; },
        set: function (n) { this._v[2] = n; },
        enumerable: true,
        configurable: true
    });
    return V3Impl;
}());
var V4Impl = /** @class */ (function () {
    function V4Impl(x, y, z, w) {
        var _this = this;
        this.array = function () { return _this._v.slice(0); };
        this.clone = function () { return new V4Impl(_this.x, _this.y, _this.z, _this.w); };
        // 単項演算
        this.unit = function () { return _this.scalar(1 / _this.length()); };
        this.length2 = function () { return _this.ip(_this); };
        this.length = function () { return Math.sqrt(_this.length2()); };
        // 二項演算
        this.add = function (dist) { return V4Impl.fm_array(add(_this._v, exports.to_array_if(dist))); };
        this.sub = function (dist) { return V4Impl.fm_array(sub(_this._v, exports.to_array_if(dist))); };
        this.el_mul = function (dist) { return V4Impl.fm_array(el_mul(_this._v, exports.to_array_if(dist))); };
        this.el_div = function (dist) { return V4Impl.fm_array(el_div(_this._v, exports.to_array_if(dist))); };
        this.scalar = function (n) { return V4Impl.fm_array(scalar(_this._v, n)); };
        this.ip = function (dist) { return ip(_this.array(), exports.to_array_if(dist)); };
        this.angle = function (dist) { return angle(_this._v, exports.to_array_if(dist)); };
        this.toString = function () { return "[" + _this._v.join(', ') + "]"; };
        this.toString03f = function () { return "[" + _this._v.map(function (n) { return Math.round(n * 1000) / 1000; }).join(', ') + "]"; };
        this._v = [x, y, z, w];
    }
    V4Impl.fm_array = function (v) {
        return new V4Impl(v[0], v[1], v[2], v[3]);
    };
    Object.defineProperty(V4Impl.prototype, "x", {
        // 取得
        get: function () { return this._v[0]; },
        set: function (n) { this._v[0] = n; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(V4Impl.prototype, "y", {
        get: function () { return this._v[1]; },
        set: function (n) { this._v[1] = n; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(V4Impl.prototype, "z", {
        get: function () { return this._v[2]; },
        set: function (n) { this._v[2] = n; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(V4Impl.prototype, "w", {
        get: function () { return this._v[3]; },
        set: function (n) { this._v[3] = n; },
        enumerable: true,
        configurable: true
    });
    return V4Impl;
}());
exports.to_array_if = function (n) { return n instanceof Array ? n : n._v; };
exports.to_v2_if = function (v) { return v instanceof Array ? exports.array_to_v2(v) : v; };
exports.to_v3_if = function (v) { return v instanceof Array ? exports.array_to_v3(v) : v; };
exports.to_v4_if = function (v) { return v instanceof Array ? exports.array_to_v4(v) : v; };
// --------------------------------------------------------
// 直交座標系による生成
/** (x成分, y成分) -> 2次元ベクトル */
exports.v2 = function (x, y) { return new V2Impl(x, y); };
/** (x成分, y成分, z成分) -> 3次元ベクトル */
exports.v3 = function (x, y, z) { return new V3Impl(x, y, z); };
/** (x成分, y成分, z成分, w成分) -> 4次元ベクトル */
exports.v4 = function (x, y, z, w) { return new V4Impl(x, y, z, w); };
/** ([x成分, y成分]) -> 2次元ベクトル */
exports.array_to_v2 = function (n) { return V2Impl.fm_array(n); };
/** ([x成分, y成分, z成分]) -> 3次元ベクトル */
exports.array_to_v3 = function (n) { return V3Impl.fm_array(n); };
/** ([x成分, y成分, z成分, w成分]) -> 4次元ベクトル */
exports.array_to_v4 = function (n) { return V4Impl.fm_array(n); };
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
    var x = r * Math.cos(rad);
    var y = r * Math.sin(rad);
    return new V2Impl(x, y);
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
    var x = r * Math.cos(rad);
    var y = r * Math.sin(rad);
    return new V3Impl(x, y, z);
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
    var rh = r * Math.cos(radV);
    var z = r * Math.sin(radV);
    var x = rh * Math.cos(radH);
    var y = rh * Math.sin(radH);
    return new V3Impl(x, y, z);
}
exports.sphere_to_v3 = sphere_to_v3;
// 変換
/**
 * (2次元ベクトル, z成分) -> 3次元ベクトル
 * <ul>
 * <li> v2_to_v3(v2(1, 2), 3) -> v3(1, 2, 3)
 * </ul>
 */
exports.v2_to_v3 = function (v2, z) { return V3Impl.fm_array(v2._v.concat(z)); };
/**
 * (3次元ベクトル) -> 2次元ベクトル
 * <ul>
 * <li> v3_to_v2(v3(1, 2, 3)) -> v2(1, 2)
 * </ul>
 */
exports.v3_to_v2 = function (v3) { return V2Impl.fm_array(v3._v); };
/**
 * (3次元ベクトル, w成分) -> 4次元ベクトル
 * <ul>
 * <li> v3_to_v4(v3(1, 2, 3), 4) -> v4(1, 2, 3, 4)
 * </ul>
 */
exports.v3_to_v4 = function (v3, w) { return V4Impl.fm_array(v3._v.concat(w)); };
/**
 * (4次元ベクトル) -> 3次元ベクトル
 * <ul>
 * <li> v4_to_v3(v4(1, 2, 3, 4)) -> v3(1, 2, 3)
 * </ul>
 */
exports.v4_to_v3 = function (v4) { return V3Impl.fm_array(v4._v); };
function v3map_v4(v, f) {
    var w = v.w;
    var v_1 = exports.v4_to_v3(v);
    var v_2 = f(v_1);
    var v_3 = exports.v3_to_v4(v_2, w);
    return v_3;
}
exports.v3map_v4 = v3map_v4;
function v4map_v3(v, w, f) {
    var v_1 = exports.v3_to_v4(v, w);
    var v_2 = f(v_1);
    var v_3 = exports.v4_to_v3(v_2);
    return v_3;
}
exports.v4map_v3 = v4map_v3;
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
