"use strict";
// Square Matrix 正方行列
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("./utility");
var vc = require("./vector");
var fn;
(function (fn) {
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
var priv;
(function (priv) {
    var M2Impl = (function () {
        function M2Impl(rows) {
            this._m = fn.clone(rows, M2Impl.Dim, M2Impl.Dim);
        }
        M2Impl.FromRows = function (rows) { return new M2Impl(rows); };
        M2Impl.FromCols = function (cols) { return new M2Impl(fn.transpose(cols)); };
        M2Impl.prototype.array_rows = function () {
            return fn.clone(this._m, M2Impl.Dim, M2Impl.Dim);
        };
        M2Impl.prototype.array_cols = function () {
            return fn.transpose(this._m);
        };
        M2Impl.prototype.mul = function (dist) {
            return M2Impl.FromRows(fn.mul(this._m, dist._m));
        };
        M2Impl.prototype.map_v2 = function (v) {
            return vc.array_to_v2(fn.map(this._m, v._v));
        };
        M2Impl.Dim = 2;
        return M2Impl;
    }());
    priv.M2Impl = M2Impl;
    var M3Impl = (function () {
        function M3Impl(rows) {
            this._m = fn.clone(rows, M3Impl.Dim, M3Impl.Dim);
        }
        M3Impl.FromRows = function (rows) { return new M3Impl(rows); };
        M3Impl.FromCols = function (cols) { return new M3Impl(fn.transpose(cols)); };
        M3Impl.prototype.array_rows = function () {
            return fn.clone(this._m, M3Impl.Dim, M3Impl.Dim);
        };
        M3Impl.prototype.array_cols = function () {
            return fn.transpose(this._m);
        };
        M3Impl.prototype.mul = function (dist) {
            return M3Impl.FromRows(fn.mul(this._m, dist._m));
        };
        M3Impl.prototype.map_v3 = function (v) {
            return vc.array_to_v3(fn.map(this._m, v._v));
        };
        M3Impl.Dim = 3;
        return M3Impl;
    }());
    priv.M3Impl = M3Impl;
    var M4Impl = (function () {
        function M4Impl(rows) {
            this._m = fn.clone(rows, M4Impl.Dim, M4Impl.Dim);
        }
        M4Impl.FromRows = function (rows) { return new M4Impl(rows); };
        M4Impl.FromCols = function (cols) { return new M4Impl(fn.transpose(cols)); };
        M4Impl.prototype.array_rows = function () {
            return fn.clone(this._m, M4Impl.Dim, M4Impl.Dim);
        };
        M4Impl.prototype.array_cols = function () {
            return fn.transpose(this._m);
        };
        M4Impl.prototype.mul = function (dist) {
            return M4Impl.FromRows(fn.mul(this._m, dist._m));
        };
        M4Impl.prototype.map_v3 = function (v, w) {
            return vc.array_to_v3(fn.map(this._m, v._v.concat(w)));
        };
        M4Impl.prototype.map_v4 = function (v) {
            return vc.array_to_v4(fn.map(this._m, v._v));
        };
        M4Impl.Dim = 4;
        return M4Impl;
    }());
    priv.M4Impl = M4Impl;
})(priv || (priv = {}));
/** ([列番号][行番号]と表される2次元配列) -> 2次元正方行列オブジェクト */
exports.cols_to_m2 = function (cols) { return priv.M2Impl.FromCols(cols); };
/** ([行番号][列番号]と表される2次元配列) -> 2次元正方行列オブジェクト */
exports.rows_to_m2 = function (rows) { return priv.M2Impl.FromRows(rows); };
/** ([列番号][行番号]と表される2次元配列) -> 3次元正方行列オブジェクト */
exports.cols_to_m3 = function (cols) { return priv.M3Impl.FromCols(cols); };
/** ([行番号][列番号]と表される2次元配列) -> 3次元正方行列オブジェクト */
exports.rows_to_m3 = function (rows) { return priv.M3Impl.FromRows(rows); };
/** ([列番号][行番号]と表される2次元配列) -> 4次元正方行列オブジェクト */
exports.cols_to_m4 = function (cols) { return priv.M4Impl.FromCols(cols); };
/** ([行番号][列番号]と表される2次元配列) -> 4次元正方行列オブジェクト */
exports.rows_to_m4 = function (rows) { return priv.M4Impl.FromRows(rows); };
exports.v2cols_to_m2 = function (vl) { return priv.M2Impl.FromCols(vl.map(function (v) { return v._v; })); };
exports.v3cols_to_m3 = function (vl) { return priv.M3Impl.FromCols(vl.map(function (v) { return v._v; })); };
exports.v4cols_to_m4 = function (vl) { return priv.M4Impl.FromCols(vl.map(function (v) { return v._v; })); };
/** 2次元単位正方行列 */
exports.unit_m2 = priv.M2Impl.FromRows([
    [1, 0],
    [0, 1],
]);
/** 2次元単位正方行列 */
exports.unit_m3 = priv.M3Impl.FromRows([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
]);
/** 4次元単位正方行列 */
exports.unit_m4 = priv.M4Impl.FromRows([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
]);
/** (2次元正方行列) -> 3次元正方行列 */
function m2_m3(m2) {
    var m3rows = m2._m.map(function (row) { return row.concat(0); });
    m3rows.push([0, 0, 1]);
    return priv.M3Impl.FromRows(m3rows);
}
exports.m2_m3 = m2_m3;
/** (3次元正方行列) -> 2次元正方行列 */
function m3_m2(m3) {
    return priv.M2Impl.FromRows(m3._m);
}
exports.m3_m2 = m3_m2;
/** (3次元正方行列) -> 4次元正方行列 */
function m3_m4(m3) {
    var m4rows = m3._m.map(function (row) { return row.concat(0); });
    m4rows.push([0, 0, 0, 1]);
    return priv.M4Impl.FromRows(m4rows);
}
exports.m3_m4 = m3_m4;
/** (4次元正方行列) -> 3次元正方行列 */
function m4_m3(m4) {
    return priv.M3Impl.FromRows(m4._m);
}
exports.m4_m3 = m4_m3;
/** 3次元ベクトル配列に対するアフィン写像
    (3次元ベクトル配列, 4次元正方行列, 4次元ベクトルのw成分) -> 変換後の3次元正方行列 */
function map_m4_v3(vl, m4, w) {
    if (w === void 0) { w = 1; }
    return vl.map(function (v) { return vc.v4_to_v3(m4.map_v4(vc.v3_to_v4(v, w))); });
}
exports.map_m4_v3 = map_m4_v3;
/** 平行移動写像 */
function trans_m4(x, y, z) {
    return priv.M4Impl.FromRows([
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
function scale_m3(x, y, z) {
    return priv.M3Impl.FromRows([
        [x, 0, 0],
        [0, y, 0],
        [0, 0, z],
    ]);
}
exports.scale_m3 = scale_m3;
/** 拡大縮小写像 */
function scale_m4(x, y, z) {
    return m3_m4(scale_m3(x, y, z));
}
exports.scale_m4 = scale_m4;
/** 拡大縮小写像 */
function scale_v3_m3(v3) {
    return scale_m3(v3.x(), v3.y(), v3.z());
}
exports.scale_v3_m3 = scale_v3_m3;
/** 拡大縮小写像 */
function scale_v3_m4(v3) {
    return m3_m4(scale_v3_m3(v3));
}
exports.scale_v3_m4 = scale_v3_m4;
/** x軸回転写像 */
function rotX_m3(rad) {
    var c = ut.cos(rad);
    var s = ut.sin(rad);
    return priv.M3Impl.FromRows([
        [1, 0, 0],
        [0, c, -s],
        [0, s, c],
    ]);
}
exports.rotX_m3 = rotX_m3;
/** x軸回転写像 */
function rotX_m4(rad) {
    return m3_m4(rotX_m3(rad));
}
exports.rotX_m4 = rotX_m4;
/** y軸回転写像 */
function rotY_m3(rad) {
    var c = ut.cos(rad);
    var s = ut.sin(rad);
    return priv.M3Impl.FromRows([
        [c, 0, s],
        [0, 1, 0],
        [-s, 0, c],
    ]);
}
exports.rotY_m3 = rotY_m3;
/** y軸回転写像 */
function rotY_m4(rad) {
    return m3_m4(rotY_m3(rad));
}
exports.rotY_m4 = rotY_m4;
/** z軸回転写像 */
function rotZ_m3(rad) {
    var c = ut.cos(rad);
    var s = ut.sin(rad);
    return priv.M3Impl.FromRows([
        [c, -s, 0],
        [s, c, 0],
        [0, 0, 1],
    ]);
}
exports.rotZ_m3 = rotZ_m3;
/** z軸回転写像 */
function rotZ_m4(rad) {
    return m3_m4(rotZ_m3(rad));
}
exports.rotZ_m4 = rotZ_m4;
/** x軸ベクトルをv3ベクトルと平行にする回転写像 */
function rotYZ_x_m3(v3) {
    var x = v3.x();
    var y = v3.y();
    var z = v3.z();
    var radY = -ut.atan2(z, ut.sqrt(x * x + y * y));
    var radZ = ut.atan2(y, x);
    var mxRotY = rotY_m3(radY);
    var mxRotZ = rotZ_m3(radZ);
    return mxRotZ.mul(mxRotY);
}
exports.rotYZ_x_m3 = rotYZ_x_m3;
/** x軸ベクトルをv3ベクトルと平行にする回転写像 */
function rotYZ_x_m4(v3) {
    return m3_m4(rotYZ_x_m3(v3));
}
exports.rotYZ_x_m4 = rotYZ_x_m4;
/** z軸ベクトルをv3ベクトルと平行にする回転写像 */
function rotYZ_z_m3(v3) {
    var x = v3.x();
    var y = v3.y();
    var z = v3.z();
    var radY = ut.deg90 - ut.atan2(z, ut.sqrt(x * x + y * y));
    var radZ = ut.atan2(y, x);
    var mxRotY = rotY_m3(radY);
    var mxRotZ = rotZ_m3(radZ);
    return mxRotZ.mul(mxRotY);
}
exports.rotYZ_z_m3 = rotYZ_z_m3;
/** z軸ベクトルをv3ベクトルと平行にする回転写像 */
function rotYZ_z_m4(v3) {
    return m3_m4(rotYZ_z_m3(v3));
}
exports.rotYZ_z_m4 = rotYZ_z_m4;
/** オイラー角XYZの回転写像 */
function rotXYZ_m3(radX, radY, radZ) {
    return rotX_m3(radX)
        .mul(rotY_m3(radY))
        .mul(rotZ_m3(radZ));
}
exports.rotXYZ_m3 = rotXYZ_m3;
/** オイラー角XYZの回転写像 */
function rotXYZ_m4(radX, radY, radZ) {
    return m3_m4(rotXYZ_m3(radX, radY, radZ));
}
exports.rotXYZ_m4 = rotXYZ_m4;
/** オイラー角XYZの逆回転写像 */
function rotInvXYZ_m3(radX, radY, radZ) {
    return rotZ_m3(-radZ)
        .mul(rotY_m3(-radY))
        .mul(rotX_m3(-radX));
}
exports.rotInvXYZ_m3 = rotInvXYZ_m3;
/** オイラー角XYZの回転写像 */
function rotInvXYZ_m4(radX, radY, radZ) {
    return m3_m4(rotInvXYZ_m3(radX, radY, radZ));
}
exports.rotInvXYZ_m4 = rotInvXYZ_m4;
function compositeLeft_m2(mm) {
    return mm.reduce(function (a, b) { return b.mul(a); });
}
exports.compositeLeft_m2 = compositeLeft_m2;
function compositeLeft_m3(mm) {
    return mm.reduce(function (a, b) { return b.mul(a); });
}
exports.compositeLeft_m3 = compositeLeft_m3;
function compositeLeft_m4(mm) {
    return mm.reduce(function (a, b) { return b.mul(a); });
}
exports.compositeLeft_m4 = compositeLeft_m4;
