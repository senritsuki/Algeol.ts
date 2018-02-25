"use strict";
/** Matrix - 行列 */
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
var ut = require("./utility");
var vc = require("./vector");
/**
 * Clone - 複製
 * @param m1        行列
 * @param orderR    行数
 * @param orderC    列数
 * @return          複製された行列
 */
function m_clone(m1, orderR, orderC) {
    var m = new Array(orderR);
    for (var r = 0; r < orderR; r++) {
        m[r] = new Array(orderC);
        for (var c = 0; c < orderC; c++) {
            m[r][c] = m1[r][c];
        }
    }
    return m;
}
exports.m_clone = m_clone;
/** 二次元配列行列の転置 */
var transpose = ut.transpose;
/** Multiplication - 乗算
    (左辺行列, 右辺行列) -> 左辺行列*右辺行列の乗算結果を表す2次元配列 */
function m_mul(m1, m2) {
    var m2t = transpose(m2);
    var orderR = m1.length;
    var orderC = m2t.length;
    var m = new Array(orderR);
    for (var r = 0; r < orderR; r++) {
        m[r] = new Array(orderC);
        for (var c = 0; c < orderC; c++) {
            m[r][c] = vc.v_ip(m1[r], m2t[c]);
        }
    }
    return m;
}
exports.m_mul = m_mul;
/** Linear Mapping - 線形写像
    (左辺行列, 右辺ベクトル) -> 左辺行列*右辺ベクトルの演算結果を表す配列 */
function m_map(m1, v1) {
    var orderR = m1.length;
    var v = new Array(orderR);
    for (var i = 0; i < orderR; i++) {
        v[i] = vc.v_ip(m1[i], v1);
    }
    return v;
}
exports.m_map = m_map;
var MatrixBase = /** @class */ (function () {
    function MatrixBase(_m, _fm, _fv) {
        this._m = _m;
        this._fm = _fm;
        this._fv = _fv;
    }
    MatrixBase.prototype.array_rows = function () {
        return m_clone(this._m, this.dim(), this.dim());
    };
    MatrixBase.prototype.array_cols = function () {
        return transpose(this._m);
    };
    MatrixBase.prototype.mul = function (dist) {
        return this._fm(m_mul(this._m, dist._m));
    };
    MatrixBase.prototype.map = function (v) {
        return this._fv(m_map(this._m, v._v));
    };
    return MatrixBase;
}());
var M2Impl = /** @class */ (function (_super) {
    __extends(M2Impl, _super);
    function M2Impl(rows) {
        return _super.call(this, m_clone(rows, M2Impl.Dim, M2Impl.Dim), M2Impl.FromRows, vc.array_to_v2) || this;
    }
    M2Impl.FromRows = function (rows) { return new M2Impl(rows); };
    M2Impl.FromCols = function (cols) { return new M2Impl(transpose(cols)); };
    M2Impl.prototype.dim = function () {
        return M2Impl.Dim;
    };
    M2Impl.Dim = 2;
    return M2Impl;
}(MatrixBase));
var M3Impl = /** @class */ (function (_super) {
    __extends(M3Impl, _super);
    function M3Impl(rows) {
        return _super.call(this, m_clone(rows, M3Impl.Dim, M3Impl.Dim), M3Impl.FromRows, vc.array_to_v3) || this;
    }
    M3Impl.FromRows = function (rows) { return new M3Impl(rows); };
    M3Impl.FromCols = function (cols) { return new M3Impl(transpose(cols)); };
    M3Impl.prototype.dim = function () {
        return M3Impl.Dim;
    };
    M3Impl.prototype.map_v2 = function (v, w) {
        return vc.array_to_v2(m_map(this._m, v._v.concat(w)));
    };
    M3Impl.Dim = 3;
    return M3Impl;
}(MatrixBase));
var M4Impl = /** @class */ (function (_super) {
    __extends(M4Impl, _super);
    function M4Impl(rows) {
        return _super.call(this, m_clone(rows, M4Impl.Dim, M4Impl.Dim), M4Impl.FromRows, vc.array_to_v4) || this;
    }
    M4Impl.FromRows = function (rows) { return new M4Impl(rows); };
    M4Impl.FromCols = function (cols) { return new M4Impl(transpose(cols)); };
    M4Impl.prototype.dim = function () {
        return M4Impl.Dim;
    };
    M4Impl.prototype.map_v3 = function (v, w) {
        return vc.array_to_v3(m_map(this._m, v._v.concat(w)));
    };
    M4Impl.Dim = 4;
    return M4Impl;
}(MatrixBase));
/** ([列番号][行番号]と表される2次元配列) -> 2次元正方行列オブジェクト */
exports.cols_to_m2 = function (cols) { return M2Impl.FromCols(cols); };
/** ([行番号][列番号]と表される2次元配列) -> 2次元正方行列オブジェクト */
exports.rows_to_m2 = function (rows) { return M2Impl.FromRows(rows); };
/** ([列番号][行番号]と表される2次元配列) -> 3次元正方行列オブジェクト */
exports.cols_to_m3 = function (cols) { return M3Impl.FromCols(cols); };
/** ([行番号][列番号]と表される2次元配列) -> 3次元正方行列オブジェクト */
exports.rows_to_m3 = function (rows) { return M3Impl.FromRows(rows); };
/** ([列番号][行番号]と表される2次元配列) -> 4次元正方行列オブジェクト */
exports.cols_to_m4 = function (cols) { return M4Impl.FromCols(cols); };
/** ([行番号][列番号]と表される2次元配列) -> 4次元正方行列オブジェクト */
exports.rows_to_m4 = function (rows) { return M4Impl.FromRows(rows); };
exports.v2cols_to_m2 = function (vl) { return M2Impl.FromCols(vl.map(function (v) { return v._v; })); };
exports.v3cols_to_m3 = function (vl) { return M3Impl.FromCols(vl.map(function (v) { return v._v; })); };
exports.v4cols_to_m4 = function (vl) { return M4Impl.FromCols(vl.map(function (v) { return v._v; })); };
/** 2次元単位正方行列 */
exports.unit_m2 = M2Impl.FromRows([
    [1, 0],
    [0, 1],
]);
/** 2次元単位正方行列 */
exports.unit_m3 = M3Impl.FromRows([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
]);
/** 4次元単位正方行列 */
exports.unit_m4 = M4Impl.FromRows([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
]);
/** (2次元正方行列) -> 3次元正方行列 */
function m2_to_m3(m2, v) {
    if (v === void 0) { v = [0, 0]; }
    var m3rows = m2._m.map(function (row) { return row.concat(0); });
    v = vc.to_array_if(v);
    v = v.slice(0, 2).concat(1);
    m3rows.push(v);
    return M3Impl.FromRows(m3rows);
}
exports.m2_to_m3 = m2_to_m3;
/** (3次元正方行列) -> 2次元正方行列 */
function m3_to_m2(m3) {
    return M2Impl.FromRows(m3._m);
}
exports.m3_to_m2 = m3_to_m2;
/** (3次元正方行列) -> 4次元正方行列 */
function m3_to_m4(m3, v) {
    if (v === void 0) { v = [0, 0, 0]; }
    var m4rows = m3._m.map(function (row) { return row.concat(0); });
    v = vc.to_array_if(v);
    v = v.slice(0, 3).concat(1);
    m4rows.push(v);
    return M4Impl.FromRows(m4rows);
}
exports.m3_to_m4 = m3_to_m4;
/** (4次元正方行列) -> 3次元正方行列 */
function m4_to_m3(m4) {
    return M3Impl.FromRows(m4._m);
}
exports.m4_to_m3 = m4_to_m3;
/** 3次元ベクトル配列に対するアフィン写像
    (3次元ベクトル配列, 4次元正方行列, 4次元ベクトルのw成分) -> 変換後の3次元正方行列 */
