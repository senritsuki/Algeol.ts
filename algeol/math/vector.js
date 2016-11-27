// Vector ベクトル
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function op(a, dim, fn) {
    var v = [];
    for (var i = 0; i < dim; i++) {
        v.push(fn(a[i]));
    }
    return v;
}
exports.op = op;
function op2(a, b, dim, fn) {
    var v = [];
    for (var i = 0; i < dim; i++) {
        v.push(fn(a[i], b[i]));
    }
    return v;
}
exports.op2 = op2;
/** Addition 加算 */
function add(a, b, dim) {
    return op2(a, b, dim, function (n1, n2) { return n1 + n2; });
}
exports.add = add;
/** Subtraction 減算 */
function sub(a, b, dim) {
    return op2(a, b, dim, function (n1, n2) { return n1 - n2; });
}
exports.sub = sub;
/** スカラー倍 */
function scalar(a, n, dim) {
    return op(a, dim, function (n1) { return n1 * n; });
}
exports.scalar = scalar;
/** 要素ごとの積, アダマール積 */
function hadamart(a, b, dim) {
    return op2(a, b, dim, function (n1, n2) { return n1 * n2; });
}
exports.hadamart = hadamart;
/** Inner Product, Dot Product 内積 */
function ip(a, b, dim) {
    return hadamart(a, b, dim).reduce(function (a, b) { return a + b; });
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
/** Vector ベクトル */
var Vector = (function () {
    function Vector(v) {
        this.v = v;
    }
    Vector.FromArray = function (v) {
        return new Vector(v);
    };
    Vector.prototype.dim = function () {
        return this.v.length;
    };
    Vector.prototype.toString = function () {
        return this.v.join(', ');
    };
    Vector.prototype.add = function (dist) {
        return Vector.FromArray(add(this.v, dist.v, this.dim()));
    };
    Vector.prototype.sub = function (dist) {
        return Vector.FromArray(sub(this.v, dist.v, this.dim()));
    };
    Vector.prototype.hadamart = function (dist) {
        return Vector.FromArray(hadamart(this.v, dist.v, this.dim()));
    };
    Vector.prototype.scalar = function (n) {
        return Vector.FromArray(scalar(this.v, n, this.dim()));
    };
    /** Inner Product, Dot Product 内積 */
    Vector.prototype.ip = function (dist) {
        return ip(this.v, dist.v, this.dim());
    };
    /** Unit Vector 単位ベクトル */
    Vector.prototype.normalize = function () {
        return this.scalar(1 / this.length());
    };
    /** 長さの二乗 */
    Vector.prototype.length2 = function () {
        return this.ip(this);
    };
    /** 長さ */
    Vector.prototype.length = function () {
        return Math.sqrt(this.length2());
    };
    return Vector;
})();
exports.Vector = Vector;
var Vector2 = (function (_super) {
    __extends(Vector2, _super);
    function Vector2(x, y) {
        _super.call(this, [x, y]);
    }
    Vector2.FromArray = function (v) {
        return new Vector2(v[0], v[1]);
    };
    Vector2.prototype.dim = function () {
        return 2;
    };
    Vector2.prototype.x = function () {
        return this.v[0];
    };
    Vector2.prototype.y = function () {
        return this.v[1];
    };
    Vector2.prototype.add = function (dist) {
        return Vector2.FromArray(add(this.v, dist.v, this.dim()));
    };
    Vector2.prototype.sub = function (dist) {
        return Vector2.FromArray(sub(this.v, dist.v, this.dim()));
    };
    Vector2.prototype.hadamart = function (dist) {
        return Vector2.FromArray(hadamart(this.v, dist.v, this.dim()));
    };
    Vector2.prototype.scalar = function (n) {
        return Vector2.FromArray(scalar(this.v, n, this.dim()));
    };
    /** Inner Product, Dot Product 内積 */
    Vector2.prototype.ip = function (dist) {
        return _super.prototype.ip.call(this, dist);
    };
    /** Unit Vector 単位ベクトル */
    Vector2.prototype.normalize = function () {
        return this.scalar(1 / this.length());
    };
    /** Cross Product 外積 */
    Vector2.prototype.cp = function (dist) {
        return cp2(this.v, dist.v);
    };
    return Vector2;
})(Vector);
exports.Vector2 = Vector2;
var Vector3 = (function (_super) {
    __extends(Vector3, _super);
    function Vector3(x, y, z) {
        _super.call(this, [x, y, z]);
    }
    Vector3.FromArray = function (v) {
        return new Vector3(v[0], v[1], v[2]);
    };
    Vector3.prototype.dim = function () {
        return 3;
    };
    Vector3.prototype.x = function () {
        return this.v[0];
    };
    Vector3.prototype.y = function () {
        return this.v[1];
    };
    Vector3.prototype.z = function () {
        return this.v[2];
    };
    Vector3.prototype.add = function (dist) {
        return Vector3.FromArray(add(this.v, dist.v, this.dim()));
    };
    Vector3.prototype.sub = function (dist) {
        return Vector3.FromArray(sub(this.v, dist.v, this.dim()));
    };
    Vector3.prototype.hadamart = function (dist) {
        return Vector3.FromArray(hadamart(this.v, dist.v, this.dim()));
    };
    Vector3.prototype.scalar = function (n) {
        return Vector3.FromArray(scalar(this.v, n, this.dim()));
    };
    /** Inner Product, Dot Product 内積 */
    Vector3.prototype.ip = function (dist) {
        return _super.prototype.ip.call(this, dist);
    };
    /** Unit Vector 単位ベクトル */
    Vector3.prototype.normalize = function () {
        return this.scalar(1 / this.length());
    };
    /** Cross Product 外積 */
    Vector3.prototype.cp = function (dist) {
        return Vector3.FromArray(cp3(this.v, dist.v));
    };
    return Vector3;
})(Vector);
exports.Vector3 = Vector3;
var Vector4 = (function (_super) {
    __extends(Vector4, _super);
    function Vector4(x, y, z, w) {
        _super.call(this, [x, y, z, w]);
    }
    Vector4.FromArray = function (v) {
        return new Vector4(v[0], v[1], v[2], v[3]);
    };
    Vector4.prototype.dim = function () {
        return 4;
    };
    Vector4.prototype.x = function () {
        return this.v[0];
    };
    Vector4.prototype.y = function () {
        return this.v[1];
    };
    Vector4.prototype.z = function () {
        return this.v[2];
    };
    Vector4.prototype.w = function () {
        return this.v[3];
    };
    Vector4.prototype.add = function (dist) {
        return Vector4.FromArray(add(this.v, dist.v, this.dim()));
    };
    Vector4.prototype.sub = function (dist) {
        return Vector4.FromArray(sub(this.v, dist.v, this.dim()));
    };
    Vector4.prototype.hadamart = function (dist) {
        return Vector4.FromArray(hadamart(this.v, dist.v, this.dim()));
    };
    Vector4.prototype.scalar = function (n) {
        return Vector4.FromArray(scalar(this.v, n, this.dim()));
    };
    /** Inner Product, Dot Product 内積 */
    Vector4.prototype.ip = function (dist) {
        return _super.prototype.ip.call(this, dist);
    };
    /** Unit Vector 単位ベクトル */
    Vector4.prototype.normalize = function () {
        return this.scalar(1 / this.length());
    };
    return Vector4;
})(Vector);
exports.Vector4 = Vector4;
//# sourceMappingURL=vector.js.map