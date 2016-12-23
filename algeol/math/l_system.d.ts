/** L-system, Lindenmayer system */
import * as cv from './curve2';
import * as tt from './turtle';
export interface V {
    /** variable alphabet */
    v(): string;
    /** production rules */
    p(): V[];
}
export declare function l_system(start: V[], rec: number): V[];
/** 共通 */
export declare namespace presets {
    /** turn left */
    const P: V;
    /** turn right */
    const N: V;
    /** push position */
    const I: V;
    /** pop position */
    const O: V;
    type Dict = {
        [v: string]: (turtlePrev: tt.Turtle2, lines: cv.Curve[], queue: tt.Turtle2[]) => tt.Turtle2;
    };
    function turtle_common(vl: V[], dict: Dict): cv.Curve[];
    function movedraw(r: number): (turtlePrev: tt.Turtle2, lines: cv.Curve[], queue: tt.Turtle2[]) => tt.Turtle2;
    function turn(degree: number): (turtlePrev: tt.Turtle2, lines: cv.Curve[], queue: tt.Turtle2[]) => tt.Turtle2;
    /** Algae - 藻
        A, A -> AB, B -> A */
    namespace Algae {
        const A: V;
        const B: V;
        const start: V[];
    }
    /** Fibonacci Sequence - フィボナッチ数列
        A, A -> B, B -> AB */
    namespace FibonacciSequence {
        const A: V;
        const B: V;
        const start: V[];
    }
    /** Cantor Set - カントール集合
        A, A -> ABA, B -> BBB */
    namespace CantorSet {
        const A: V;
        const B: V;
        const start: V[];
    }
    /** Koch Curve - コッホ曲線 60deg
        F, F -> F+F--F+F */
    namespace KochCurve60 {
        const F: V;
        const start: V[];
        function turtle(vl: V[], r?: number): cv.Curve[];
    }
    /** Koch Curve - コッホ曲線 90deg
        F, F -> F+F-F-F+F */
    namespace KochCurve90 {
        const F: V;
        const start: V[];
        function turtle(vl: V[], r?: number): cv.Curve[];
    }
    /** Koch Island - コッホ島
        F+F+F+F, F -> F-F+F+FFF-F-F+F */
    namespace KochIsland {
        const F: V;
        const start: V[];
        function turtle(vl: V[], r?: number): cv.Curve[];
    }
    /** Peano Curve
        F, F -> F+F-F-F-F+F+F+F-F */
    namespace PeanoCurve {
        const F: V;
        const start: V[];
        function turtle(vl: V[], r?: number): cv.Curve[];
    }
    /** Peano-Gosper Curve
        A, A -> A-B--B+A++AA+B-, B -> +A-BB--B-A++A+B */
    namespace PeanoGosperCurve {
        const A: V;
        const B: V;
        const start: V[];
        function turtle(vl: V[], r?: number): cv.Curve[];
    }
    /** Sierpinski Arrowhead Curve - シェルピンスキーの三角形
        A, A -> B+A+B, B -> A-B-A */
    namespace SierpinskiArrowheadCurve {
        const A: V;
        const B: V;
        const start: V[];
        function turtle(vl: V[], r?: number): cv.Curve[];
    }
    /** Sierpinski Triangle - シェルピンスキーの三角形
        A+B+B, A -> A+B-A-B+A, B -> BB */
    namespace SierpinskiTriangle {
        const A: V;
        const B: V;
        const start: V[];
        function turtle(vl: V[], r?: number): cv.Curve[];
    }
    /** Square Curve
        A+B+A+B, A -> A, B -> B-A+A-B+A+B-A+A-B */
    namespace SquareCurve {
        const A: V;
        const B: V;
        const start: V[];
        function turtle(vl: V[], r?: number): cv.Curve[];
    }
    /** Dragon Curve - ドラゴン曲線
        A, A -> A+B+, B -> -A-B */
    namespace DragonCurve {
        const A: V;
        const B: V;
        const start: V[];
        function turtle(vl: V[], r?: number): cv.Curve[];
    }
    /** Hilbert Curve - ヒルベルト曲線 */
    namespace HilbertCurve {
    }
    /** Pythagoras Tree - ピタゴラスの木
        A, A -> B[A]A, B -> BB */
    namespace PythagorasTree {
        const A: V;
        const B: V;
        const start: V[];
        function turtle2(vl: V[], r?: number): cv.Curve[];
    }
}
