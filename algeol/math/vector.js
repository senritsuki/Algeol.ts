// Vector ベクトル
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fn;
(function (fn_1) {
    function op(a, dim, fn) {
        var v = [];
        for (var i = 0; i < dim; i++) {
            v.push(fn(a[i]));
        }
        return v;
    }
    fn_1.op = op;
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
        return op2(a, b, a.length, function (n1, n2) { return n1 + n2; });
    }
    fn_1.add = add;
    /** Subtraction 減算 */
    function sub(a, b) {
        return op2(a, b, a.length, function (n1, n2) { return n1 - n2; });
    }
    fn_1.sub = sub;
    /** スカラー倍 */
    function scalar(a, n) {
        return op(a, a.length, function (n1) { return n1 * n; });
    }
    fn_1.scalar = scalar;
    /** 要素ごとの積, アダマール積 */
    function hadamart(a, b) {
        return op2(a, b, a.length, function (n1, n2) { return n1 * n2; });
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
var V2Impl = (function () {
    function V2Impl(x, y) {
        this._v = [x, y];
    }
    V2Impl.FromArray = function (v) {
        return new V2Impl(v[0], v[1]);
    };
    V2Impl.prototype._ref = function () { return this._v; };
    V2Impl.prototype.array = function () { return this._v.slice(0); };
    V2Impl.prototype.x = function () { return this._v[0]; };
    V2Impl.prototype.y = function () { return this._v[1]; };
    V2Impl.prototype.clone = function () { return new V2Impl(this.x(), this.y()); };
    V2Impl.prototype.add = function (dist) { return V2Impl.FromArray(fn.add(this._ref(), dist._ref())); };
    V2Impl.prototype.sub = function (dist) { return V2Impl.FromArray(fn.sub(this._ref(), dist._ref())); };
    V2Impl.prototype.hadamart = function (dist) { return V2Impl.FromArray(fn.hadamart(this._ref(), dist._ref())); };
    V2Impl.prototype.scalar = function (n) { return V2Impl.FromArray(fn.scalar(this._ref(), n)); };
    V2Impl.prototype.ip = function (dist) { return fn.ip(this.array(), dist._ref()); };
    V2Impl.prototype.cp = function (dist) { return fn.cp2(this._ref(), dist._ref()); };
    V2Impl.prototype.unit = function () { return this.scalar(1 / this.length()); };
    V2Impl.prototype.lenght2 = function () { return this.ip(this); };
    V2Impl.prototype.length = function () { return Math.sqrt(this.lenght2()); };
    return V2Impl;
})();
var V3Impl = (function () {
    function V3Impl(x, y, z) {
        this._v = [x, y, z];
    }
    V3Impl.FromArray = function (v) {
        return new V3Impl(v[0], v[1], v[2]);
    };
    V3Impl.prototype._ref = function () { return this._v; };
    V3Impl.prototype.array = function () { return this._v.slice(0); };
    V3Impl.prototype.x = function () { return this._v[0]; };
    V3Impl.prototype.y = function () { return this._v[1]; };
    V3Impl.prototype.z = function () { return this._v[2]; };
    V3Impl.prototype.clone = function () { return new V3Impl(this.x(), this.y(), this.z()); };
    V3Impl.prototype.add = function (dist) { return V3Impl.FromArray(fn.add(this._ref(), dist._ref())); };
    V3Impl.prototype.sub = function (dist) { return V3Impl.FromArray(fn.sub(this._ref(), dist._ref())); };
    V3Impl.prototype.hadamart = function (dist) { return V3Impl.FromArray(fn.hadamart(this._ref(), dist._ref())); };
    V3Impl.prototype.scalar = function (n) { return V3Impl.FromArray(fn.scalar(this._ref(), n)); };
    V3Impl.prototype.ip = function (dist) { return fn.ip(this.array(), dist._ref()); };
    V3Impl.prototype.cp = function (dist) { return V3Impl.FromArray(fn.cp3(this._ref(), dist._ref())); };
    V3Impl.prototype.unit = function () { return this.scalar(1 / this.length()); };
    V3Impl.prototype.lenght2 = function () { return this.ip(this); };
    V3Impl.prototype.length = function () { return Math.sqrt(this.lenght2()); };
    return V3Impl;
})();
var V4Impl = (function () {
    function V4Impl(x, y, z, w) {
        this._v = [x, y, z, w];
    }
    V4Impl.FromArray = function (v) {
        return new V4Impl(v[0], v[1], v[2], v[3]);
    };
    V4Impl.prototype._ref = function () { return this._v; };
    V4Impl.prototype.array = function () { return this._v.slice(0); };
    V4Impl.prototype.x = function () { return this._v[0]; };
    V4Impl.prototype.y = function () { return this._v[1]; };
    V4Impl.prototype.z = function () { return this._v[2]; };
    V4Impl.prototype.w = function () { return this._v[3]; };
    V4Impl.prototype.clone = function () { return new V4Impl(this.x(), this.y(), this.z(), this.w()); };
    V4Impl.prototype.add = function (dist) { return V4Impl.FromArray(fn.add(this._ref(), dist._ref())); };
    V4Impl.prototype.sub = function (dist) { return V4Impl.FromArray(fn.sub(this._ref(), dist._ref())); };
    V4Impl.prototype.hadamart = function (dist) { return V4Impl.FromArray(fn.hadamart(this._ref(), dist._ref())); };
    V4Impl.prototype.scalar = function (n) { return V4Impl.FromArray(fn.scalar(this._ref(), n)); };
    V4Impl.prototype.ip = function (dist) { return fn.ip(this.array(), dist._ref()); };
    V4Impl.prototype.unit = function () { return this.scalar(1 / this.length()); };
    V4Impl.prototype.lenght2 = function () { return this.ip(this); };
    V4Impl.prototype.length = function () { return Math.sqrt(this.lenght2()); };
    return V4Impl;
})();
/** (x成分, y成分) -> 2次元ベクトルオブジェクト */
function v2(x, y) { return new V2Impl(x, y); }
exports.v2 = v2;
/** (xyz成分を含む配列) -> 2次元ベクトルオブジェクト */
function ar_v2(v) { return V2Impl.FromArray(v); }
exports.ar_v2 = ar_v2;
/** (x成分, y成分, z成分) -> 3次元ベクトルオブジェクト */
function v3(x, y, z) { return new V3Impl(x, y, z); }
exports.v3 = v3;
/** (xyz成分を含む配列) -> 3次元ベクトルオブジェクト */
function ar_v3(v) { return V3Impl.FromArray(v); }
exports.ar_v3 = ar_v3;
/** (x成分, y成分, z成分, w成分) -> 4次元ベクトルオブジェクト */
function v4(x, y, z, w) { return new V4Impl(x, y, z, w); }
exports.v4 = v4;
/** (xyzw成分を含む配列) -> 4次元ベクトルオブジェクト */
function ar_v4(v) { return V4Impl.FromArray(v); }
exports.ar_v4 = ar_v4;
/** (2次元ベクトルオブジェクト, z成分) -> 3次元ベクトルオブジェクト */
function v2_v3(v2, z) { return V3Impl.FromArray(v2._ref().concat(z)); }
exports.v2_v3 = v2_v3;
/** (3次元ベクトルオブジェクト) -> 2次元ベクトルオブジェクト */
function v3_v2(v3) { return V2Impl.FromArray(v3._ref()); }
exports.v3_v2 = v3_v2;
/** (3次元ベクトルオブジェクト, w成分) -> 4次元ベクトルオブジェクト */
function v3_v4(v3, w) { return V4Impl.FromArray(v3._ref().concat(w)); }
exports.v3_v4 = v3_v4;
/** (4次元ベクトルオブジェクト) -> 3次元ベクトルオブジェクト */
function v4_v3(v4) { return V3Impl.FromArray(v4._ref()); }
exports.v4_v3 = v4_v3;
exports.zero_v3 = v3(0, 0, 0);
exports.unitX_v3 = v3(1, 0, 0);
exports.unitY_v3 = v3(0, 1, 0);
exports.unitZ_v3 = v3(0, 0, 1);
/** Vector ベクトル */
var _Vector = (function () {
    function _Vector(v) {
        this.v = v;
    }
    _Vector.FromArray = function (v) {
        return new _Vector(v);
    };
    _Vector.prototype.dim = function () {
        return this.v.length;
    };
    _Vector.prototype.toString = function () {
        return this.v.join(', ');
    };
    _Vector.prototype.add = function (dist) {
        return _Vector.FromArray(fn.add(this.v, dist.v));
    };
    _Vector.prototype.sub = function (dist) {
        return _Vector.FromArray(fn.sub(this.v, dist.v));
    };
    _Vector.prototype.hadamart = function (dist) {
        return _Vector.FromArray(fn.hadamart(this.v, dist.v));
    };
    _Vector.prototype.scalar = function (n) {
        return _Vector.FromArray(fn.scalar(this.v, n));
    };
    /** Inner Product, Dot Product 内積 */
    _Vector.prototype.ip = function (dist) {
        return fn.ip(this.v, dist.v);
    };
    /** Unit Vector 単位ベクトル */
    _Vector.prototype.normalize = function () {
        return this.scalar(1 / this.length());
    };
    /** 長さの二乗 */
    _Vector.prototype.length2 = function () {
        return this.ip(this);
    };
    /** 長さ */
    _Vector.prototype.length = function () {
        return Math.sqrt(this.length2());
    };
    return _Vector;
})();
exports._Vector = _Vector;
var _Vector2 = (function (_super) {
    __extends(_Vector2, _super);
    function _Vector2(x, y) {
        _super.call(this, [x, y]);
    }
    _Vector2.FromArray = function (v) {
        return new _Vector2(v[0], v[1]);
    };
    _Vector2.prototype.dim = function () {
        return 2;
    };
    _Vector2.prototype.x = function () {
        return this.v[0];
    };
    _Vector2.prototype.y = function () {
        return this.v[1];
    };
    _Vector2.prototype.add = function (dist) {
        return _Vector2.FromArray(fn.add(this.v, dist.v));
    };
    _Vector2.prototype.sub = function (dist) {
        return _Vector2.FromArray(fn.sub(this.v, dist.v));
    };
    _Vector2.prototype.hadamart = function (dist) {
        return _Vector2.FromArray(fn.hadamart(this.v, dist.v));
    };
    _Vector2.prototype.scalar = function (n) {
        return _Vector2.FromArray(fn.scalar(this.v, n));
    };
    /** Inner Product, Dot Product 内積 */
    _Vector2.prototype.ip = function (dist) {
        return _super.prototype.ip.call(this, dist);
    };
    /** Unit Vector 単位ベクトル */
    _Vector2.prototype.normalize = function () {
        return this.scalar(1 / this.length());
    };
    /** Cross Product 外積 */
    _Vector2.prototype.cp = function (dist) {
        return fn.cp2(this.v, dist.v);
    };
    return _Vector2;
})(_Vector);
exports._Vector2 = _Vector2;
var _Vector3 = (function (_super) {
    __extends(_Vector3, _super);
    function _Vector3(x, y, z) {
        _super.call(this, [x, y, z]);
    }
    _Vector3.FromArray = function (v) {
        return new _Vector3(v[0], v[1], v[2]);
    };
    _Vector3.prototype.dim = function () {
        return 3;
    };
    _Vector3.prototype.x = function () {
        return this.v[0];
    };
    _Vector3.prototype.y = function () {
        return this.v[1];
    };
    _Vector3.prototype.z = function () {
        return this.v[2];
    };
    _Vector3.prototype.add = function (dist) {
        return _Vector3.FromArray(fn.add(this.v, dist.v));
    };
    _Vector3.prototype.sub = function (dist) {
        return _Vector3.FromArray(fn.sub(this.v, dist.v));
    };
    _Vector3.prototype.hadamart = function (dist) {
        return _Vector3.FromArray(fn.hadamart(this.v, dist.v));
    };
    _Vector3.prototype.scalar = function (n) {
        return _Vector3.FromArray(fn.scalar(this.v, n));
    };
    /** Inner Product, Dot Product 内積 */
    _Vector3.prototype.ip = function (dist) {
        return _super.prototype.ip.call(this, dist);
    };
    /** Unit Vector 単位ベクトル */
    _Vector3.prototype.normalize = function () {
        return this.scalar(1 / this.length());
    };
    /** Cross Product 外積 */
    _Vector3.prototype.cp = function (dist) {
        return _Vector3.FromArray(fn.cp3(this.v, dist.v));
    };
    return _Vector3;
})(_Vector);
exports._Vector3 = _Vector3;
var _Vector4 = (function (_super) {
    __extends(_Vector4, _super);
    function _Vector4(x, y, z, w) {
        _super.call(this, [x, y, z, w]);
    }
    _Vector4.FromArray = function (v) {
        return new _Vector4(v[0], v[1], v[2], v[3]);
    };
    _Vector4.prototype.dim = function () {
        return 4;
    };
    _Vector4.prototype.x = function () {
        return this.v[0];
    };
    _Vector4.prototype.y = function () {
        return this.v[1];
    };
    _Vector4.prototype.z = function () {
        return this.v[2];
    };
    _Vector4.prototype.w = function () {
        return this.v[3];
    };
    _Vector4.prototype.add = function (dist) {
        return _Vector4.FromArray(fn.add(this.v, dist.v));
    };
    _Vector4.prototype.sub = function (dist) {
        return _Vector4.FromArray(fn.sub(this.v, dist.v));
    };
    _Vector4.prototype.hadamart = function (dist) {
        return _Vector4.FromArray(fn.hadamart(this.v, dist.v));
    };
    _Vector4.prototype.scalar = function (n) {
        return _Vector4.FromArray(fn.scalar(this.v, n));
    };
    /** Inner Product, Dot Product 内積 */
    _Vector4.prototype.ip = function (dist) {
        return _super.prototype.ip.call(this, dist);
    };
    /** Unit Vector 単位ベクトル */
    _Vector4.prototype.normalize = function () {
        return this.scalar(1 / this.length());
    };
    return _Vector4;
})(_Vector);
exports._Vector4 = _Vector4;
//# sourceMappingURL=vector.js.map