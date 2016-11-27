// Square Matrix 正方行列
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vector = require("./vector");
function mul(m1, m2) {
    var dim = m1.dim();
    var m1rows = m1.rows();
    var m2cols = m2.cols();
    var m = [];
    for (var r = 0; r < dim; r++) {
        var v = [];
        for (var c = 0; c < dim; c++) {
            v.push(vector.ip(m1rows[r], m2cols[c], dim));
        }
        m.push(v);
    }
    return m;
}
exports.mul = mul;
function scalar(m1, n) {
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
exports.scalar = scalar;
var Matrix = (function () {
    function Matrix(mx) {
        this.mx = mx;
    }
    Matrix.FromRows = function (rows) {
        return new Matrix(rows);
    };
    Matrix.FromCols = function (cols) {
        return new Matrix(Matrix.Transpose(cols));
    };
    Matrix.Transpose = function (cols) {
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
    Matrix.prototype.dim = function () {
        return this.mx.length;
    };
    Matrix.prototype.row = function (r) {
        return this.mx[r];
    };
    Matrix.prototype.rows = function () {
        return this.mx;
    };
    Matrix.prototype.cols = function () {
        var m = [];
        for (var c = 0; c < this.dim(); c++) {
            m.push(this.col[c]);
        }
        return m;
    };
    Matrix.prototype.col = function (c) {
        var v = [];
        for (var r = 0; r < this.dim(); r++) {
            v.push(this.mx[r][c]);
        }
        return v;
    };
    Matrix.prototype.toString = function () {
        var d = this.dim();
        return this.mx.slice(0, d).map(function (v) { return ("(" + v.slice(0, d).join(', ') + ")"); }).join(', ');
    };
    Matrix.prototype.mul = function (dist) {
        return Matrix.FromRows(mul(this, dist));
    };
    Matrix.prototype.scalar = function (n) {
        return Matrix.FromRows(scalar(this, n));
    };
    return Matrix;
})();
exports.Matrix = Matrix;
var Matrix2 = (function (_super) {
    __extends(Matrix2, _super);
    function Matrix2() {
        _super.apply(this, arguments);
    }
    Matrix2.FromRows = function (rows) {
        return new Matrix2(rows);
    };
    Matrix2.FromCols = function (cols) {
        return new Matrix2(Matrix.Transpose(cols));
    };
    Matrix2.prototype.dim = function () {
        return 2;
    };
    Matrix2.prototype.mul = function (dist) {
        return Matrix2.FromRows(mul(this, dist));
    };
    Matrix2.prototype.scalar = function (n) {
        return Matrix2.FromRows(scalar(this, n));
    };
    return Matrix2;
})(Matrix);
exports.Matrix2 = Matrix2;
var Matrix3 = (function (_super) {
    __extends(Matrix3, _super);
    function Matrix3() {
        _super.apply(this, arguments);
    }
    Matrix3.FromRows = function (rows) {
        return new Matrix3(rows);
    };
    Matrix3.FromCols = function (cols) {
        return new Matrix3(Matrix.Transpose(cols));
    };
    Matrix3.prototype.dim = function () {
        return 3;
    };
    Matrix3.prototype.mul = function (dist) {
        return Matrix3.FromRows(mul(this, dist));
    };
    Matrix3.prototype.scalar = function (n) {
        return Matrix3.FromRows(scalar(this, n));
    };
    return Matrix3;
})(Matrix);
exports.Matrix3 = Matrix3;
var Matrix4 = (function (_super) {
    __extends(Matrix4, _super);
    function Matrix4() {
        _super.apply(this, arguments);
    }
    Matrix4.FromRows = function (rows) {
        return new Matrix4(rows);
    };
    Matrix4.FromCols = function (cols) {
        return new Matrix4(Matrix.Transpose(cols));
    };
    Matrix4.prototype.dim = function () {
        return 4;
    };
    Matrix4.prototype.mul = function (dist) {
        return Matrix4.FromRows(mul(this, dist));
    };
    Matrix4.prototype.scalar = function (n) {
        return Matrix4.FromRows(scalar(this, n));
    };
    return Matrix4;
})(Matrix);
exports.Matrix4 = Matrix4;
//# sourceMappingURL=matrix.js.map