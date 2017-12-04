"use strict";
/** Curve with Parametric Equation - パラメトリック方程式による曲線 */
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
var seq = require("./sequence");
exports.E = 0.001;
/** 位置ベクトルと方向ベクトルのペア */
var CD = /** @class */ (function () {
    function CD(_c, _d) {
        this._c = _c;
        this._d = _d;
    }
    /** Coordinate Vector - 位置ベクトル */
    CD.prototype.c = function () {
        return this._c;
    };
    /** Direction Vector - 方向ベクトル */
    CD.prototype.d = function () {
        return this._d;
    };
    return CD;
}());
exports.CD = CD;
var CurveBase = /** @class */ (function () {
    function CurveBase(_v) {
        this._v = _v;
    }
    CurveBase.prototype.startPoint = function () {
        return this.coord(0);
    };
    CurveBase.prototype.endPoint = function () {
        return this.coord(1);
    };
    CurveBase.prototype.controlPoints = function () {
        return this._v.slice(0);
    };
    CurveBase.prototype.cd = function (t, delta) {
        if (delta === void 0) { delta = exports.E; }
        var c = this.coord(t);
        var d1 = this.coord(t - delta);
        var d2 = this.coord(t + delta);
        return exports.cd(c, d2.sub(d1));
    };
    return CurveBase;
}());
/** (2次元ベクトル配列, 媒介変数) -> 2次元ベクトル を満たす任意の関数で定義される曲線 */
var LambdaCurve = /** @class */ (function (_super) {
    __extends(LambdaCurve, _super);
    function LambdaCurve(v, _lambda) {
        var _this = _super.call(this, v) || this;
        _this._lambda = _lambda;
        return _this;
    }
    LambdaCurve.prototype.coord = function (t) {
        return this._lambda(this._v, t);
    };
    return LambdaCurve;
}(CurveBase));
exports.LambdaCurve = LambdaCurve;
/** 直線（一次曲線） */
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(start, end) {
        return _super.call(this, [start, end]) || this;
    }
    Line.prototype.coord = function (t) {
        var c0 = this._v[0].scalar(1 - t);
        var c1 = this._v[1].scalar(t);
        return c0.add(c1);
    };
    return Line;
}(CurveBase));
exports.Line = Line;
/** Bezier Curve - ベジェ曲線 */
var BezierCurve = /** @class */ (function (_super) {
    __extends(BezierCurve, _super);
    function BezierCurve(controlPoints) {
        return _super.call(this, controlPoints) || this;
    }
    BezierCurve.prototype.coord = function (t) {
        var n = this._v.length - 1; // 制御点4つなら3次
        return this._v
            .map(function (v, i) { return v.scalar(ut.bernstein_basis(n, i, t)); })
            .reduce(function (a, b) { return a.add(b); });
    };
    return BezierCurve;
}(CurveBase));
exports.BezierCurve = BezierCurve;
/** B-Spline Curve - Bスプライン曲線 */
var BSplineCurve = /** @class */ (function (_super) {
    __extends(BSplineCurve, _super);
    function BSplineCurve(controlPoints, degree) {
        var _this = _super.call(this, controlPoints) || this;
        _this.degree = degree;
        return _this;
    }
    BSplineCurve.prototype.coord = function (t) {
        var degree = this.degree;
        var knots = seq.arith(this._v.length + degree + 1);
        return this._v
            .map(function (v, i) { return v.scalar(ut.b_spline_basis(knots, i, degree, t)); })
            .reduce(function (a, b) { return a.add(b); });
    };
    return BSplineCurve;
}(CurveBase));
exports.BSplineCurve = BSplineCurve;
/** NURBS: Non-Uniform Rational B-Spline Curve */
var NURBS = /** @class */ (function (_super) {
    __extends(NURBS, _super);
    function NURBS(controlPoints, degree, knots, weights) {
        var _this = _super.call(this, controlPoints) || this;
        _this.degree = degree;
        _this.knots = knots;
        _this.weights = weights;
        return _this;
    }
    NURBS.prototype.coord = function (t) {
        var controls = this._v;
        var degree = this.degree;
        var knots = this.knots;
        var weights = this.weights;
        var index = seq.arith(controls.length);
        var n1 = index
            .map(function (i) { return weights[i] * ut.b_spline_basis(knots, i, degree, t); })
            .map(function (n, i) { return controls[i].scalar(n); })
            .reduce(function (a, b) { return a.add(b); });
        var n2 = index
            .map(function (i) { return weights[i] * ut.b_spline_basis(knots, i, degree, t); })
            .reduce(function (a, b) { return a + b; });
        return n1.scalar(1 / n2);
    };
    return NURBS;
}(CurveBase));
exports.NURBS = NURBS;
/** 楕円 */
var Ellipse = /** @class */ (function (_super) {
    __extends(Ellipse, _super);
    function Ellipse(o, x, y) {
        return _super.call(this, [o, x, y]) || this;
    }
    Ellipse.prototype.coord = function (t) {
        var rad = t * ut.deg360;
        var o = this._v[0];
        var dx = this._v[1].sub(o).scalar(ut.cos(rad));
        var dy = this._v[2].sub(o).scalar(ut.sin(rad));
        return o.add(dx).add(dy);
    };
    return Ellipse;
}(CurveBase));
exports.Ellipse = Ellipse;
/** 螺旋 */
var Spiral = /** @class */ (function (_super) {
    __extends(Spiral, _super);
    function Spiral(o, x, y, z) {
        return _super.call(this, [o, x, y, z]) || this;
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
}(CurveBase));
exports.Spiral = Spiral;
/** 連続曲線 */
var CurveArray = /** @class */ (function () {
    function CurveArray(_curves) {
        this._curves = _curves;
    }
    CurveArray.prototype.coord = function (t) {
        var j = t <= 0 ?
            0 :
            t >= this._curves.length - 1 ?
                this._curves.length - 1 :
                ut.floor(t);
        var k = t - j;
        return this._curves[j].coord(k);
    };
    CurveArray.prototype.cd = function (t, delta) {
        if (delta === void 0) { delta = exports.E; }
        var c = this.coord(t);
        var d1 = this.coord(t - delta);
        var d2 = this.coord(t + delta);
        return exports.cd(c, d2.sub(d1));
    };
    CurveArray.prototype.startPoint = function () {
        return this.coord(0);
    };
    CurveArray.prototype.endPoint = function () {
        return this.coord(1);
    };
    CurveArray.prototype.controlPoints = function () {
        return this._curves.map(function (c) { return c.controlPoints(); }).reduce(function (a, b) { return a.concat(b); }, []);
    };
    /** 曲線の配列 */
    CurveArray.prototype.curves = function () {
        return this._curves.slice(0);
    };
    /** 曲線の数 */
    CurveArray.prototype.curveNum = function () {
        return this._curves.length;
    };
    return CurveArray;
}());
exports.CurveArray = CurveArray;
/** 位置ベクトルと方向ベクトルのペア */
exports.cd = function (c, d) { return new CD(c, d); };
/** 2次元の位置ベクトルと方向ベクトルのペア */
exports.cd2 = function (c, d) { return exports.cd(c, d); };
/** 3次元の位置ベクトルと方向ベクトルのペア */
exports.cd3 = function (c, d) { return exports.cd(c, d); };
/** 4次元の位置ベクトルと方向ベクトルのペア */
exports.cd4 = function (c, d) { return exports.cd(c, d); };
/** (始点, 終点) -> 直線 */
exports.line = function (start, end) { return new Line(start, end); };
/** (始点, 終点) -> 直線 */
exports.line2 = function (start, end) { return exports.line(start, end); };
/** (始点, 終点) -> 直線 */
exports.line3 = function (start, end) { return exports.line(start, end); };
/** (始点, 終点) -> 直線 */
exports.line4 = function (start, end) { return exports.line(start, end); };
/** (ベクトル配列, 媒介変数) -> ベクトル を満たす任意の関数で定義される曲線 */
exports.lambda = function (v, la) { return new LambdaCurve(v, la); };
/** (ベクトル配列, 媒介変数) -> ベクトル を満たす任意の関数で定義される曲線 */
exports.lambda2 = function (v, la) { return exports.lambda(v, la); };
/** (ベクトル配列, 媒介変数) -> ベクトル を満たす任意の関数で定義される曲線 */
exports.lambda3 = function (v, la) { return exports.lambda(v, la); };
/** (ベクトル配列, 媒介変数) -> ベクトル を満たす任意の関数で定義される曲線 */
exports.lambda4 = function (v, la) { return exports.lambda(v, la); };
/** (制御点配列) -> ベジェ曲線. 制御点が3つなら2次、4つなら3次のベジェ曲線となる */
exports.bezier = function (controlPoints) { return new BezierCurve(controlPoints); };
/** (制御点配列) -> ベジェ曲線. 制御点が3つなら2次、4つなら3次のベジェ曲線となる */
exports.bezier2 = function (controlPoints) { return exports.bezier(controlPoints); };
/** (制御点配列) -> ベジェ曲線. 制御点が3つなら2次、4つなら3次のベジェ曲線となる */
exports.bezier3 = function (controlPoints) { return exports.bezier(controlPoints); };
/** (制御点配列) -> ベジェ曲線. 制御点が3つなら2次、4つなら3次のベジェ曲線となる */
exports.bezier4 = function (controlPoints) { return exports.bezier(controlPoints); };
/** (中心, x, y) -> 楕円 */
exports.ellipse = function (o, x, y) { return new Ellipse(o, x, y); };
/** (中心, x, y) -> 楕円 */
exports.ellipse2 = function (o, x, y) { return exports.ellipse(o, x, y); };
/** (中心, x, y) -> 楕円 */
exports.ellipse3 = function (o, x, y) { return exports.ellipse(o, x, y); };
/** (中心, x, y) -> 楕円 */
exports.ellipse4 = function (o, x, y) { return exports.ellipse(o, x, y); };
/** (中心, x, y, z) -> 螺旋 */
exports.spiral = function (o, x, y, z) { return new Spiral(o, x, y, z); };
/** (中心, x, y, z) -> 螺旋 */
exports.spiral2 = function (o, x, y, z) { return exports.spiral(o, x, y, z); };
/** (中心, x, y, z) -> 螺旋 */
exports.spiral3 = function (o, x, y, z) { return exports.spiral(o, x, y, z); };
/** (中心, x, y, z) -> 螺旋 */
exports.spiral4 = function (o, x, y, z) { return exports.spiral(o, x, y, z); };
/** 連続曲線 */
exports.curves = function (curveArray) { return new CurveArray(curveArray); };
/** 連続曲線 */
exports.curves2 = function (curveArray) { return exports.curves(curveArray); };
/** 連続曲線 */
exports.curves3 = function (curveArray) { return exports.curves(curveArray); };
/** 連続曲線 */
exports.curves4 = function (curveArray) { return exports.curves(curveArray); };
/** 折れ線 */
exports.lines = function (verts) { return exports.curves(seq.arith(verts.length - 1, 1).map(function (i) { return exports.line(verts[i - 1], verts[i]); })); };
/** 折れ線 */
exports.lines2 = function (verts) { return exports.lines(verts); };
/** 折れ線 */
exports.lines3 = function (verts) { return exports.lines(verts); };
/** 折れ線 */
exports.lines4 = function (verts) { return exports.lines(verts); };
