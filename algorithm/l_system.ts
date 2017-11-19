/** L-system, Lindenmayer system */

import * as vc from './vector';
import * as cv from './curve';
import * as tt from './turtle';


export interface Rule {
    /** variable alphabet */
    variable(): string;
    /** production rules */
    rules(): Rule[];
}

export function l_system(start: Rule[], rec: number): Rule[] {
    if (rec <= 0) {
        return start;
    }
    const v2 = start
        .map(v => v.rules())
        .reduce((a, b) => a.concat(b), <Rule[]>[]);
    return l_system(v2, rec - 1);
}

/** 共通 */
export namespace presets {
    /** turn left */
    export const P: Rule = { variable: () => '+', rules: () => [P], }
    /** turn right */
    export const N: Rule = { variable: () => '-', rules: () => [N], }
    /** push position */
    export const I: Rule = { variable: () => '[', rules: () => [I], }
    /** pop position */
    export const O: Rule = { variable: () => ']', rules: () => [O], }

    export type Dict = { [v: string]: (turtlePrev: tt.TurtleD, lines: cv.Curve2[], queue: tt.TurtleD[]) => tt.TurtleD };

    export function turtle_common(vl: Rule[], dict: Dict): cv.Curve2[] {
        const lines: cv.Curve2[] = [];
        const queue: tt.TurtleD[] = [];
        let turtle = tt.turtle_with_deg(vc.v2_zero, 0);
        vl.forEach(v => turtle = dict[v.variable()](turtle, lines, queue));
        return lines;
    }
    export function movedraw(r: number) {
        return (turtlePrev: tt.TurtleD, lines: cv.Curve2[], _queue: tt.TurtleD[]) => {
             const d = turtlePrev.move(r);
             lines.push(d.line);
             return d.turtle;
        };
    }
    export function turn(degree: number) {
        return (turtlePrev: tt.TurtleD, _lines: cv.Curve2[], _queue: tt.TurtleD[]) => turtlePrev.addDegree(degree);
    }

    /** Algae - 藻
        A, A -> AB, B -> A */
    export namespace Algae {
        export const A: Rule = { variable: () => 'A', rules: () => [A, B], };
        export const B: Rule = { variable: () => 'B', rules: () => [A], };
        export const start = [A];
    }
    /** Fibonacci Sequence - フィボナッチ数列
        A, A -> B, B -> AB */
    export namespace FibonacciSequence {
        export const A: Rule = { variable: () => 'A', rules: () => [B], };
        export const B: Rule = { variable: () => 'B', rules: () => [A, B], };
        export const start = [A];
    }
    /** Cantor Set - カントール集合
        A, A -> ABA, B -> BBB */
    export namespace CantorSet {
        export const A: Rule = { variable: () => 'A', rules: () => [A, B, A], };
        export const B: Rule = { variable: () => 'B', rules: () => [B, B, B], };
        export const start = [A];
    }
    /** Koch Curve - コッホ曲線 60deg
        F, F -> F+F--F+F */
    export namespace KochCurve60 {
        export const F: Rule = { variable: () => 'F', rules: () => [F, P, F, N, N, F, P, F], };
        export const start = [F];

        export function turtle(vl: Rule[], r: number = 1): cv.Curve2[] {
            return turtle_common(vl, {
                'F': movedraw(r),
                '+': turn(60),
                '-': turn(-60),
            });
        }
    }
    /** Koch Curve - コッホ曲線 90deg
        F, F -> F+F-F-F+F */
    export namespace KochCurve90 {
        export const F: Rule = { variable: () => 'F', rules: () => [F, P, F, N, F, N, F, P, F], };
        export const start = [F];

        export function turtle(vl: Rule[], r: number = 1): cv.Curve2[] {
            return turtle_common(vl, {
                'F': movedraw(r),
                '+': turn(90),
                '-': turn(-90),
            });
        }
    }
    /** Koch Island - コッホ島
        F+F+F+F, F -> F-F+F+FFF-F-F+F */
    export namespace KochIsland {
        export const F: Rule = { variable: () => 'F', rules: () => [F, N, F, P, F, P, F, F, F, N, F, N, F, P, F], };
        export const start = [F, P, F, P, F, P, F];

        export function turtle(vl: Rule[], r: number = 1): cv.Curve2[] {
            return turtle_common(vl, {
                'F': movedraw(r),
                '+': turn(90),
                '-': turn(-90),
            });
        }
    }
    /** Peano Curve
        F, F -> F+F-F-F-F+F+F+F-F */
    export namespace PeanoCurve {
        export const F: Rule = { variable: () => 'F', rules: () => [F, P, F, N, F, N, F, N, F, P, F, P, F, P, F, N, F], };
        export const start = [F];

        export function turtle(vl: Rule[], r: number = 1): cv.Curve2[] {
            return turtle_common(vl, {
                'F': movedraw(r),
                '+': turn(90),
                '-': turn(-90),
            });
        }
    }
    /** Peano-Gosper Curve
        A, A -> A-B--B+A++AA+B-, B -> +A-BB--B-A++A+B */
    export namespace PeanoGosperCurve {
        export const A: Rule = { variable: () => 'A', rules: () => [A, N, B, N, N, B, P, A, P, P, A, A, P, B, N], };
        export const B: Rule = { variable: () => 'B', rules: () => [P, A, N, B, B, N, N, B, N, A, P, P, A, P, B], };
        export const start = [A];

