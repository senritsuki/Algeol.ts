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
var priv;
(function (priv) {
    var CDImpl = (function () {
        function CDImpl(_c, _d) {
            this._c = _c;
            this._d = _d;
        }
        CDImpl.prototype.c = function () {
            return this._c;
        };
        CDImpl.prototype.d = function () {
            return this._d;
        };
        return CDImpl;
    }());
    priv.CDImpl = CDImpl;
    var CurveArrayImpl = (function () {
        function CurveArrayImpl(_curves) {
            this._curves = _curves;
        }
        CurveArrayImpl.prototype.coord = function (i) {
            var j = i <= 0 ?
                0 :
                i >= this._curves.length - 1 ?
                    this._curves.length - 1 :
                    ut.floor(i);
            var k = i - j;
            return this._curves[j].coord(k);
        };
        CurveArrayImpl.prototype.cd = function (i, delta) {
            if (delta === void 0) { delta = exports.E; }
            var c = this.coord(i);
            var d1 = this.coord(i - delta);
            var d2 = this.coord(i + delta);
            return exports.cd(c, d2.sub(d1));
        };
        CurveArrayImpl.prototype.startPoint = function () {
            return this.coord(0);
        };
        CurveArrayImpl.prototype.endPoint = function () {
            return this.coord(1);
        };
        CurveArrayImpl.prototype.controlPoints = function () {
            return this._curves.map(function (c) { return c.controlPoints(); }).reduce(function (a, b) { return a.concat(b); }, []);
        };
        CurveArrayImpl.prototype.curves = function () {
            return this._curves.slice(0);
        };
        CurveArrayImpl.prototype.curveNum = function () {
            return this._curves.length;
        };
        return CurveArrayImpl;
    }());
    priv.CurveArrayImpl = CurveArrayImpl;
    var CurveBase = (function () {
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
        CurveBase.prototype.cd = function (i, delta) {
            if (delta === void 0) { delta = exports.E; }
            var c = this.coord(i);
            var d1 = this.coord(i - delta);
            var d2 = this.coord(i + delta);
            return exports.cd(c, d2.sub(d1));
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
        LambdaCurve.prototype.coord = function (i) {
            return this._lambda(this._v, i);
        };
        return LambdaCurve;
    }(CurveBase));
    priv.LambdaCurve = LambdaCurve;
    /** 直線・一次曲線 */
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line(start, end) {
            return _super.call(this, [start, end]) || this;
        }
        Line.prototype.coord = function (i) {
            var c0 = this._v[0].scalar(1 - i);
            var c1 = this._v[1].scalar(i);
            return c0.add(c1);
        };
        return Line;
    }(CurveBase));
    priv.Line = Line;
    /** ベジェ曲線 */
    var BezierCurve = (function (_super) {
        __extends(BezierCurve, _super);
        function BezierCurve(controlPoints) {
            return _super.call(this, controlPoints) || this;
        }
        BezierCurve.prototype.coord = function (i) {
            var _this = this;
            return seq.bernstein(this.controlPoints().length, i)
                .map(function (n, j) { return _this._v[j].scalar(n); })
                .reduce(function (a, b) { return a.add(b); });
        };
        return BezierCurve;
    }(CurveBase));
    priv.BezierCurve = BezierCurve;
    /** 楕円 */
    var Ellipse = (function (_super) {
        __extends(Ellipse, _super);
        function Ellipse(o, x, y) {
            return _super.call(this, [o, x, y]) || this;
        }
        Ellipse.prototype.coord = function (i) {
            var rad = i * ut.deg360;
            var o = this._v[0];
            var dx = this._v[1].sub(o).scalar(ut.cos(rad));
            var dy = this._v[2].sub(o).scalar(ut.sin(rad));
            return o.add(dx).add(dy);
        };
        return Ellipse;
    }(CurveBase));
    priv.Ellipse = Ellipse;
    /** 螺旋 */
    var Spiral = (function (_super) {
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
    priv.Spiral = Spiral;
})(priv || (priv = {}));
/** 位置ベクトルと方向ベクトルのペア */
exports.cd = function (c, d) { return new priv.CDImpl(c, d); };
/** 2次元の位置ベクトルと方向ベクトルのペア */
exports.cd2 = function (c, d) { return exports.cd(c, d); };
/** 3次元の位置ベクトルと方向ベクトルのペア */
exports.cd3 = function (c, d) { return exports.cd(c, d); };
/** 4次元の位置ベクトルと方向ベクトルのペア */
exports.cd4 = function (c, d) { return exports.cd(c, d); };
/** (始点, 終点) -> 直線 */
exports.line = function (start, end) { return new priv.Line(start, end); };
/** (始点, 終点) -> 直線 */
exports.line2 = function (start, end) { return exports.line(start, end); };
/** (始点, 終点) -> 直線 */
exports.line3 = function (start, end) { return exports.line(start, end); };
/** (始点, 終点) -> 直線 */
exports.line4 = function (start, end) { return exports.line(start, end); };
/** (ベクトル配列, 媒介変数) -> ベクトル を満たす任意の関数で定義される曲線 */
exports.lambda = function (v, la) { return new priv.LambdaCurve(v, la); };
/** (ベクトル配列, 媒介変数) -> ベクトル を満たす任意の関数で定義される曲線 */
exports.lambda2 = function (v, la) { return exports.lambda(v, la); };
/** (ベクトル配列, 媒介変数) -> ベクトル を満たす任意の関数で定義される曲線 */
exports.lambda3 = function (v, la) { return exports.lambda(v, la); };
/** (ベクトル配列, 媒介変数) -> ベクトル を満たす任意の関数で定義される曲線 */
exports.lambda4 = function (v, la) { return exports.lambda(v, la); };
/** (制御点配列) -> ベジェ曲線. 制御点が3つなら2次、4つなら3次のベジェ曲線となる */
exports.bezier = function (controlPoints) { return new priv.BezierCurve(controlPoints); };
/** (制御点配列) -> ベジェ曲線. 制御点が3つなら2次、4つなら3次のベジェ曲線となる */
exports.bezier2 = function (controlPoints) { return exports.bezier(controlPoints); };
/** (制御点配列) -> ベジェ曲線. 制御点が3つなら2次、4つなら3次のベジェ曲線となる */
exports.bezier3 = function (controlPoints) { return exports.bezier(controlPoints); };
/** (制御点配列) -> ベジェ曲線. 制御点が3つなら2次、4つなら3次のベジェ曲線となる */
exports.bezier4 = function (controlPoints) { return exports.bezier(controlPoints); };
/** (中心, x, y) -> 楕円 */
exports.ellipse = function (o, x, y) { return new priv.Ellipse(o, x, y); };
/** (中心, x, y) -> 楕円 */
exports.ellipse2 = function (o, x, y) { return exports.ellipse(o, x, y); };
/** (中心, x, y) -> 楕円 */
exports.ellipse3 = function (o, x, y) { return exports.ellipse(o, x, y); };
/** (中心, x, y) -> 楕円 */
exports.ellipse4 = function (o, x, y) { return exports.ellipse(o, x, y); };
/** (中心, x, y, z) -> 螺旋 */
exports.spiral = function (o, x, y, z) { return new priv.Spiral(o, x, y, z); };
/** (中心, x, y, z) -> 螺旋 */
exports.spiral2 = function (o, x, y, z) { return exports.spiral(o, x, y, z); };
/** (中心, x, y, z) -> 螺旋 */
exports.spiral3 = function (o, x, y, z) { return exports.spiral(o, x, y, z); };
/** (中心, x, y, z) -> 螺旋 */
exports.spiral4 = function (o, x, y, z) { return exports.spiral(o, x, y, z); };
/** 連続曲線 */
exports.curves = function (curveArray) { return new priv.CurveArrayImpl(curveArray); };
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
