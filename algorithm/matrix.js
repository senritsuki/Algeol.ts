"use strict";
// Square Matrix 正方行列
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
function clone(m1, orderR, orderC) {
    var m = new Array(orderR);
    for (var r = 0; r < orderR; r++) {
        m[r] = new Array(orderC);
        for (var c = 0; c < orderC; c++) {
            m[r][c] = m1[r][c];
        }
    }
    return m;
}
exports.clone = clone;
/** Transpose - 転置
    (行列) -> 行列の転置結果を表す2次元配列 */
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
/** Multiplication - 乗算
    (左辺行列, 右辺行列) -> 左辺行列*右辺行列の乗算結果を表す2次元配列 */
function mul(m1, m2) {
    var m2t = transpose(m2);
    var orderR = m1.length;
    var orderC = m2t.length;
    var m = new Array(orderR);
    for (var r = 0; r < orderR; r++) {
        m[r] = new Array(orderC);
        for (var c = 0; c < orderC; c++) {
            m[r][c] = vc.ip(m1[r], m2t[c]);
        }
    }
    return m;
}
exports.mul = mul;
/** Scalar Product - スカラー倍
    (行列, スカラー値) -> 行列*スカラー値の乗算結果を表す2次元配列 */
function scalar(m1, n) {
    var orderR = m1.length;
    var orderC = m1[0].length;
    var m = new Array(orderR);
    for (var r = 0; r < orderR; r++) {
        m[r] = new Array(orderC);
        for (var c = 0; c < orderC; c++) {
            m[r][c] = m1[r][c] * n;
        }
    }
    return m;
}
exports.scalar = scalar;
/** Linear Mapping - 線形写像
    (左辺行列, 右辺ベクトル) -> 左辺行列*右辺ベクトルの演算結果を表す配列 */
function map(m1, v1) {
    var orderR = m1.length;
    var v = new Array(orderR);
    for (var i = 0; i < orderR; i++) {
        v[i] = vc.ip(m1[i], v1);
    }
    return v;
}
exports.map = map;
var M2Impl = /** @class */ (function () {
    function M2Impl(rows) {
        this._m = clone(rows, M2Impl.Dim, M2Impl.Dim);
    }
    M2Impl.FromRows = function (rows) { return new M2Impl(rows); };
    M2Impl.FromCols = function (cols) { return new M2Impl(transpose(cols)); };
    M2Impl.prototype.array_rows = function () {
        return clone(this._m, M2Impl.Dim, M2Impl.Dim);
    };
    M2Impl.prototype.array_cols = function () {
        return transpose(this._m);
    };
    M2Impl.prototype.mul = function (dist) {
        return M2Impl.FromRows(mul(this._m, dist._m));
    };
    M2Impl.prototype.map = function (v) {
        return vc.array_to_v2(map(this._m, v._v));
    };
    M2Impl.Dim = 2;
    return M2Impl;
}());
var M3Impl = /** @class */ (function () {
    function M3Impl(rows) {
        this._m = clone(rows, M3Impl.Dim, M3Impl.Dim);
    }
    M3Impl.FromRows = function (rows) { return new M3Impl(rows); };
    M3Impl.FromCols = function (cols) { return new M3Impl(transpose(cols)); };
    M3Impl.prototype.array_rows = function () {
        return clone(this._m, M3Impl.Dim, M3Impl.Dim);
    };
    M3Impl.prototype.array_cols = function () {
        return transpose(this._m);
    };
    M3Impl.prototype.mul = function (dist) {
        return M3Impl.FromRows(mul(this._m, dist._m));
    };
    M3Impl.prototype.map = function (v) {
        return vc.array_to_v3(map(this._m, v._v));
    };
    M3Impl.Dim = 3;
    return M3Impl;
}());
var M4Impl = /** @class */ (function () {
    function M4Impl(rows) {
        this._m = clone(rows, M4Impl.Dim, M4Impl.Dim);
    }
    M4Impl.FromRows = function (rows) { return new M4Impl(rows); };
    M4Impl.FromCols = function (cols) { return new M4Impl(transpose(cols)); };
    M4Impl.prototype.array_rows = function () {
        return clone(this._m, M4Impl.Dim, M4Impl.Dim);
    };
    M4Impl.prototype.array_cols = function () {
        return transpose(this._m);
    };
    M4Impl.prototype.mul = function (dist) {
        return M4Impl.FromRows(mul(this._m, dist._m));
    };
    M4Impl.prototype.map = function (v) {
        return vc.array_to_v4(map(this._m, v._v));
    };
    M4Impl.prototype.map_v3 = function (v, w) {
        return vc.array_to_v3(map(this._m, v._v.concat(w)));
    };
    M4Impl.Dim = 4;
    return M4Impl;
}());
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
function m2_m3(m2) {
    var m3rows = m2._m.map(function (row) { return row.concat(0); });
    m3rows.push([0, 0, 1]);
    return M3Impl.FromRows(m3rows);
}
exports.m2_m3 = m2_m3;
/** (3次元正方行列) -> 2次元正方行列 */
function m3_m2(m3) {
    return M2Impl.FromRows(m3._m);
}
exports.m3_m2 = m3_m2;
/** (3次元正方行列) -> 4次元正方行列 */
function m3_m4(m3) {
    var m4rows = m3._m.map(function (row) { return row.concat(0); });
    m4rows.push([0, 0, 0, 1]);
    return M4Impl.FromRows(m4rows);
}
exports.m3_m4 = m3_m4;
/** (4次元正方行列) -> 3次元正方行列 */
function m4_m3(m4) {
    return M3Impl.FromRows(m4._m);
}
exports.m4_m3 = m4_m3;
/** 3次元ベクトル配列に対するアフィン写像
    (3次元ベクトル配列, 4次元正方行列, 4次元ベクトルのw成分) -> 変換後の3次元正方行列 */
