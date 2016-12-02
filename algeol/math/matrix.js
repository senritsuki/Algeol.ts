// Square Matrix 正方行列
"use strict";
var ut = require("../util/util");
var vc = require("./vector");
var fn;
(function (fn) {
    /** Clone - 複製
        (行列, 行数, 列数) -> 行列の複製結果を表す2次元配列 */
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
    fn.clone = clone;
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
    fn.transpose = transpose;
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
                m[r][c] = vc.fn.ip(m1[r], m2t[c]);
            }
        }
        return m;
    }
    fn.mul = mul;
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
    fn.scalar = scalar;
    /** Linear Mapping - 線形写像
        (左辺行列, 右辺ベクトル) -> 左辺行列*右辺ベクトルの演算結果を表す配列 */
    function map(m1, v1) {
        var orderR = m1.length;
        var v = new Array(orderR);
        for (var i = 0; i < orderR; i++) {
            v[i] = vc.fn.ip(m1[i], v1);
        }
        return v;
    }
    fn.map = map;
})(fn = exports.fn || (exports.fn = {}));
var M2Impl = (function () {
    function M2Impl(rows) {
        this._rows = fn.clone(rows, M2Impl.Dim, M2Impl.Dim);
    }
    M2Impl.FromRows = function (rows) { return new M2Impl(rows); };
    M2Impl.FromCols = function (cols) { return new M2Impl(fn.transpose(cols)); };
    M2Impl.prototype._ref = function () { return this._rows; };
    M2Impl.prototype.array_rows = function () { return fn.clone(this._rows, M2Impl.Dim, M2Impl.Dim); };
    M2Impl.prototype.array_cols = function () { return fn.transpose(this._rows); };
    M2Impl.prototype.mul = function (dist) { return M2Impl.FromRows(fn.mul(this._ref(), dist._ref())); };
    M2Impl.prototype.map = function (v) { return vc.ar_v2(fn.map(this._ref(), v._ref())); };
    M2Impl.Dim = 2;
    return M2Impl;
}());
var M3Impl = (function () {
    function M3Impl(rows) {
        this._rows = fn.clone(rows, M3Impl.Dim, M3Impl.Dim);
    }
    M3Impl.FromRows = function (rows) { return new M3Impl(rows); };
    M3Impl.FromCols = function (cols) { return new M3Impl(fn.transpose(cols)); };
    M3Impl.prototype._ref = function () { return this._rows; };
    M3Impl.prototype.array_rows = function () { return fn.clone(this._rows, M3Impl.Dim, M3Impl.Dim); };
    M3Impl.prototype.array_cols = function () { return fn.transpose(this._rows); };
    M3Impl.prototype.mul = function (dist) { return M3Impl.FromRows(fn.mul(this._ref(), dist._ref())); };
    M3Impl.prototype.map = function (v) { return vc.ar_v3(fn.map(this._ref(), v._ref())); };
    M3Impl.Dim = 3;
    return M3Impl;
}());
var M4Impl = (function () {
    function M4Impl(rows) {
        this._rows = fn.clone(rows, M4Impl.Dim, M4Impl.Dim);
    }
    M4Impl.FromRows = function (rows) { return new M4Impl(rows); };
    M4Impl.FromCols = function (cols) { return new M4Impl(fn.transpose(cols)); };
    M4Impl.prototype._ref = function () { return this._rows; };
    M4Impl.prototype.array_rows = function () { return fn.clone(this._rows, M4Impl.Dim, M4Impl.Dim); };
    M4Impl.prototype.array_cols = function () { return fn.transpose(this._rows); };
    M4Impl.prototype.mul = function (dist) { return M4Impl.FromRows(fn.mul(this._ref(), dist._ref())); };
    M4Impl.prototype.map = function (v) { return vc.ar_v4(fn.map(this._ref(), v._ref())); };
    M4Impl.Dim = 4;
    return M4Impl;
}());
/** ([列番号][行番号]と表される2次元配列) -> 2次元正方行列オブジェクト */
function cols_m2(cols) { return M2Impl.FromCols(cols); }
exports.cols_m2 = cols_m2;
/** ([行番号][列番号]と表される2次元配列) -> 2次元正方行列オブジェクト */
function rows_m2(rows) { return M2Impl.FromRows(rows); }
exports.rows_m2 = rows_m2;
/** ([列番号][行番号]と表される2次元配列) -> 3次元正方行列オブジェクト */
function cols_m3(cols) { return M3Impl.FromCols(cols); }
exports.cols_m3 = cols_m3;
/** ([行番号][列番号]と表される2次元配列) -> 3次元正方行列オブジェクト */
function rows_m3(rows) { return M3Impl.FromRows(rows); }
exports.rows_m3 = rows_m3;
/** ([列番号][行番号]と表される2次元配列) -> 4次元正方行列オブジェクト */
function cols_m4(cols) { return M4Impl.FromCols(cols); }
exports.cols_m4 = cols_m4;
/** ([行番号][列番号]と表される2次元配列) -> 4次元正方行列オブジェクト */
function rows_m4(rows) { return M4Impl.FromRows(rows); }
exports.rows_m4 = rows_m4;
function v2cols_m2(vl) { return M2Impl.FromCols(vl.map(function (v) { return v._ref(); })); }
exports.v2cols_m2 = v2cols_m2;
function v3cols_m3(vl) { return M3Impl.FromCols(vl.map(function (v) { return v._ref(); })); }
exports.v3cols_m3 = v3cols_m3;
function v4cols_m4(vl) { return M4Impl.FromCols(vl.map(function (v) { return v._ref(); })); }
exports.v4cols_m4 = v4cols_m4;
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
    var m3rows = m2._ref().map(function (row) { return row.concat(0); });
    m3rows.push([0, 0, 1]);
    return M3Impl.FromRows(m3rows);
}
exports.m2_m3 = m2_m3;
/** (3次元正方行列) -> 2次元正方行列 */
function m3_m2(m3) {
    return M2Impl.FromRows(m3._ref());
}
exports.m3_m2 = m3_m2;
/** (3次元正方行列) -> 4次元正方行列 */
function m3_m4(m3) {
    var m4rows = m3._ref().map(function (row) { return row.concat(0); });
    m4rows.push([0, 0, 0, 1]);
    return M4Impl.FromRows(m4rows);
}
exports.m3_m4 = m3_m4;
/** (4次元正方行列) -> 3次元正方行列 */
function m4_m3(m4) {
    return M3Impl.FromRows(m4._ref());
}
exports.m4_m3 = m4_m3;
/** 3次元ベクトル配列に対するアフィン写像
    (3次元ベクトル配列, 4次元正方行列, 4次元ベクトルのw成分) -> 変換後の3次元正方行列 */
