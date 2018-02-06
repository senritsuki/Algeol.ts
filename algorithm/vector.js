"use strict";
/** Vector - ベクトル */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/** 配列の単項演算を行い、新しい配列を返す */
function v_op1(a, dim, fn) {
    var v = new Array(dim);
    for (var i = 0; i < dim; i++) {
        v[i] = fn(a[i]);
    }
    return v;
}
exports.v_op1 = v_op1;
/** 配列同士の二項演算を行い、新しい配列を返す */
function v_op2(a, b, dim, fn) {
    var v = new Array(dim);
    for (var i = 0; i < dim; i++) {
        v[i] = fn(a[i], b[i]);
    }
    return v;
}
exports.v_op2 = v_op2;
/** Addition 加算 */
function v_add(a, b) {
    return v_op2(a, b, Math.min(a.length, b.length), function (n1, n2) { return n1 + n2; });
}
exports.v_add = v_add;
/** Subtraction 減算 */
function v_sub(a, b) {
    return v_op2(a, b, Math.min(a.length, b.length), function (n1, n2) { return n1 - n2; });
}
exports.v_sub = v_sub;
/** スカラー倍 */
function v_scalar(a, n) {
    return v_op1(a, a.length, function (n1) { return n1 * n; });
}
exports.v_scalar = v_scalar;
/** 要素ごとの乗算 */
function v_el_mul(a, b) {
    return v_op2(a, b, Math.min(a.length, b.length), function (n1, n2) { return n1 * n2; });
}
exports.v_el_mul = v_el_mul;
/** 要素ごとの除算 */
function v_el_div(a, b) {
    return v_op2(a, b, Math.min(a.length, b.length), function (n1, n2) { return n1 / n2; });
}
exports.v_el_div = v_el_div;
/** Inner Product, Dot Product 内積 */
function v_ip(a, b) {
    return v_el_mul(a, b).reduce(function (a, b) { return a + b; });
}
exports.v_ip = v_ip;
/** Cross Product 2-D 外積（二次元） */
function v_cp2(a, b) {
    return a[0] * b[1] - a[1] * b[0];
}
exports.v_cp2 = v_cp2;
/** Cross Product 3-D 外積（三次元） */
function v_cp3(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];
}
exports.v_cp3 = v_cp3;
/** 二つの方向ベクトルのなす角 radian */
function v_angle(a, b) {
    // 余弦定理 abs(a)*abs(b)*cos(rad) = ip(a,b) を用いればよい
    var al = Math.sqrt(v_ip(a, a));
    var bl = Math.sqrt(v_ip(b, b));
    var i = v_ip(a, b);
    var rad = Math.acos(i / (al * bl));
    return rad;
}
exports.v_angle = v_angle;
var VectorBase = /** @class */ (function () {
    function VectorBase(_v, _f) {
        this._v = _v;
        this._f = _f;
    }
    VectorBase.prototype.dim = function () {
        return this._v.length;
    };
    VectorBase.prototype.array = function () {
        return this._v.slice(0);
    };
    VectorBase.prototype.toString = function () {
        return "[" + this._v.join(', ') + "]";
    };
    VectorBase.prototype.toString03f = function () {
        return "[" + this._v.map(function (n) { return Math.round(n * 1000) / 1000; }).join(', ') + "]";
    };
    VectorBase.prototype.length2 = function () {
        return v_ip(this._v, this._v);
    };
    VectorBase.prototype.length = function () {
        return Math.sqrt(this.length2());
    };
    VectorBase.prototype.clone = function () {
        return this._f(this._v);
    };
    VectorBase.prototype.unit = function () {
        return this._f(v_scalar(this._v, 1 / this.length()));
    };
    VectorBase.prototype.add = function (dist) {
        return this._f(v_add(this._v, exports.to_array_if(dist)));
    };
    VectorBase.prototype.sub = function (dist) {
        return this._f(v_sub(this._v, exports.to_array_if(dist)));
    };
    VectorBase.prototype.el_mul = function (dist) {
        return this._f(v_el_mul(this._v, exports.to_array_if(dist)));
    };
    VectorBase.prototype.el_div = function (dist) {
        return this._f(v_el_div(this._v, exports.to_array_if(dist)));
    };
    VectorBase.prototype.scalar = function (n) {
        return this._f(v_scalar(this._v, n));
    };
    VectorBase.prototype.ip = function (dist) {
        return v_ip(this.array(), exports.to_array_if(dist));
    };
    VectorBase.prototype.angle = function (dist) {
        return v_angle(this._v, exports.to_array_if(dist));
    };
    return VectorBase;
}());
/** 2D Vector - 2次元ベクトル */
var V2Impl = /** @class */ (function (_super) {
    __extends(V2Impl, _super);
    function V2Impl(x, y) {
        return _super.call(this, [x, y], V2Impl.fm_array) || this;
    }
    V2Impl.fm_array = function (v) {
        return new V2Impl(v[0], v[1]);
    };
    Object.defineProperty(V2Impl.prototype, "x", {
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
    V2Impl.prototype.cp = function (dist) {
        return v_cp2(this._v, exports.to_array_if(dist));
    };
    return V2Impl;
}(VectorBase));
var V3Impl = /** @class */ (function (_super) {
    __extends(V3Impl, _super);
    function V3Impl(x, y, z) {
        return _super.call(this, [x, y, z], V3Impl.fm_array) || this;
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
    V3Impl.prototype.cp = function (dist) {
        return V3Impl.fm_array(v_cp3(this._v, exports.to_array_if(dist)));
    };
    return V3Impl;
}(VectorBase));
var V4Impl = /** @class */ (function (_super) {
    __extends(V4Impl, _super);
    function V4Impl(x, y, z, w) {
        return _super.call(this, [x, y, z, w], V4Impl.fm_array) || this;
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
}(VectorBase));
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
/** v2 -> [radius, radian] */
function v2_to_polar(v) {
    var r = v.length();
    var rad = Math.atan2(v.y, v.x);
    return [r, rad];
}
exports.v2_to_polar = v2_to_polar;
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
/** v3 -> [radius, radian, z] */
function v3_to_polar(v) {
    var r = exports.v3_to_v2(v).length();
    var rad = Math.atan2(v.y, v.x);
    return [r, rad, v.z];
}
exports.v3_to_polar = v3_to_polar;
/** v3 -> [radius, radian_horizontal, radian_vertical] */
function v3_to_sphere(v) {
    var r = v.length();
    var r_h = exports.v3_to_v2(v).length();
    var rad_h = Math.atan2(v.y, v.x);
    var rad_v = Math.atan2(v.z, r_h);
    return [r, rad_h, rad_v];
}
exports.v3_to_sphere = v3_to_sphere;
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
