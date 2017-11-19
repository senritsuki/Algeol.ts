/** Curve with Parametric Equation - 3次元空間におけるパラメトリック方程式による曲線 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ut = require("../math/utility");
exports._E = 0.001;
var CDImpl = (function () {
    function CDImpl(_c, _d) {
        this._c = _c;
        this._d = _d;
    }
    CDImpl.prototype.c = function () { return this._c; };
    CDImpl.prototype.d = function () { return this._d; };
    return CDImpl;
})();
/** 位置ベクトルと方向ベクトルのペア */
function cd(c, d) {
    return new CDImpl(c, d);
}
exports.cd = cd;
var CurveArrayImpl = (function () {
    function CurveArrayImpl(_curves) {
        this._curves = _curves;
    }
    CurveArrayImpl.prototype.start = function () { return this.coord(0); };
    CurveArrayImpl.prototype.end = function () { return this.coord(1); };
    CurveArrayImpl.prototype.curves = function () { return this._curves.slice(0); };
    CurveArrayImpl.prototype.curveNum = function () { return this._curves.length; };
    CurveArrayImpl.prototype.controls = function () {
        return this._curves.map(function (c) { return c.controls(); }).reduce(function (a, b) { return a.concat(b); }, []);
    };
    CurveArrayImpl.prototype.cd = function (i, delta) {
        if (delta === void 0) { delta = exports._E; }
        var c = this.coord(i);
        var d1 = this.coord(i - delta);
        var d2 = this.coord(i + delta);
        return cd(c, d2.sub(d1));
    };
    CurveArrayImpl.prototype.coord = function (i) {
        var j = i <= 0 ?
            0 :
            i >= this._curves.length - 1 ?
                this._curves.length - 1 :
                ut.floor(i);
        var k = i - j;
        return this._curves[j].coord(k);
    };
    return CurveArrayImpl;
})();
var CurveBase = (function () {
    function CurveBase(_v) {
        this._v = _v;
    }
    CurveBase.prototype.start = function () { return this.coord(0); };
    CurveBase.prototype.end = function () { return this.coord(1); };
    CurveBase.prototype.controls = function () { return this._v.slice(0); };
    CurveBase.prototype.cd = function (i, delta) {
        if (delta === void 0) { delta = exports._E; }
        var c = this.coord(i);
        var d1 = this.coord(i - delta);
        var d2 = this.coord(i + delta);
        return cd(c, d2.sub(d1));
    };
    return CurveBase;
})();
/** (3次元ベクトル配列, 媒介変数) -> 3次元ベクトル を満たす任意の関数で定義される曲線 */
var LambdaCurve = (function (_super) {
    __extends(LambdaCurve, _super);
    function LambdaCurve(v, _lambda) {
        _super.call(this, v);
        this._lambda = _lambda;
    }
    LambdaCurve.prototype.coord = function (i) { return this._lambda(this._v, i); };
    return LambdaCurve;
})(CurveBase);
/** 直線・一次曲線 */
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(start, end) {
        _super.call(this, [start, end]);
    }
    Line.prototype.coord = function (i) {
        var c0 = this._v[0].scalar(1 - i);
        var c1 = this._v[1].scalar(i);
        return c0.add(c1);
    };
    return Line;
})(CurveBase);
/** 2次ベジェ曲線 */
var BezierCurve2 = (function (_super) {
    __extends(BezierCurve2, _super);
    function BezierCurve2(start, mid, end) {
        _super.call(this, [start, mid, end]);
    }
    BezierCurve2.prototype.coord = function (i) {
        var _this = this;
        return ut.seq.bernstein(3, i)
            .map(function (n, i) { return _this._v[i].scalar(n); })
            .reduce(function (a, b) { return a.add(b); });
    };
    return BezierCurve2;
})(CurveBase);
/** 3次ベジェ曲線 */
var BezierCurve3 = (function (_super) {
    __extends(BezierCurve3, _super);
    function BezierCurve3(start, mid1, mid2, end) {
        _super.call(this, [start, mid1, mid2, end]);
    }
    BezierCurve3.prototype.coord = function (i) {
        var _this = this;
        return ut.seq.bernstein(3, i)
            .map(function (n, i) { return _this._v[i].scalar(n); })
            .reduce(function (a, b) { return a.add(b); });
    };
    return BezierCurve3;
})(CurveBase);
/** 楕円 */
var Ellipse = (function (_super) {
    __extends(Ellipse, _super);
    function Ellipse(o, x, y) {
        _super.call(this, [o, x, y]);
    }
    Ellipse.prototype.coord = function (i) {
        var rad = i * ut.deg360;
        var o = this._v[0];
        var dx = this._v[1].sub(o).scalar(ut.cos(rad));
        var dy = this._v[2].sub(o).scalar(ut.sin(rad));
        return o.add(dx).add(dy);
    };
    return Ellipse;
})(CurveBase);
/** 螺旋 */
var Spiral = (function (_super) {
    __extends(Spiral, _super);
    function Spiral(o, x, y, z) {
        _super.call(this, [o, x, y, z]);
    }
    Spiral.prototype.coord = function (i) {
        var rad = i * ut.deg360;
        var o = this._v[0];
        var dx = this._v[1].sub(o).scalar(ut.cos(rad));
        var dy = this._v[2].sub(o).scalar(ut.sin(rad));
        var dz = this._v[3].sub(o).scalar(i);
        return o.add(dx).add(dy).add(dz);
    };
    return Spiral;
})(CurveBase);
/** (始点, 終点) -> 直線 */
function line(start, end) {
    return new Line(start, end);
}
exports.line = line;
/** ([始点, 終点]) -> 直線 */
function ar_line(v) {
    return new Line(v[0], v[1]);
}
exports.ar_line = ar_line;
/** (3次元ベクトル配列, 媒介変数) -> 3次元ベクトル を満たす任意の関数で定義される曲線 */
function lambda(v, la) {
    return new LambdaCurve(v, la);
}
exports.lambda = lambda;
/** (始点, 制御点, 終点) -> 2次ベジェ曲線 */
function bezier2(start, mid, end) {
    return new BezierCurve2(start, mid, end);
}
exports.bezier2 = bezier2;
/** ([始点, 制御点, 終点]) -> 2次ベジェ曲線 */
function ar_bezier2(v) {
    return new BezierCurve2(v[0], v[1], v[2]);
}
exports.ar_bezier2 = ar_bezier2;
/** (始点, 始点側制御点, 終点側制御点, 終点) -> 3次ベジェ曲線 */
function bezier3(start, mid1, mid2, end) {
    return new BezierCurve3(start, mid1, mid2, end);
}
exports.bezier3 = bezier3;
/** ([始点, 始点側制御点, 終点側制御点, 終点]) -> 3次ベジェ曲線 */
function ar_bezier3(v) {
    return new BezierCurve3(v[0], v[1], v[2], v[3]);
}
exports.ar_bezier3 = ar_bezier3;
/** (中心, x, y) -> 楕円 */
function ellipse(o, x, y) {
    return new Ellipse(o, x, y);
}
exports.ellipse = ellipse;
/** (中心, x, y, z) -> 螺旋 */
function spiral(o, x, y, z) {
    return new Spiral(o, x, y, z);
}
exports.spiral = spiral;
/** 連続曲線 */
function curves(curves) {
    return new CurveArrayImpl(curves);
}
exports.curves = curves;
/** 折れ線 */
function lines(verts) {
    return curves(ut.seq.arith(verts.length - 1, 1).map(function (i) { return line(verts[i - 1], verts[i]); }));
}
exports.lines = lines;
//# sourceMappingURL=curve3.js.map