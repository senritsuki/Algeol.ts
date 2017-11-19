/** L-system, Lindenmayer system */

import * as cv from './curve2';
import * as tt from './turtle';


export interface V {
	/** variable alphabet */
	v(): string;
	/** production rules */
	p(): V[];
}

export function l_system(start: V[], rec: number): V[] {
	if (rec <= 0) {
		return start;
	}
	const v2 = start
		.map(v => v.p())
		.reduce((a, b) => a.concat(b), <V[]>[]);
	return l_system(v2, rec - 1);
}

/** 共通 */
export namespace presets {
	/** turn left */
	export const P: V = { v: () => '+', p: () => [P], }
	/** turn right */
	export const N: V = { v: () => '-', p: () => [N], }
	/** push position */
	export const I: V = { v: () => '[', p: () => [I], }
	/** pop position */
	export const O: V = { v: () => ']', p: () => [O], }

	export type Dict = { [v: string]: (turtlePrev: tt.Turtle2, lines: cv.Curve[], queue: tt.Turtle2[]) => tt.Turtle2 };

	export function turtle_common(vl: V[], dict: Dict): cv.Curve[] {
		const lines: cv.Curve[] = [];
		const queue: tt.Turtle2[] = [];
		let turtle = tt.turtle2();
		vl.forEach(v => turtle = dict[v.v()](turtle, lines, queue));
		return lines;
	}
	export function movedraw(r: number) {
		return (turtlePrev: tt.Turtle2, lines: cv.Curve[], _queue: tt.Turtle2[]) => {
			 const d = turtlePrev.moveDraw(r);
			 lines.push(d.line);
			 return d.turtle;
		};
	}
	export function turn(degree: number) {
		return (turtlePrev: tt.Turtle2, _lines: cv.Curve[], _queue: tt.Turtle2[]) => turtlePrev.turn(degree);
	}

	/** Algae - 藻
		A, A -> AB, B -> A */
	export namespace Algae {
		export const A: V = { v: () => 'A', p: () => [A, B], };
		export const B: V = { v: () => 'B', p: () => [A], };
		export const start = [A];
	}
	/** Fibonacci Sequence - フィボナッチ数列
		A, A -> B, B -> AB */
	export namespace FibonacciSequence {
		export const A: V = { v: () => 'A', p: () => [B], };
		export const B: V = { v: () => 'B', p: () => [A, B], };
		export const start = [A];
	}
	/** Cantor Set - カントール集合
		A, A -> ABA, B -> BBB */
	export namespace CantorSet {
		export const A: V = { v: () => 'A', p: () => [A, B, A], };
		export const B: V = { v: () => 'B', p: () => [B, B, B], };
		export const start = [A];
	}
	/** Koch Curve - コッホ曲線 60deg
		F, F -> F+F--F+F */
	export namespace KochCurve60 {
		export const F: V = { v: () => 'F', p: () => [F, P, F, N, N, F, P, F], };
		export const start = [F];

		export function turtle(vl: V[], r: number = 1): cv.Curve[] {
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
		export const F: V = { v: () => 'F', p: () => [F, P, F, N, F, N, F, P, F], };
		export const start = [F];

		export function turtle(vl: V[], r: number = 1): cv.Curve[] {
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
		export const F: V = { v: () => 'F', p: () => [F, N, F, P, F, P, F, F, F, N, F, N, F, P, F], };
		export const start = [F, P, F, P, F, P, F];

		export function turtle(vl: V[], r: number = 1): cv.Curve[] {
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
		export const F: V = { v: () => 'F', p: () => [F, P, F, N, F, N, F, N, F, P, F, P, F, P, F, N, F], };
		export const start = [F];

		export function turtle(vl: V[], r: number = 1): cv.Curve[] {
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
		export const A: V = { v: () => 'A', p: () => [A, N, B, N, N, B, P, A, P, P, A, A, P, B, N], };
		export const B: V = { v: () => 'B', p: () => [P, A, N, B, B, N, N, B, N, A, P, P, A, P, B], };
		export const start = [A];

		export function turtle(vl: V[], r: number = 1): cv.Curve[] {
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
		export const A: V = { v: () => 'A', p: () => [B, P, A, P, B], };
		export const B: V = { v: () => 'B', p: () => [A, N, B, N, A], };
		export const start = [A];

		export function turtle(vl: V[], r: number = 1): cv.Curve[] {
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
		export const A: V = { v: () => 'A', p: () => [A, P, B, N, A, N, B, P, A], };
		export const B: V = { v: () => 'B', p: () => [B, B], };
		export const start = [A, P, B, P, B];

		export function turtle(vl: V[], r: number = 1): cv.Curve[] {
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
		export const A: V = { v: () => 'A', p: () => [A], };
		export const B: V = { v: () => 'B', p: () => [B, N, A, P, A, N, B, P, A, P, B, N, A, P, A, N, B], };
		export const start = [A, P, B, P, A, P, B];

		export function turtle(vl: V[], r: number = 1): cv.Curve[] {
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
		export const A: V = { v: () => 'A', p: () => [A, P, B, P], };
		export const B: V = { v: () => 'B', p: () => [N, A, N, B], };
		export const start = [A];

		export function turtle(vl: V[], r: number = 1): cv.Curve[] {
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
		export const A: V = { v: () => 'A', p: () => [B, I, A, O, A], };
		export const B: V = { v: () => 'B', p: () => [B, B], };
		export const start = [A];

		export function turtle2(vl: V[], r: number = 1): cv.Curve[] {
			return turtle_common(vl, {
				'A': movedraw(r),
				'B': movedraw(r),
				'[': (t, _l, q) => { q.push(t); return t.turn(45); },
				']': (t, _l, q) => { const t2 = q.pop(); return (t2 != undefined ? t2 : t).turn(-45); },
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