function map_m4_v3(vl, m4, w) {
    if (w === void 0) { w = 1; }
    return vl.map(function (v) { return vc.v4_to_v3(m4.map(vc.v3_to_v4(v, w))); });
}
exports.map_m4_v3 = map_m4_v3;
/** 平行移動写像 */
function affine2_translate(v) {
    v = v instanceof Array ? v : v._v;
    return M3Impl.FromRows([
        [1, 0, v[0]],
        [0, 1, v[1]],
        [0, 0, 1],
    ]);
}
exports.affine2_translate = affine2_translate;
/** 平行移動写像 */
function affine3_translate(v) {
    v = v instanceof Array ? v : v._v;
    return M4Impl.FromRows([
        [1, 0, 0, v[0]],
        [0, 1, 0, v[1]],
        [0, 0, 1, v[2]],
        [0, 0, 0, 1],
    ]);
}
exports.affine3_translate = affine3_translate;
/** 拡大縮小写像 */
function m2_scale(v) {
    v = v instanceof Array ? v : v._v;
    return M2Impl.FromRows([
        [v[0], 0],
        [0, v[1]],
    ]);
}
exports.m2_scale = m2_scale;
/** 拡大縮小写像 */
function m3_scale(v) {
    v = v instanceof Array ? v : v._v;
    return M3Impl.FromRows([
        [v[0], 0, 0],
        [0, v[1], 0],
        [0, 0, v[2]],
    ]);
}
exports.m3_scale = m3_scale;
/** 拡大縮小写像 */
exports.affine2_scale = ut.compose_2f(m2_scale, m2_to_m3);
/** 拡大縮小写像 */
exports.affine3_scale = ut.compose_2f(m3_scale, m3_to_m4);
function m2_rotate(rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return M2Impl.FromRows([
        [c, -s],
        [s, c],
    ]);
}
exports.m2_rotate = m2_rotate;
/** x軸回転写像 */
function m3_rotate_x(rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return M3Impl.FromRows([
        [1, 0, 0],
        [0, c, -s],
        [0, s, c],
    ]);
}
exports.m3_rotate_x = m3_rotate_x;
/** y軸回転写像 */
function m3_rotate_y(rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return M3Impl.FromRows([
        [c, 0, s],
        [0, 1, 0],
        [-s, 0, c],
    ]);
}
exports.m3_rotate_y = m3_rotate_y;
/** z軸回転写像 */
function m3_rotate_z(rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return M3Impl.FromRows([
        [c, -s, 0],
        [s, c, 0],
        [0, 0, 1],
    ]);
}
exports.m3_rotate_z = m3_rotate_z;
exports.affine2_rotate = ut.compose_2f(m2_rotate, m2_to_m3);
/** x軸回転写像 */
exports.affine3_rotate_x = ut.compose_2f(m3_rotate_x, m3_to_m4);
/** y軸回転写像 */
exports.affine3_rotate_y = ut.compose_2f(m3_rotate_y, m3_to_m4);
/** z軸回転写像 */
exports.affine3_rotate_z = ut.compose_2f(m3_rotate_z, m3_to_m4);
/** x軸ベクトルをv3ベクトルと平行にする回転写像 */
function rot_yz_x_m3(v3) {
    var x = v3.x;
    var y = v3.y;
    var z = v3.z;
    var radY = -Math.atan2(z, Math.sqrt(x * x + y * y));
    var radZ = Math.atan2(y, x);
    var mxRotY = m3_rotate_y(radY);
    var mxRotZ = m3_rotate_z(radZ);
    return mxRotZ.mul(mxRotY);
}
exports.rot_yz_x_m3 = rot_yz_x_m3;
/** x軸ベクトルをv3ベクトルと平行にする回転写像 */
exports.rot_yz_x_m4 = ut.compose_2f(rot_yz_x_m3, m3_to_m4);
/** z軸ベクトルをv3ベクトルと平行にする回転写像 */
function rot_yz_z_m3(v3) {
    var x = v3.x;
    var y = v3.y;
    var z = v3.z;
    var radY = ut.deg90 - Math.atan2(z, Math.sqrt(x * x + y * y));
    var radZ = Math.atan2(y, x);
    var mxRotY = m3_rotate_y(radY);
    var mxRotZ = m3_rotate_z(radZ);
    return mxRotZ.mul(mxRotY);
}
exports.rot_yz_z_m3 = rot_yz_z_m3;
/** z軸ベクトルをv3ベクトルと平行にする回転写像 */
exports.rot_yz_z_m4 = ut.compose_2f(rot_yz_z_m3, m3_to_m4);
/** オイラー角XYZの回転写像 */
function rot_xyz_m3(rad_xyz) {
    return m3_rotate_x(rad_xyz[0])
        .mul(m3_rotate_y(rad_xyz[1]))
        .mul(m3_rotate_z(rad_xyz[2]));
}
exports.rot_xyz_m3 = rot_xyz_m3;
/** オイラー角XYZの回転写像 */
exports.rot_xyz_m4 = ut.compose_2f(rot_xyz_m3, m3_to_m4);
/** オイラー角XYZの逆回転写像 */
function rot_inv_xyz_m3(rad_xyz) {
    return m3_rotate_z(-rad_xyz[2])
        .mul(m3_rotate_y(-rad_xyz[1]))
        .mul(m3_rotate_x(-rad_xyz[0]));
}
exports.rot_inv_xyz_m3 = rot_inv_xyz_m3;
/** オイラー角XYZの回転写像 */
exports.rot_inv_xyz_m4 = ut.compose_2f(rot_inv_xyz_m3, m3_to_m4);
/** 行列を合成する */
function compose(mm) {
    return mm.reduce(function (a, b) { return b.mul(a); });
}
exports.compose = compose;
/** 行列を逆順に合成する */
function compose_rev(mm) {
    return mm.reduce(function (a, b) { return a.mul(b); });
}
exports.compose_rev = compose_rev;
/** ビュー変換行列 */
function camera_matrix(pos, dir_front, dir_head) {
    var dir_x = dir_front.cp(dir_head).unit();
    var dir_y = dir_front.unit();
    var dir_z = dir_head.unit();
    var m3 = M3Impl.FromRows([dir_x._v, dir_y._v, dir_z._v]);
    var m4 = m3_to_m4(m3, pos);
    return m4;
}
exports.camera_matrix = camera_matrix;
