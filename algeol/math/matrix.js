// Square Matrix 正方行列
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vc = require("./vector");
var fn;
(function (fn) {
    /** Multiplication - 乗算
        (左辺行列, 右辺行列) -> 左辺行列*右辺行列の乗算結果を表す2次元配列 */
    function mul(m1rows, m2cols) {
        var orderR = m1rows.length;
        var orderC = m2cols.length;
        var m = new Array(orderR);
        for (var r = 0; r < orderR; r++) {
            m[r] = new Array(orderC);
            for (var c = 0; c < orderC; c++) {
                m[r][c] = vc.fn.ip(m1rows[r], m2cols[c]);
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
    function _mul(m1, m2) {
        var dim = m1.dim();
        var m1rows = m1.rows();
        var m2cols = m2.cols();
        var m = [];
        for (var r = 0; r < dim; r++) {
            var v = [];
            for (var c = 0; c < dim; c++) {
                v.push(vc.fn.ip(m1rows[r], m2cols[c]));
            }
            m.push(v);
        }
        return m;
    }
    fn._mul = _mul;
    function _scalar(m1, n) {
        var dim = m1.dim();
        var m = [];
        for (var r = 0; r < dim; r++) {
            var v = [];
            for (var c = 0; c < dim; c++) {
                v.push(m1[r][c] * n);
            }
            m.push(v);
        }
        return m;
    }
    fn._scalar = _scalar;
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
})();
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
})();
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
})();
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
exports.unit_m2 = M2Impl.FromRows([
    [1, 0],
    [0, 1],
]);
exports.unit_m3 = M3Impl.FromRows([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
]);
exports.unit_m4 = M4Impl.FromRows([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
]);
function m2_m3(m2) {
    var m3rows = m2._ref().map(function (row) { return row.concat(0); });
    m3rows.push([0, 0, 1]);
    return M3Impl.FromRows(m3rows);
}
exports.m2_m3 = m2_m3;
function m3_m2(m3) {
    return M2Impl.FromRows(m3._ref());
}
exports.m3_m2 = m3_m2;
function m3_m4(m3) {
    var m4rows = m3._ref().map(function (row) { return row.concat(0); });
    m4rows.push([0, 0, 0, 1]);
    return M4Impl.FromRows(m4rows);
}
exports.m3_m4 = m3_m4;
function m4_m3(m4) {
    return M3Impl.FromRows(m4._ref());
}
exports.m4_m3 = m4_m3;
function map_m4_v3(vl, m4, w) {
    if (w === void 0) { w = 1; }
    return vl.map(function (v) { return vc.v4_v3(m4.map(vc.v3_v4(v, w))); });
}
exports.map_m4_v3 = map_m4_v3;
function trans_m4(x, y, z) {
    return M4Impl.FromRows([
        [1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1],
    ]);
}
exports.trans_m4 = trans_m4;
function trans_v3_m4(v3) {
    return trans_m4(v3.x(), v3.y(), v3.z());
}
exports.trans_v3_m4 = trans_v3_m4;
function scale_m4(x, y, z) {
    return M4Impl.FromRows([
        [x, 0, 0, 0],
        [0, y, 0, 0],
        [0, 0, z, 0],
        [0, 0, 0, 1],
    ]);
}
exports.scale_m4 = scale_m4;
function scale_v3_m4(v3) {
    return scale_m4(v3.x(), v3.y(), v3.z());
}
exports.scale_v3_m4 = scale_v3_m4;
function rotX_m4(rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return M4Impl.FromRows([
        [1, 0, 0, 0],
        [0, c, -s, 0],
        [0, s, c, 0],
        [0, 0, 0, 1],
    ]);
}
exports.rotX_m4 = rotX_m4;
function rotY_m4(rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return M4Impl.FromRows([
        [c, 0, s, 0],
        [0, 1, 0, 0],
        [-s, 0, c, 0],
        [0, 0, 0, 1],
    ]);
}
exports.rotY_m4 = rotY_m4;
function rotZ_m4(rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return M4Impl.FromRows([
        [c, -s, 0, 0],
        [s, c, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ]);
}
exports.rotZ_m4 = rotZ_m4;
var _Matrix = (function () {
    function _Matrix(mx) {
        this.mx = mx;
    }
    _Matrix.FromRows = function (rows) {
        return new _Matrix(rows);
    };
    _Matrix.FromCols = function (cols) {
        return new _Matrix(_Matrix.Transpose(cols));
    };
    _Matrix.Transpose = function (cols) {
        var collen = cols.length;
        var rowlen = cols[0].length;
        var rows = [];
        for (var r = 0; r < rowlen; r++) {
            var v = [];
            for (var c = 0; c < collen; c++) {
                v.push(cols[c][r]);
            }
            rows.push(v);
        }
        return rows;
    };
    _Matrix.prototype.dim = function () {
        return this.mx.length;
    };
    _Matrix.prototype.row = function (r) {
        return this.mx[r];
    };
    _Matrix.prototype.rows = function () {
        return this.mx;
    };
    _Matrix.prototype.cols = function () {
        var m = [];
        for (var c = 0; c < this.dim(); c++) {
            m.push(this.col[c]);
        }
        return m;
    };
    _Matrix.prototype.col = function (c) {
        var v = [];
        for (var r = 0; r < this.dim(); r++) {
            v.push(this.mx[r][c]);
        }
        return v;
    };
    _Matrix.prototype.toString = function () {
        var d = this.dim();
        return this.mx.slice(0, d).map(function (v) { return ("(" + v.slice(0, d).join(', ') + ")"); }).join(', ');
    };
    _Matrix.prototype.mul = function (dist) {
        return _Matrix.FromRows(fn._mul(this, dist));
    };
    _Matrix.prototype.scalar = function (n) {
        return _Matrix.FromRows(fn._scalar(this, n));
    };
    return _Matrix;
})();
exports._Matrix = _Matrix;
var _Matrix2 = (function (_super) {
    __extends(_Matrix2, _super);
    function _Matrix2() {
        _super.apply(this, arguments);
    }
    _Matrix2.FromRows = function (rows) {
        return new _Matrix2(rows);
    };
    _Matrix2.FromCols = function (cols) {
        return new _Matrix2(_Matrix.Transpose(cols));
    };
    _Matrix2.prototype.dim = function () {
        return 2;
    };
    _Matrix2.prototype.mul = function (dist) {
        return _Matrix2.FromRows(fn._mul(this, dist));
    };
    _Matrix2.prototype.scalar = function (n) {
        return _Matrix2.FromRows(fn._scalar(this, n));
    };
    return _Matrix2;
})(_Matrix);
exports._Matrix2 = _Matrix2;
var _Matrix3 = (function (_super) {
    __extends(_Matrix3, _super);
    function _Matrix3() {
        _super.apply(this, arguments);
    }
    _Matrix3.FromRows = function (rows) {
        return new _Matrix3(rows);
    };
    _Matrix3.FromCols = function (cols) {
        return new _Matrix3(_Matrix.Transpose(cols));
    };
    _Matrix3.prototype.dim = function () {
        return 3;
    };
    _Matrix3.prototype.mul = function (dist) {
        return _Matrix3.FromRows(fn._mul(this, dist));
    };
    _Matrix3.prototype.scalar = function (n) {
        return _Matrix3.FromRows(fn._scalar(this, n));
    };
    return _Matrix3;
})(_Matrix);
exports._Matrix3 = _Matrix3;
var _Matrix4 = (function (_super) {
    __extends(_Matrix4, _super);
    function _Matrix4() {
        _super.apply(this, arguments);
    }
    _Matrix4.FromRows = function (rows) {
        return new _Matrix4(rows);
    };
    _Matrix4.FromCols = function (cols) {
        return new _Matrix4(_Matrix.Transpose(cols));
    };
    _Matrix4.prototype.dim = function () {
        return 4;
    };
    _Matrix4.prototype.mul = function (dist) {
        return _Matrix4.FromRows(fn._mul(this, dist));
    };
    _Matrix4.prototype.scalar = function (n) {
        return _Matrix4.FromRows(fn._scalar(this, n));
    };
    return _Matrix4;
})(_Matrix);
exports._Matrix4 = _Matrix4;
//# sourceMappingURL=matrix.js.map