/** L-system, Lindenmayer system */
var tt = require('./turtle');
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
/** Algae - 藻 */
var Algae;
(function (Algae) {
    Algae.A = {
        v: function () { return 'A'; },
        p: function () { return [Algae.A, Algae.B]; },
    };
    Algae.B = {
        v: function () { return 'B'; },
        p: function () { return [Algae.A]; },
    };
    Algae.start = [Algae.A];
})(Algae = exports.Algae || (exports.Algae = {}));
/** Fibonacci Sequence - フィボナッチ数列 */
var FibonacciSequence;
(function (FibonacciSequence) {
    FibonacciSequence.A = {
        v: function () { return 'A'; },
        p: function () { return [FibonacciSequence.B]; },
    };
    FibonacciSequence.B = {
        v: function () { return 'B'; },
        p: function () { return [FibonacciSequence.A, FibonacciSequence.B]; },
    };
    FibonacciSequence.start = [FibonacciSequence.A];
})(FibonacciSequence = exports.FibonacciSequence || (exports.FibonacciSequence = {}));
/** Cantor Set - カントール集合 */
var CantorSet;
(function (CantorSet) {
    CantorSet.A = {
        v: function () { return 'A'; },
        p: function () { return [CantorSet.A, CantorSet.B, CantorSet.A]; },
    };
    CantorSet.B = {
        v: function () { return 'B'; },
        p: function () { return [CantorSet.B, CantorSet.B, CantorSet.B]; },
    };
    CantorSet.start = [CantorSet.A];
})(CantorSet = exports.CantorSet || (exports.CantorSet = {}));
/** Koch Curve - コッホ曲線 */
var KochCurve;
(function (KochCurve) {
    KochCurve.F = {
        v: function () { return 'F'; },
        p: function () { return [KochCurve.F, KochCurve.P, KochCurve.F, KochCurve.N, KochCurve.F, KochCurve.N, KochCurve.F, KochCurve.P, KochCurve.F]; },
    };
    KochCurve.P = {
        v: function () { return '+'; },
        p: function () { return [KochCurve.P]; },
    };
    KochCurve.N = {
        v: function () { return '-'; },
        p: function () { return [KochCurve.N]; },
    };
    KochCurve.start = [KochCurve.F];
    function turtle2(vl, r) {
        if (r === void 0) { r = 1; }
        var lines = [];
        var movedraw = function (t) { var d = t.moveDraw(r); lines.push(d.line); return d.turtle; };
        var dict = {
            'F': movedraw,
            '+': function (t) { return t.turn(90); },
            '-': function (t) { return t.turn(-90); },
        };
        var turtle = tt.turtle2();
        vl.forEach(function (v) { return turtle = dict[v.v()](turtle); });
        return lines;
    }
    KochCurve.turtle2 = turtle2;
})(KochCurve = exports.KochCurve || (exports.KochCurve = {}));
/** Koch Island - コッホ島 */
var KochIsland;
(function (KochIsland) {
    KochIsland.F = {
        v: function () { return 'F'; },
        p: function () { return [KochIsland.F, KochIsland.P, KochIsland.F, KochIsland.N, KochIsland.F, KochIsland.N, KochIsland.F, KochIsland.P, KochIsland.F]; },
    };
    KochIsland.P = {
        v: function () { return '+'; },
        p: function () { return [KochIsland.P]; },
    };
    KochIsland.N = {
        v: function () { return '-'; },
        p: function () { return [KochIsland.N]; },
    };
    KochIsland.start = [KochIsland.F];
    function turtle2(vl, r) {
        if (r === void 0) { r = 1; }
        var lines = [];
        var movedraw = function (t) { var d = t.moveDraw(r); lines.push(d.line); return d.turtle; };
        var dict = {
            'F': movedraw,
            '+': function (t) { return t.turn(90); },
            '-': function (t) { return t.turn(-90); },
        };
        var turtle = tt.turtle2();
        vl.forEach(function (v) { return turtle = dict[v.v()](turtle); });
        return lines;
    }
    KochIsland.turtle2 = turtle2;
})(KochIsland = exports.KochIsland || (exports.KochIsland = {}));
/** Sierpinski triangle - シェルピンスキーの三角形 */
var SierpinskiTriangle;
(function (SierpinskiTriangle) {
    /** F: draw forward
        F → F−G+F+G−F */
    SierpinskiTriangle.F = {
        v: function () { return 'F'; },
        p: function () { return [SierpinskiTriangle.F, SierpinskiTriangle.N, SierpinskiTriangle.G, SierpinskiTriangle.P, SierpinskiTriangle.F, SierpinskiTriangle.P, SierpinskiTriangle.G, SierpinskiTriangle.N, SierpinskiTriangle.F]; },
    };
    /** G: draw forward
        G → GG */
    SierpinskiTriangle.G = {
        v: function () { return 'G'; },
        p: function () { return [SierpinskiTriangle.G, SierpinskiTriangle.G]; },
    };
    /** +: turn left
        constants */
    SierpinskiTriangle.P = {
        v: function () { return '+'; },
        p: function () { return [SierpinskiTriangle.P]; },
    };
    /** -: turn right
        constants */
    SierpinskiTriangle.N = {
        v: function () { return '-'; },
        p: function () { return [SierpinskiTriangle.N]; },
    };
    /** start: F−G−G */
    SierpinskiTriangle.start = [SierpinskiTriangle.F, SierpinskiTriangle.N, SierpinskiTriangle.G, SierpinskiTriangle.N, SierpinskiTriangle.G];
    function turtle2(vl, r) {
        if (r === void 0) { r = 1; }
        var lines = [];
        var movedraw = function (t) { var d = t.moveDraw(r); lines.push(d.line); return d.turtle; };
        var dict = {
            'F': movedraw,
            'G': movedraw,
            '+': function (t) { return t.turn(120); },
            '-': function (t) { return t.turn(-120); },
        };
        var turtle = tt.turtle2();
        vl.forEach(function (v) { return turtle = dict[v.v()](turtle); });
        return lines;
    }
    SierpinskiTriangle.turtle2 = turtle2;
})(SierpinskiTriangle = exports.SierpinskiTriangle || (exports.SierpinskiTriangle = {}));
/** Sierpinski arrowhead curve - シェルピンスキーの三角形 */
var SierpinskiArrowheadCurve;
(function (SierpinskiArrowheadCurve) {
    SierpinskiArrowheadCurve.A = {
        v: function () { return 'A'; },
        p: function () { return [SierpinskiArrowheadCurve.B, SierpinskiArrowheadCurve.N, SierpinskiArrowheadCurve.A, SierpinskiArrowheadCurve.N, SierpinskiArrowheadCurve.B]; },
    };
    SierpinskiArrowheadCurve.B = {
        v: function () { return 'B'; },
        p: function () { return [SierpinskiArrowheadCurve.A, SierpinskiArrowheadCurve.P, SierpinskiArrowheadCurve.B, SierpinskiArrowheadCurve.P, SierpinskiArrowheadCurve.A]; },
    };
    SierpinskiArrowheadCurve.P = {
        v: function () { return '+'; },
        p: function () { return [SierpinskiArrowheadCurve.P]; },
    };
    SierpinskiArrowheadCurve.N = {
        v: function () { return '-'; },
        p: function () { return [SierpinskiArrowheadCurve.N]; },
    };
    SierpinskiArrowheadCurve.start = [SierpinskiArrowheadCurve.A];
    function turtle2(vl, r) {
        if (r === void 0) { r = 1; }
        var lines = [];
        var movedraw = function (t) { var d = t.moveDraw(r); lines.push(d.line); return d.turtle; };
        var dict = {
            'A': movedraw,
            'B': movedraw,
            '+': function (t) { return t.turn(60); },
            '-': function (t) { return t.turn(-60); },
        };
        var turtle = tt.turtle2();
        vl.forEach(function (v) { return turtle = dict[v.v()](turtle); });
        return lines;
    }
    SierpinskiArrowheadCurve.turtle2 = turtle2;
})(SierpinskiArrowheadCurve = exports.SierpinskiArrowheadCurve || (exports.SierpinskiArrowheadCurve = {}));
/** Pythagoras Tree - ピタゴラスの木 */
var PythagorasTree;
(function (PythagorasTree) {
    /** 0: draw a line segment ending in a leaf
        0 → 1[0]0 */
    PythagorasTree.A = {
        v: function () { return '0'; },
        p: function () { return [PythagorasTree.B, PythagorasTree.I, PythagorasTree.A, PythagorasTree.O, PythagorasTree.A]; },
    };
    /** 1: draw a line segment
        1 → 11 */
    PythagorasTree.B = {
        v: function () { return '1'; },
        p: function () { return [PythagorasTree.B, PythagorasTree.B]; },
    };
    /** [: push position and angle, turn left 45 degrees
        constants */
    PythagorasTree.I = {
        v: function () { return '['; },
        p: function () { return [PythagorasTree.I]; },
    };
    /** ]: pop position and angle, turn right 45 degrees
        constants */
    PythagorasTree.O = {
        v: function () { return ']'; },
        p: function () { return [PythagorasTree.O]; },
    };
    PythagorasTree.start = [PythagorasTree.A];
    function turtle2(vl, r) {
        if (r === void 0) { r = 1; }
        var queue = [];
        var lines = [];
        var movedraw = function (t) { var d = t.moveDraw(r); lines.push(d.line); return d.turtle; };
        var dict = {
            '0': movedraw,
            '1': movedraw,
            '[': function (t) { queue.push(t); return t.turn(45); },
            ']': function (t) { var t2 = queue.pop(); return (t2 != undefined ? t2 : t).turn(-45); },
        };
        var turtle = tt.turtle2();
        vl.forEach(function (v) { return turtle = dict[v.v()](turtle); });
        return lines;
    }
    PythagorasTree.turtle2 = turtle2;
})(PythagorasTree = exports.PythagorasTree || (exports.PythagorasTree = {}));
//# sourceMappingURL=l_system.js.map