function map_m4_v3(vl, m4, w) {
    if (w === void 0) { w = 1; }
    return vl.map(function (v) { return vc.v4_to_v3(m4.map(vc.v3_to_v4(v, w))); });
}
exports.map_m4_v3 = map_m4_v3;
/** 平行移動写像 */
function trans_m4(v) {
    v = v instanceof Array ? v : v._v;
    return M4Impl.FromRows([
        [1, 0, 0, v[0]],
        [0, 1, 0, v[1]],
        [0, 0, 1, v[2]],
        [0, 0, 0, 1],
    ]);
}
exports.trans_m4 = trans_m4;
/** 平行移動写像 */
function trans_v3_m4(v3) {
    return trans_m4(v3);
}
exports.trans_v3_m4 = trans_v3_m4;
/** 拡大縮小写像 */
function scale_m3(v) {
    v = v instanceof Array ? v : v._v;
    return M3Impl.FromRows([
        [v[0], 0, 0],
        [0, v[1], 0],
        [0, 0, v[2]],
    ]);
}
exports.scale_m3 = scale_m3;
/** 拡大縮小写像 */
function scale_m4(v) {
    return m3_m4(scale_m3(v));
}
exports.scale_m4 = scale_m4;
/** x軸回転写像 */
function rot_x_m3(rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return M3Impl.FromRows([
        [1, 0, 0],
        [0, c, -s],
        [0, s, c],
    ]);
}
exports.rot_x_m3 = rot_x_m3;
/** x軸回転写像 */
function rot_x_m4(rad) {
    return m3_m4(rot_x_m3(rad));
}
exports.rot_x_m4 = rot_x_m4;
/** y軸回転写像 */
function rot_y_m3(rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return M3Impl.FromRows([
        [c, 0, s],
        [0, 1, 0],
        [-s, 0, c],
    ]);
}
exports.rot_y_m3 = rot_y_m3;
/** y軸回転写像 */
function rot_y_m4(rad) {
    return m3_m4(rot_y_m3(rad));
}
exports.rot_y_m4 = rot_y_m4;
/** z軸回転写像 */
function rot_z_m3(rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return M3Impl.FromRows([
        [c, -s, 0],
        [s, c, 0],
        [0, 0, 1],
    ]);
}
exports.rot_z_m3 = rot_z_m3;
/** z軸回転写像 */
function rot_z_m4(rad) {
    return m3_m4(rot_z_m3(rad));
}
exports.rot_z_m4 = rot_z_m4;
/** x軸ベクトルをv3ベクトルと平行にする回転写像 */
function rot_yz_x_m3(v3) {
    var x = v3.x;
    var y = v3.y;
    var z = v3.z;
    var radY = -Math.atan2(z, Math.sqrt(x * x + y * y));
    var radZ = Math.atan2(y, x);
    var mxRotY = rot_y_m3(radY);
    var mxRotZ = rot_z_m3(radZ);
    return mxRotZ.mul(mxRotY);
}
exports.rot_yz_x_m3 = rot_yz_x_m3;
/** x軸ベクトルをv3ベクトルと平行にする回転写像 */
function rot_yz_x_m4(v3) {
    return m3_m4(rot_yz_x_m3(v3));
}
exports.rot_yz_x_m4 = rot_yz_x_m4;
/** z軸ベクトルをv3ベクトルと平行にする回転写像 */
function rot_yz_z_m3(v3) {
    var x = v3.x;
    var y = v3.y;
    var z = v3.z;
    var radY = ut.deg90 - Math.atan2(z, Math.sqrt(x * x + y * y));
    var radZ = Math.atan2(y, x);
    var mxRotY = rot_y_m3(radY);
    var mxRotZ = rot_z_m3(radZ);
    return mxRotZ.mul(mxRotY);
}
exports.rot_yz_z_m3 = rot_yz_z_m3;
/** z軸ベクトルをv3ベクトルと平行にする回転写像 */
function rot_yz_z_m4(v3) {
    return m3_m4(rot_yz_z_m3(v3));
}
exports.rot_yz_z_m4 = rot_yz_z_m4;
/** オイラー角XYZの回転写像 */
function rot_xyz_m3(radX, radY, radZ) {
    return rot_x_m3(radX)
        .mul(rot_y_m3(radY))
        .mul(rot_z_m3(radZ));
}
exports.rot_xyz_m3 = rot_xyz_m3;
/** オイラー角XYZの回転写像 */
function rot_xyz_m4(radX, radY, radZ) {
    return m3_m4(rot_xyz_m3(radX, radY, radZ));
}
exports.rot_xyz_m4 = rot_xyz_m4;
/** オイラー角XYZの逆回転写像 */
function rot_inv_xyz_m3(radX, radY, radZ) {
    return rot_z_m3(-radZ)
        .mul(rot_y_m3(-radY))
        .mul(rot_x_m3(-radX));
}
exports.rot_inv_xyz_m3 = rot_inv_xyz_m3;
/** オイラー角XYZの回転写像 */
function rot_inv_xyz_m4(radX, radY, radZ) {
    return m3_m4(rot_inv_xyz_m3(radX, radY, radZ));
}
exports.rot_inv_xyz_m4 = rot_inv_xyz_m4;
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
