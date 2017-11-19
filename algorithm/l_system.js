"use strict";
/** L-system, Lindenmayer system */
Object.defineProperty(exports, "__esModule", { value: true });
var tt = require("./turtle");
function l_system(start, rec) {
    if (rec <= 0) {
        return start;
    }
    var v2 = start
        .map(function (v) { return v.p(); })
        .reduce(function (a, b) { return a.concat(b); }, []);
    return l_system(v2, rec - 1);
}
exports.l_system = l_system;
/** 共通 */
var presets;
(function (presets) {
    /** turn left */
    presets.P = { v: function () { return '+'; }, p: function () { return [presets.P]; }, };
    /** turn right */
    presets.N = { v: function () { return '-'; }, p: function () { return [presets.N]; }, };
    /** push position */
    presets.I = { v: function () { return '['; }, p: function () { return [presets.I]; }, };
    /** pop position */
    presets.O = { v: function () { return ']'; }, p: function () { return [presets.O]; }, };
    function turtle_common(vl, dict) {
        var lines = [];
        var queue = [];
        var turtle = tt.turtle2();
        vl.forEach(function (v) { return turtle = dict[v.v()](turtle, lines, queue); });
        return lines;
    }
    presets.turtle_common = turtle_common;
    function movedraw(r) {
        return function (turtlePrev, lines, _queue) {
            var d = turtlePrev.moveDraw(r);
            lines.push(d.line);
            return d.turtle;
        };
    }
    presets.movedraw = movedraw;
    function turn(degree) {
        return function (turtlePrev, _lines, _queue) { return turtlePrev.turn(degree); };
    }
    presets.turn = turn;
    /** Algae - 藻
        A, A -> AB, B -> A */
    var Algae;
    (function (Algae) {
        Algae.A = { v: function () { return 'A'; }, p: function () { return [Algae.A, Algae.B]; }, };
        Algae.B = { v: function () { return 'B'; }, p: function () { return [Algae.A]; }, };
        Algae.start = [Algae.A];
    })(Algae = presets.Algae || (presets.Algae = {}));
    /** Fibonacci Sequence - フィボナッチ数列
        A, A -> B, B -> AB */
    var FibonacciSequence;
    (function (FibonacciSequence) {
        FibonacciSequence.A = { v: function () { return 'A'; }, p: function () { return [FibonacciSequence.B]; }, };
        FibonacciSequence.B = { v: function () { return 'B'; }, p: function () { return [FibonacciSequence.A, FibonacciSequence.B]; }, };
        FibonacciSequence.start = [FibonacciSequence.A];
    })(FibonacciSequence = presets.FibonacciSequence || (presets.FibonacciSequence = {}));
    /** Cantor Set - カントール集合
        A, A -> ABA, B -> BBB */
    var CantorSet;
    (function (CantorSet) {
        CantorSet.A = { v: function () { return 'A'; }, p: function () { return [CantorSet.A, CantorSet.B, CantorSet.A]; }, };
        CantorSet.B = { v: function () { return 'B'; }, p: function () { return [CantorSet.B, CantorSet.B, CantorSet.B]; }, };
        CantorSet.start = [CantorSet.A];
    })(CantorSet = presets.CantorSet || (presets.CantorSet = {}));
    /** Koch Curve - コッホ曲線 60deg
        F, F -> F+F--F+F */
    var KochCurve60;
    (function (KochCurve60) {
        KochCurve60.F = { v: function () { return 'F'; }, p: function () { return [KochCurve60.F, presets.P, KochCurve60.F, presets.N, presets.N, KochCurve60.F, presets.P, KochCurve60.F]; }, };
        KochCurve60.start = [KochCurve60.F];
        function turtle(vl, r) {
            if (r === void 0) { r = 1; }
            return turtle_common(vl, {
                'F': movedraw(r),
                '+': turn(60),
                '-': turn(-60),
            });
        }
        KochCurve60.turtle = turtle;
    })(KochCurve60 = presets.KochCurve60 || (presets.KochCurve60 = {}));
    /** Koch Curve - コッホ曲線 90deg
        F, F -> F+F-F-F+F */
    var KochCurve90;
    (function (KochCurve90) {
        KochCurve90.F = { v: function () { return 'F'; }, p: function () { return [KochCurve90.F, presets.P, KochCurve90.F, presets.N, KochCurve90.F, presets.N, KochCurve90.F, presets.P, KochCurve90.F]; }, };
        KochCurve90.start = [KochCurve90.F];
        function turtle(vl, r) {
            if (r === void 0) { r = 1; }
            return turtle_common(vl, {
                'F': movedraw(r),
                '+': turn(90),
                '-': turn(-90),
            });
        }
        KochCurve90.turtle = turtle;
    })(KochCurve90 = presets.KochCurve90 || (presets.KochCurve90 = {}));
    /** Koch Island - コッホ島
        F+F+F+F, F -> F-F+F+FFF-F-F+F */
    var KochIsland;
    (function (KochIsland) {
        KochIsland.F = { v: function () { return 'F'; }, p: function () { return [KochIsland.F, presets.N, KochIsland.F, presets.P, KochIsland.F, presets.P, KochIsland.F, KochIsland.F, KochIsland.F, presets.N, KochIsland.F, presets.N, KochIsland.F, presets.P, KochIsland.F]; }, };
        KochIsland.start = [KochIsland.F, presets.P, KochIsland.F, presets.P, KochIsland.F, presets.P, KochIsland.F];
        function turtle(vl, r) {
            if (r === void 0) { r = 1; }
            return turtle_common(vl, {
                'F': movedraw(r),
                '+': turn(90),
                '-': turn(-90),
            });
        }
        KochIsland.turtle = turtle;
    })(KochIsland = presets.KochIsland || (presets.KochIsland = {}));
    /** Peano Curve
        F, F -> F+F-F-F-F+F+F+F-F */
    var PeanoCurve;
    (function (PeanoCurve) {
        PeanoCurve.F = { v: function () { return 'F'; }, p: function () { return [PeanoCurve.F, presets.P, PeanoCurve.F, presets.N, PeanoCurve.F, presets.N, PeanoCurve.F, presets.N, PeanoCurve.F, presets.P, PeanoCurve.F, presets.P, PeanoCurve.F, presets.P, PeanoCurve.F, presets.N, PeanoCurve.F]; }, };
        PeanoCurve.start = [PeanoCurve.F];
        function turtle(vl, r) {
            if (r === void 0) { r = 1; }
            return turtle_common(vl, {
                'F': movedraw(r),
                '+': turn(90),
                '-': turn(-90),
            });
        }
        PeanoCurve.turtle = turtle;
    })(PeanoCurve = presets.PeanoCurve || (presets.PeanoCurve = {}));
    /** Peano-Gosper Curve
        A, A -> A-B--B+A++AA+B-, B -> +A-BB--B-A++A+B */
    var PeanoGosperCurve;
    (function (PeanoGosperCurve) {
        PeanoGosperCurve.A = { v: function () { return 'A'; }, p: function () { return [PeanoGosperCurve.A, presets.N, PeanoGosperCurve.B, presets.N, presets.N, PeanoGosperCurve.B, presets.P, PeanoGosperCurve.A, presets.P, presets.P, PeanoGosperCurve.A, PeanoGosperCurve.A, presets.P, PeanoGosperCurve.B, presets.N]; }, };
        PeanoGosperCurve.B = { v: function () { return 'B'; }, p: function () { return [presets.P, PeanoGosperCurve.A, presets.N, PeanoGosperCurve.B, PeanoGosperCurve.B, presets.N, presets.N, PeanoGosperCurve.B, presets.N, PeanoGosperCurve.A, presets.P, presets.P, PeanoGosperCurve.A, presets.P, PeanoGosperCurve.B]; }, };
        PeanoGosperCurve.start = [PeanoGosperCurve.A];
        function turtle(vl, r) {
            if (r === void 0) { r = 1; }
            return turtle_common(vl, {
                'A': movedraw(r),
                'B': movedraw(r),
                '+': turn(60),
                '-': turn(-60),
            });
        }
        PeanoGosperCurve.turtle = turtle;
    })(PeanoGosperCurve = presets.PeanoGosperCurve || (presets.PeanoGosperCurve = {}));
    /** Sierpinski Arrowhead Curve - シェルピンスキーの三角形
        A, A -> B+A+B, B -> A-B-A */
    var SierpinskiArrowheadCurve;
    (function (SierpinskiArrowheadCurve) {
        SierpinskiArrowheadCurve.A = { v: function () { return 'A'; }, p: function () { return [SierpinskiArrowheadCurve.B, presets.P, SierpinskiArrowheadCurve.A, presets.P, SierpinskiArrowheadCurve.B]; }, };
        SierpinskiArrowheadCurve.B = { v: function () { return 'B'; }, p: function () { return [SierpinskiArrowheadCurve.A, presets.N, SierpinskiArrowheadCurve.B, presets.N, SierpinskiArrowheadCurve.A]; }, };
        SierpinskiArrowheadCurve.start = [SierpinskiArrowheadCurve.A];
        function turtle(vl, r) {
            if (r === void 0) { r = 1; }
            return turtle_common(vl, {
                'A': movedraw(r),
                'B': movedraw(r),
                '+': turn(60),
                '-': turn(-60),
            });
        }
        SierpinskiArrowheadCurve.turtle = turtle;
    })(SierpinskiArrowheadCurve = presets.SierpinskiArrowheadCurve || (presets.SierpinskiArrowheadCurve = {}));
    /** Sierpinski Triangle - シェルピンスキーの三角形
        A+B+B, A -> A+B-A-B+A, B -> BB */
    var SierpinskiTriangle;
    (function (SierpinskiTriangle) {
        SierpinskiTriangle.A = { v: function () { return 'A'; }, p: function () { return [SierpinskiTriangle.A, presets.P, SierpinskiTriangle.B, presets.N, SierpinskiTriangle.A, presets.N, SierpinskiTriangle.B, presets.P, SierpinskiTriangle.A]; }, };
        SierpinskiTriangle.B = { v: function () { return 'B'; }, p: function () { return [SierpinskiTriangle.B, SierpinskiTriangle.B]; }, };
        SierpinskiTriangle.start = [SierpinskiTriangle.A, presets.P, SierpinskiTriangle.B, presets.P, SierpinskiTriangle.B];
        function turtle(vl, r) {
            if (r === void 0) { r = 1; }
            return turtle_common(vl, {
                'A': movedraw(r),
                'B': movedraw(r),
                '+': turn(120),
                '-': turn(-120),
            });
        }
        SierpinskiTriangle.turtle = turtle;
    })(SierpinskiTriangle = presets.SierpinskiTriangle || (presets.SierpinskiTriangle = {}));
    /** Square Curve
        A+B+A+B, A -> A, B -> B-A+A-B+A+B-A+A-B */
    var SquareCurve;
    (function (SquareCurve) {
        SquareCurve.A = { v: function () { return 'A'; }, p: function () { return [SquareCurve.A]; }, };
        SquareCurve.B = { v: function () { return 'B'; }, p: function () { return [SquareCurve.B, presets.N, SquareCurve.A, presets.P, SquareCurve.A, presets.N, SquareCurve.B, presets.P, SquareCurve.A, presets.P, SquareCurve.B, presets.N, SquareCurve.A, presets.P, SquareCurve.A, presets.N, SquareCurve.B]; }, };
        SquareCurve.start = [SquareCurve.A, presets.P, SquareCurve.B, presets.P, SquareCurve.A, presets.P, SquareCurve.B];
        function turtle(vl, r) {
            if (r === void 0) { r = 1; }
            return turtle_common(vl, {
                'A': movedraw(r),
                'B': movedraw(r),
                '+': turn(90),
                '-': turn(-90),
            });
        }
        SquareCurve.turtle = turtle;
    })(SquareCurve = presets.SquareCurve || (presets.SquareCurve = {}));
    /** Dragon Curve - ドラゴン曲線
        A, A -> A+B+, B -> -A-B */
    var DragonCurve;
    (function (DragonCurve) {
        DragonCurve.A = { v: function () { return 'A'; }, p: function () { return [DragonCurve.A, presets.P, DragonCurve.B, presets.P]; }, };
        DragonCurve.B = { v: function () { return 'B'; }, p: function () { return [presets.N, DragonCurve.A, presets.N, DragonCurve.B]; }, };
        DragonCurve.start = [DragonCurve.A];
        function turtle(vl, r) {
            if (r === void 0) { r = 1; }
            return turtle_common(vl, {
                'A': movedraw(r),
                'B': movedraw(r),
                '+': turn(90),
                '-': turn(-90),
            });
        }
        DragonCurve.turtle = turtle;
    })(DragonCurve = presets.DragonCurve || (presets.DragonCurve = {}));
    /** Pythagoras Tree - ピタゴラスの木
        A, A -> B[A]A, B -> BB */
    var PythagorasTree;
    (function (PythagorasTree) {
        PythagorasTree.A = { v: function () { return 'A'; }, p: function () { return [PythagorasTree.B, presets.I, PythagorasTree.A, presets.O, PythagorasTree.A]; }, };
        PythagorasTree.B = { v: function () { return 'B'; }, p: function () { return [PythagorasTree.B, PythagorasTree.B]; }, };
        PythagorasTree.start = [PythagorasTree.A];
        function turtle2(vl, r) {
            if (r === void 0) { r = 1; }
            return turtle_common(vl, {
                'A': movedraw(r),
                'B': movedraw(r),
                '[': function (t, _l, q) { q.push(t); return t.turn(45); },
                ']': function (t, _l, q) { var t2 = q.pop(); return (t2 != undefined ? t2 : t).turn(-45); },
            });
        }
        PythagorasTree.turtle2 = turtle2;
    })(PythagorasTree = presets.PythagorasTree || (presets.PythagorasTree = {}));
})(presets = exports.presets || (exports.presets = {}));
/*
LShowColor@LSystem["L", (* Hilbert curve *)
    {"L" -> "+RF-LFL-FR+", "R" -> "-LF+RFR+FL-"}, 6];

LShowColor@LSystem["X", (* Hilbert curve II *)
    {"X" -> "XFYFX+F+YFXFY-F-XFYFX",
     "Y" -> "YFXFY-F-XFYFX+F+YFXFY"}, 3];
 */ 
