/** Curve with Parametric Equation - パラメトリック方程式による曲線 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ut = require("../math/util");
exports.E = 0.001;
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
var CurveBase = (function () {
    function CurveBase(_v) {
        this._v = _v;
    }
    CurveBase.prototype.start = function () { return this.coord(0); };
    CurveBase.prototype.end = function () { return this.coord(1); };
    CurveBase.prototype.cd = function (i, delta) {
        if (delta === void 0) { delta = exports.E; }
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
/** 制御点が2つの曲線 */
var Curve2 = (function (_super) {
    __extends(Curve2, _super);
    function Curve2(start, end) {
        _super.call(this, [start, end]);
    }
    return Curve2;
})(CurveBase);
/** 直線・一次曲線 */
var Line = (function (_super) {
    __extends(Line, _super);
    function Line() {
        _super.apply(this, arguments);
    }
    Line.prototype.coord = function (i) {
        var c0 = this.start().scalar(1 - i);
        var c1 = this.end().scalar(i);
        return c0.add(c1);
    };
    return Line;
})(Curve2);
/** 制御点が3つの曲線 */
var Curve3 = (function (_super) {
    __extends(Curve3, _super);
    function Curve3(start, mid, end) {
        _super.call(this, [start, mid, end]);
    }
    return Curve3;
})(CurveBase);
/** 2次ベジェ曲線 */
var BezierCurve2 = (function (_super) {
    __extends(BezierCurve2, _super);
    function BezierCurve2() {
        _super.apply(this, arguments);
    }
    BezierCurve2.prototype.coord = function (i) {
        var _this = this;
        return ut.seq.bernstein(3, i)
            .map(function (n, i) { return _this._v[i].scalar(n); })
            .reduce(function (a, b) { return a.add(b); });
    };
    return BezierCurve2;
})(Curve3);
/** 制御点が4つの曲線 */
var Curve4 = (function (_super) {
    __extends(Curve4, _super);
    function Curve4(start, mid1, mid2, end) {
        _super.call(this, [start, mid1, mid2, end]);
    }
    return Curve4;
})(CurveBase);
/** 3次ベジェ曲線 */
var BezierCurve3 = (function (_super) {
    __extends(BezierCurve3, _super);
    function BezierCurve3() {
        _super.apply(this, arguments);
    }
    BezierCurve3.prototype.coord = function (i) {
        var _this = this;
        return ut.seq.bernstein(3, i)
            .map(function (n, i) { return _this._v[i].scalar(n); })
            .reduce(function (a, b) { return a.add(b); });
    };
    return BezierCurve3;
})(Curve4);
/** (3次元ベクトル配列, 媒介変数) -> 3次元ベクトル を満たす任意の関数で定義される曲線 */
function lambda(v, la) {
    return new LambdaCurve(v, la);
}
exports.lambda = lambda;
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
//# sourceMappingURL=curve.js.map