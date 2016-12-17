import * as tt from './turtle';
export interface V {
    /** variable alphabet */
    v(): string;
    /** production rules */
    p(): V[];
}
export declare function l_system(start: V[], rec: number): V[];
/** Algae - 藻 */
export declare namespace Algae {
    const A: V;
    const B: V;
    const start: V[];
}
/** Fibonacci Sequence - フィボナッチ数列 */
export declare namespace FibonacciSequence {
    const A: V;
    const B: V;
    const start: V[];
}
/** Cantor Set - カントール集合 */
export declare namespace CantorSet {
    const A: V;
    const B: V;
    const start: V[];
}
/** Koch Curve - コッホ曲線 */
export declare namespace KochCurve {
    const F: V;
    const P: V;
    const N: V;
    const start: V[];
    function turtle2(vl: V[], r?: number): tt.Line2[];
}
/** Koch Island - コッホ島 */
export declare namespace KochIsland {
    const F: V;
    const P: V;
    const N: V;
    const start: V[];
    function turtle2(vl: V[], r?: number): tt.Line2[];
}
/** Sierpinski triangle - シェルピンスキーの三角形 */
export declare namespace SierpinskiTriangle {
    /** F: draw forward
        F → F−G+F+G−F */
    const F: V;
    /** G: draw forward
        G → GG */
    const G: V;
    /** +: turn left
        constants */
    const P: V;
    /** -: turn right
        constants */
    const N: V;
    /** start: F−G−G */
    const start: V[];
    function turtle2(vl: V[], r?: number): tt.Line2[];
}
/** Sierpinski arrowhead curve - シェルピンスキーの三角形 */
export declare namespace SierpinskiArrowheadCurve {
    const A: V;
    const B: V;
    const P: V;
    const N: V;
    const start: V[];
    function turtle2(vl: V[], r?: number): tt.Line2[];
}
/** Pythagoras Tree - ピタゴラスの木 */
export declare namespace PythagorasTree {
    /** 0: draw a line segment ending in a leaf
        0 → 1[0]0 */
    const A: V;
    /** 1: draw a line segment
        1 → 11 */
    const B: V;
    /** [: push position and angle, turn left 45 degrees
        constants */
    const I: V;
    /** ]: pop position and angle, turn right 45 degrees
        constants */
    const O: V;
    const start: V[];
    function turtle2(vl: V[], r?: number): tt.Line2[];
}
/** Dragon Curve - ドラゴン曲線 */
export declare namespace DragonCurve {
}