        export function turtle(vl: Rule[], r: number = 1): cv.Curve2[] {
            return turtle_common(vl, {
                'A': movedraw(r),
                'B': movedraw(r),
                '+': turn(60),
                '-': turn(-60),
            });
        }
    }
    /** Sierpinski Arrowhead Curve - シェルピンスキーの三角形
        A, A -> B+A+B, B -> A-B-A */
    export namespace SierpinskiArrowheadCurve {
        export const A: Rule = { variable: () => 'A', rules: () => [B, P, A, P, B], };
        export const B: Rule = { variable: () => 'B', rules: () => [A, N, B, N, A], };
        export const start = [A];

        export function turtle(vl: Rule[], r: number = 1): cv.Curve2[] {
            return turtle_common(vl, {
                'A': movedraw(r),
                'B': movedraw(r),
                '+': turn(60),
                '-': turn(-60),
            });
        }
    }
    /** Sierpinski Triangle - シェルピンスキーの三角形
        A+B+B, A -> A+B-A-B+A, B -> BB */
    export namespace SierpinskiTriangle {
        export const A: Rule = { variable: () => 'A', rules: () => [A, P, B, N, A, N, B, P, A], };
        export const B: Rule = { variable: () => 'B', rules: () => [B, B], };
        export const start = [A, P, B, P, B];

        export function turtle(vl: Rule[], r: number = 1): cv.Curve2[] {
            return turtle_common(vl, {
                'A': movedraw(r),
                'B': movedraw(r),
                '+': turn(120),
                '-': turn(-120),
            });
        }
    }
    /** Square Curve
        A+B+A+B, A -> A, B -> B-A+A-B+A+B-A+A-B */
    export namespace SquareCurve {
        export const A: Rule = { variable: () => 'A', rules: () => [A], };
        export const B: Rule = { variable: () => 'B', rules: () => [B, N, A, P, A, N, B, P, A, P, B, N, A, P, A, N, B], };
        export const start = [A, P, B, P, A, P, B];

        export function turtle(vl: Rule[], r: number = 1): cv.Curve2[] {
            return turtle_common(vl, {
                'A': movedraw(r),
                'B': movedraw(r),
                '+': turn(90),
                '-': turn(-90),
            });
        }
    }
    /** Dragon Curve - ドラゴン曲線
        A, A -> A+B+, B -> -A-B */
    export namespace DragonCurve {
        export const A: Rule = { variable: () => 'A', rules: () => [A, P, B, P], };
        export const B: Rule = { variable: () => 'B', rules: () => [N, A, N, B], };
        export const start = [A];

        export function turtle(vl: Rule[], r: number = 1): cv.Curve2[] {
            return turtle_common(vl, {
                'A': movedraw(r),
                'B': movedraw(r),
                '+': turn(90),
                '-': turn(-90),
            });
        }
    }
    /** Hilbert Curve - ヒルベルト曲線 */
    export namespace HilbertCurve {
    }
    /** Pythagoras Tree - ピタゴラスの木
        A, A -> B[A]A, B -> BB */
    export namespace PythagorasTree {
        export const A: Rule = { variable: () => 'A', rules: () => [B, I, A, O, A], };
        export const B: Rule = { variable: () => 'B', rules: () => [B, B], };
        export const start = [A];

        export function turtle2(vl: Rule[], r: number = 1): cv.Curve2[] {
            return turtle_common(vl, {
                'A': movedraw(r),
                'B': movedraw(r),
                '[': (t, _l, q) => { q.push(t); return t.addDegree(45); },
                ']': (t, _l, q) => { const t2 = q.pop(); return (t2 != undefined ? t2 : t).addDegree(-45); },
            });
        }
    }
    /** Fractal Plant */
    export namespace FractalPlant {
        export const X: Rule = { variable: () => 'X', rules: () => [F, I, N, X, O, I, X, O, F, I, N, X, O, P, F, X], };
        export const F: Rule = { variable: () => 'F', rules: () => [F, F], };

        export function turtle2(vl: Rule[], r: number = 1): cv.Curve2[] {
            return turtle_common(vl, {
                'X': movedraw(r),
                'F': movedraw(r),
                '[': (t, _, q) => { q.push(t); return t; },
                ']': (t, _, q) => { const t2 = q.pop(); return (t2 != undefined ? t2 : t); },
                '+': turn(25),
                '-': turn(-25),
            });
        }
    }
}
/*
LShowColor@LSystem["L", (* Hilbert curve *)
    {"L" -> "+RF-LFL-FR+", "R" -> "-LF+RFR+FL-"}, 6];

LShowColor@LSystem["X", (* Hilbert curve II *)
    {"X" -> "XFYFX+F+YFXFY-F-XFYFX",
     "Y" -> "YFXFY-F-XFYFX+F+YFXFY"}, 3];
 */