function map_m4_v3(vl, m4, w) {
    if (w === void 0) { w = 1; }
    return vl.map(function (v) { return vc.v4_v3(m4.map(vc.v3_v4(v, w))); });
}
exports.map_m4_v3 = map_m4_v3;
/** 平行移動写像 */
function trans_m4(x, y, z) {
    return M4Impl.FromRows([
        [1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1],
    ]);
}
exports.trans_m4 = trans_m4;
/** 平行移動写像 */
function trans_v3_m4(v3) {
    return trans_m4(v3.x(), v3.y(), v3.z());
}
exports.trans_v3_m4 = trans_v3_m4;
/** 拡大縮小写像 */
function scale_m4(x, y, z) {
    return M4Impl.FromRows([
        [x, 0, 0, 0],
        [0, y, 0, 0],
        [0, 0, z, 0],
        [0, 0, 0, 1],
    ]);
}
exports.scale_m4 = scale_m4;
/** 拡大縮小写像 */
function scale_v3_m4(v3) {
    return scale_m4(v3.x(), v3.y(), v3.z());
}
exports.scale_v3_m4 = scale_v3_m4;
/** x軸回転写像 */
function rotX_m4(rad) {
    var c = ut.cos(rad);
    var s = ut.sin(rad);
    return M4Impl.FromRows([
        [1, 0, 0, 0],
        [0, c, -s, 0],
        [0, s, c, 0],
        [0, 0, 0, 1],
    ]);
}
exports.rotX_m4 = rotX_m4;
/** y軸回転写像 */
function rotY_m4(rad) {
    var c = ut.cos(rad);
    var s = ut.sin(rad);
    return M4Impl.FromRows([
        [c, 0, s, 0],
        [0, 1, 0, 0],
        [-s, 0, c, 0],
        [0, 0, 0, 1],
    ]);
}
exports.rotY_m4 = rotY_m4;
/** z軸回転写像 */
function rotZ_m4(rad) {
    var c = ut.cos(rad);
    var s = ut.sin(rad);
    return M4Impl.FromRows([
        [c, -s, 0, 0],
        [s, c, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ]);
}
exports.rotZ_m4 = rotZ_m4;
/** x軸ベクトルをv3ベクトルと平行にする回転写像 */
function rotYZ_x_m4(v3) {
    var x = v3.x();
    var y = v3.y();
    var z = v3.z();
    var radY = -ut.atan2(z, ut.sqrt(x * x + y * y));
    var radZ = ut.atan2(y, x);
    var mxRotY = rotY_m4(radY);
    var mxRotZ = rotZ_m4(radZ);
    return mxRotZ.mul(mxRotY);
}
exports.rotYZ_x_m4 = rotYZ_x_m4;
/** z軸ベクトルをv3ベクトルと平行にする回転写像 */
function rotYZ_z_m4(v3) {
    var x = v3.x();
    var y = v3.y();
    var z = v3.z();
    var radY = ut.deg90 - ut.atan2(z, ut.sqrt(x * x + y * y));
    var radZ = ut.atan2(y, x);
    var mxRotY = rotY_m4(radY);
    var mxRotZ = rotZ_m4(radZ);
    return mxRotZ.mul(mxRotY);
}
exports.rotYZ_z_m4 = rotYZ_z_m4;
//# sourceMappingURL=matrix.js.map