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
var vc = require("./vector");
var mx = require("./matrix");
exports.E = 0.001;
/** 位置ベクトルと方向ベクトルのペア */
var Ray = (function () {
    function Ray(
        /** 位置ベクトル */
        c, 
        /** 方向ベクトル */
        d) {
        this.c = c;
        this.d = d;
    }
    /** c + td */
    Ray.prototype.p = function (t) {
        var d = this.d.scalar(t);
        return this.c.add(d);
    };
    Ray.prototype.unit = function () {
        var d = this.d.unit();
        return new Ray(this.c, d);
    };
    Ray.prototype.toString = function () {
        return "{ c: " + this.c.toString03f() + ", d: " + this.d.toString03f() + " }";
    };
    return Ray;
}());
exports.Ray = Ray;
/** 位置ベクトルと方向ベクトルのペア */
function ray(c, d) {
    return new Ray(c, d);
}
exports.ray = ray;
function ray3_to_ray2(ray3) {
    var c = vc.v3_to_v2(ray3.c);
    var d = vc.v3_to_v2(ray3.d);
    return ray(c, d);
}
exports.ray3_to_ray2 = ray3_to_ray2;
function rot_ray3d_z(ray3, rad) {
    var d = mx.rot_z_m3(rad).map(ray3.d);
    return ray(ray3.c, d);
}
exports.rot_ray3d_z = rot_ray3d_z;
function map_ray3(ray3, f) {
    var c = vc.v4map_v3(ray3.c, 1, f);
    var d = vc.v4map_v3(ray3.d, 0, f);
    return ray(c, d);
}
exports.map_ray3 = map_ray3;
var CurveBase = (function () {
    function CurveBase(v) {
        this.v = v;
    }
    CurveBase.prototype.start = function () {
        return this.coord(0);
    };
    CurveBase.prototype.end = function () {
        return this.coord(1);
    };
    CurveBase.prototype.controls = function () {
        return this.v.slice(0);
    };
    CurveBase.prototype.ray = function (t, delta) {
        if (delta === void 0) { delta = exports.E; }
        var c = this.coord(t);
        var d1 = this.coord(t - delta);
        var d2 = this.coord(t + delta);
        return new Ray(c, d2.sub(d1));
    };
    CurveBase.prototype.translate = function (fn) {
        var new_curve = this.clone();
        new_curve.v = this.v.map(function (d) { return fn(d); });
        return new_curve;
    };
    CurveBase.prototype.toString = function () {
        return "[" + this.v.map(function (v) { return v.toString03f(); }).join(', ') + "]";
    };
    return CurveBase;
}());
/** (2次元ベクトル配列, 媒介変数) -> 2次元ベクトル を満たす任意の関数で定義される曲線 */
var LambdaCurve = (function (_super) {
    __extends(LambdaCurve, _super);
    function LambdaCurve(v, _lambda) {
        var _this = _super.call(this, v) || this;
        _this._lambda = _lambda;
        return _this;
    }
    LambdaCurve.prototype.clone = function () {
        return new LambdaCurve(this.v, this._lambda);
    };
    LambdaCurve.prototype.coord = function (t) {
        return this._lambda(this.v, t);
    };
    return LambdaCurve;
}(CurveBase));
/** 直線（一次曲線） */
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(start, end) {
        return _super.call(this, [start, end]) || this;
    }
    Line.prototype.clone = function () {
        return new Line(this.v[0], this.v[1]);
    };
    Line.prototype.coord = function (t) {
        var c0 = this.v[0].scalar(1 - t);
        var c1 = this.v[1].scalar(t);
        return c0.add(c1);
    };
    return Line;
}(CurveBase));
/** Bezier Curve - ベジェ曲線 */
var BezierCurve = (function (_super) {
    __extends(BezierCurve, _super);
    function BezierCurve(controls) {
        return _super.call(this, controls) || this;
    }
    BezierCurve.prototype.clone = function () {
        return new BezierCurve(this.v);
    };
    BezierCurve.prototype.coord = function (t) {
        var n = this.v.length - 1; // 制御点4つなら3次
        return this.v
            .map(function (v, i) { return v.scalar(ut.bernstein_basis(n, i, t)); })
            .reduce(function (a, b) { return a.add(b); });
    };
    return BezierCurve;
}(CurveBase));
/** B-Spline Curve - Bスプライン曲線 */
var BSplineCurve = (function (_super) {
    __extends(BSplineCurve, _super);
    function BSplineCurve(controls, degree) {
        var _this = _super.call(this, controls) || this;
        _this.degree = degree;
        return _this;
    }
    BSplineCurve.prototype.clone = function () {
        return new BSplineCurve(this.v, this.degree);
    };
    BSplineCurve.prototype.coord = function (t) {
        var degree = this.degree;
        var knots = seq.arith(this.v.length + degree + 1);
        return this.v
            .map(function (v, i) { return v.scalar(ut.b_spline_basis(knots, i, degree, t)); })
            .reduce(function (a, b) { return a.add(b); });
    };
    return BSplineCurve;
}(CurveBase));
/** NURBS: Non-Uniform Rational B-Spline Curve */
var NURBS = (function (_super) {
    __extends(NURBS, _super);
    function NURBS(controls, degree, knots, weights) {
        var _this = _super.call(this, controls) || this;
        _this.degree = degree;
        _this.knots = knots;
        _this.weights = weights;
        return _this;
    }
    NURBS.prototype.clone = function () {
        return new NURBS(this.v, this.degree, this.knots, this.weights);
    };
    NURBS.prototype.coord = function (t) {
        var controls = this.v;
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
/**
 * 円・楕円
 * dx=x-o, dy=y-o
 * (0) -> o+dx
 * (1/4) -> o+dy
 * (2/4) -> o-dx
 * (3/4) -> o-dy
 * (1) -> o+dx
 */
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(o, x, y) {
        return _super.call(this, [o, x, y]) || this;
    }
    Circle.prototype.clone = function () {
        return new Circle(this.v[0], this.v[1], this.v[2]);
    };
    Circle.prototype.coord = function (t) {
        var rad = t * ut.deg360;
        var o = this.v[0];
        var dx = this.v[1].sub(o).scalar(Math.cos(rad));
        var dy = this.v[2].sub(o).scalar(Math.sin(rad));
        return o.add(dx).add(dy);
    };
    return Circle;
}(CurveBase));
/**
 * 螺旋
 * dx=x-o, dy=y-o, dz=z-o
 * (0) -> o+dx
 * (1/4) -> o+dy+(1/4)dz
 * (2/4) -> o-dx+(2/4)dz
 * (3/4) -> o-dy+(3/4)dz
 * (1) -> o+dx+dz
 */
var Spiral = (function (_super) {
    __extends(Spiral, _super);
    function Spiral(o, x, y, z) {
        return _super.call(this, [o, x, y, z]) || this;
    }
    Spiral.prototype.clone = function () {
        return new Spiral(this.v[0], this.v[1], this.v[2], this.v[3]);
    };
    Spiral.prototype.coord = function (i) {
        var rad = i * ut.deg360;
        var o = this.v[0];
        var dx = this.v[1].sub(o).scalar(Math.cos(rad));
        var dy = this.v[2].sub(o).scalar(Math.sin(rad));
        var dz = this.v[3].sub(o).scalar(i);
        return o.add(dx).add(dy).add(dz);
    };
    return Spiral;
}(CurveBase));
/**
 * 代数螺旋
 * dx=x-o, dy=y-o, dz=z-o
 * (0) -> o
 * (1/4) -> o+(1/4)dy+(1/4)dz
 * (2/4) -> o-(2/4)dx+(2/4)dz
 * (3/4) -> o-(3/4)dy+(3/4)dz
 * (1) -> o+a*dx+dz
 */
var ArchimedeanSpiral = (function (_super) {
    __extends(ArchimedeanSpiral, _super);
    function ArchimedeanSpiral(o, x, y, z) {
        return _super.call(this, [o, x, y, z]) || this;
    }
    ArchimedeanSpiral.prototype.clone = function () {
        return new Spiral(this.v[0], this.v[1], this.v[2], this.v[3]);
    };
    ArchimedeanSpiral.prototype.coord = function (i) {
        var rad = i * ut.deg360;
        var o = this.v[0];
        var dx = this.v[1].sub(o).scalar(i * Math.cos(rad));
        var dy = this.v[2].sub(o).scalar(i * Math.sin(rad));
        var dz = this.v[3].sub(o).scalar(i);
        return o.add(dx).add(dy).add(dz);
    };
    return ArchimedeanSpiral;
}(CurveBase));
/** 連続曲線 */
var CurveArray = (function () {
    function CurveArray(_curves) {
        this._curves = _curves;
    }
    CurveArray.prototype.coord = function (t) {
        var j = t <= 0 ?
            0 :
            t >= this._curves.length - 1 ?
                this._curves.length - 1 :
                Math.floor(t);
        var k = t - j;
        return this._curves[j].coord(k);
    };
    CurveArray.prototype.cd = function (t, delta) {
        if (delta === void 0) { delta = exports.E; }
        var c = this.coord(t);
        var d1 = this.coord(t - delta);
        var d2 = this.coord(t + delta);
        return new Ray(c, d2.sub(d1));
    };
    CurveArray.prototype.start = function () {
        return this.coord(0);
    };
    CurveArray.prototype.end = function () {
        return this.coord(1);
    };
    CurveArray.prototype.controls = function () {
        return this._curves.map(function (c) { return c.controls(); }).reduce(function (a, b) { return a.concat(b); }, []);
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
/** 直線 */
function line(start, end) {
    return new Line(start, end);
}
exports.line = line;
/** (ベクトル配列, 媒介変数) -> ベクトル を満たす任意の関数で定義される曲線 */
function lambda(v, fn) {
    return new LambdaCurve(v, fn);
}
exports.lambda = lambda;
/** ベジェ曲線. 制御点が3つなら2次、4つなら3次のベジェ曲線となる */
function bezier(controlPoints) {
    return new BezierCurve(controlPoints);
}
exports.bezier = bezier;
/** B-Spline曲線 */
function b_spline(controlPoints, degree) {
    return new BSplineCurve(controlPoints, degree);
}
exports.b_spline = b_spline;
/** NURBS曲線 */
function nurbs(controlPoints, degree, knots, weights) {
    return new NURBS(controlPoints, degree, knots, weights);
}
exports.nurbs = nurbs;
/**
 * 円・楕円
 * dx=x-o, dy=y-o
 * (0) -> o+dx
 * (1/4) -> o+dy
 * (2/4) -> o-dx
 * (3/4) -> o-dy
 * (1) -> o+dx
 */
function circle(o, x, y) {
    return new Circle(o, x, y);
}
exports.circle = circle;
/**
 * 螺旋
 * dx=x-o, dy=y-o, dz=z-o
 * (0) -> o+dx
 * (1/4) -> o+dy+(1/4)dz
 * (2/4) -> o-dx+(2/4)dz
 * (3/4) -> o-dy+(3/4)dz
 * (1) -> o+dx+dz
 */
function spiral(o, x, y, z) {
    return new Spiral(o, x, y, z);
}
exports.spiral = spiral;
/**
 * 代数螺旋
 * dx=x-o, dy=y-o, dz=z-o
 * (0) -> o
 * (1/4) -> o+(1/4)dy+(1/4)dz
 * (2/4) -> o-(2/4)dx+(2/4)dz
 * (3/4) -> o-(3/4)dy+(3/4)dz
 * (1) -> o+a*dx+dz
 */
function archimedean_spiral(o, x, y, z) {
    return new ArchimedeanSpiral(o, x, y, z);
}
exports.archimedean_spiral = archimedean_spiral;
/** 連続曲線 */
function curves(curveArray) {
    return new CurveArray(curveArray);
}
exports.curves = curves;
/** 折れ線 */
function lines(verts) {
    return curves(seq.arith(verts.length - 1, 1).map(function (i) { return line(verts[i - 1], verts[i]); }));
}
exports.lines = lines;
/** ベジェ曲線で円弧を再現する際の制御点係数. 90度の場合: 0.5522847 */
exports.bezier_arc_p = function (rad) { return 4 / 3 * Math.tan(rad / 4); };
/** 三次ベジェのS字カーブ */
function bezier3_interpolate_s(p0, p1, d) {
    var c0 = p0.scalar(2).add(p1).scalar(1 / 3).sub(d);
    var c1 = p1.scalar(2).add(p0).scalar(1 / 3).add(d);
    var controls = [p0, c0, c1, p1];
    return bezier(controls);
}
exports.bezier3_interpolate_s = bezier3_interpolate_s;
/** 三次ベジェの楕円弧カーブ */
function bezier3_interpolate_arc(p0, p1, o) {
    var d0 = p0.sub(o);
    var d1 = p1.sub(o);
    d0._v[2] = 0;
    d1._v[2] = 0;
    var rad = d0.angle(d1);
    var n = exports.bezier_arc_p(rad) * d0.length();
    var e0 = mx.rot_z_m3(ut.deg90).map(d0).unit().scalar(n);
    var e1 = mx.rot_z_m3(-ut.deg90).map(d1).unit().scalar(n);
    var c0 = p0.add(e0);
    var c1 = p1.add(e1);
    var controls = [p0, c0, c1, p1];
    return bezier(controls);
}
exports.bezier3_interpolate_arc = bezier3_interpolate_arc;
