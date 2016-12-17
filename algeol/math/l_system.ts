/** L-system, Lindenmayer system */

import * as ut from './util';
import * as vc from './vector';
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


/** Algae - 藻 */
export namespace Algae {
	export const A: V = {
		v: () => 'A',
		p: () => [A, B],
	}
	export const B: V = {
		v: () => 'B',
		p: () => [A],
	}
	export const start = [A];
}
/** Fibonacci Sequence - フィボナッチ数列 */
export namespace FibonacciSequence {
	export const A: V = {
		v: () => 'A',
		p: () => [B],
	}
	export const B: V = {
		v: () => 'B',
		p: () => [A, B],
	}
	export const start = [A];
}
/** Cantor Set - カントール集合 */
export namespace CantorSet {
	export const A: V = {
		v: () => 'A',
		p: () => [A, B, A],
	}
	export const B: V = {
		v: () => 'B',
		p: () => [B, B, B],
	}
	export const start = [A];
}
/** Koch Curve - コッホ曲線 */
export namespace KochCurve {
	export const F: V = {
		v: () => 'F',
		p: () => [F, P, F, N, F, N, F, P, F],
	}
	export const P: V = {
		v: () => '+',
		p: () => [P],
	}
	export const N: V = {
		v: () => '-',
		p: () => [N],
	}
	export const start = [F];

	export function turtle2(vl: V[], r: number = 1): tt.Line2[] {
		const lines: tt.Line2[] = [];
		const movedraw = (t: tt.Turtle2) => { const d = t.moveDraw(r); lines.push(d.line); return d.turtle; }
		const dict: { [v: string]: (turtlePrev: tt.Turtle2) => tt.Turtle2 } = {
			'F': movedraw,
			'+': t => t.turn(90),
			'-': t => t.turn(-90),
		};
		let turtle = tt.turtle2();
		vl.forEach(v => turtle = dict[v.v()](turtle));
		return lines;
	}
}
/** Koch Island - コッホ島 */
export namespace KochIsland {
	export const F: V = {
		v: () => 'F',
		p: () => [F, P, F, N, F, N, F, P, F],
	}
	export const P: V = {
		v: () => '+',
		p: () => [P],
	}
	export const N: V = {
		v: () => '-',
		p: () => [N],
	}
	export const start = [F];

	export function turtle2(vl: V[], r: number = 1): tt.Line2[] {
		const lines: tt.Line2[] = [];
		const movedraw = (t: tt.Turtle2) => { const d = t.moveDraw(r); lines.push(d.line); return d.turtle; }
		const dict: { [v: string]: (turtlePrev: tt.Turtle2) => tt.Turtle2 } = {
			'F': movedraw,
			'+': t => t.turn(90),
			'-': t => t.turn(-90),
		};
		let turtle = tt.turtle2();
		vl.forEach(v => turtle = dict[v.v()](turtle));
		return lines;
	}
}
/** Sierpinski triangle - シェルピンスキーの三角形 */
export namespace SierpinskiTriangle {
	/** F: draw forward
		F → F−G+F+G−F */
	export const F: V = {
		v: () => 'F',
		p: () => [F, N, G, P, F, P, G, N, F],
	}
	/** G: draw forward
		G → GG */
	export const G: V = {
		v: () => 'G',
		p: () => [G, G],
	}
	/** +: turn left
		constants */
	export const P: V = {
		v: () => '+',
		p: () => [P],
	}
	/** -: turn right
		constants */
	export const N: V = {
		v: () => '-',
		p: () => [N],
	}
	/** start: F−G−G */
	export const start = [F, N, G, N, G];

	export function turtle2(vl: V[], r: number = 1): tt.Line2[] {
		const lines: tt.Line2[] = [];
		const movedraw = (t: tt.Turtle2) => { const d = t.moveDraw(r); lines.push(d.line); return d.turtle; }
		const dict: { [v: string]: (turtlePrev: tt.Turtle2) => tt.Turtle2 } = {
			'F': movedraw,
			'G': movedraw,
			'+': t => t.turn(120),
			'-': t => t.turn(-120),
		};
		let turtle = tt.turtle2();
		vl.forEach(v => turtle = dict[v.v()](turtle));
		return lines;
	}
}
/** Sierpinski arrowhead curve - シェルピンスキーの三角形 */
export namespace SierpinskiArrowheadCurve {
	export const A: V = {
		v: () => 'A',
		p: () => [B, N, A, N, B],
	}
	export const B: V = {
		v: () => 'B',
		p: () => [A, P, B, P, A],
	}
	export const P: V = {
		v: () => '+',
		p: () => [P],
	}
	export const N: V = {
		v: () => '-',
		p: () => [N],
	}
	export const start = [A];

	export function turtle2(vl: V[], r: number = 1): tt.Line2[] {
		const lines: tt.Line2[] = [];
		const movedraw = (t: tt.Turtle2) => { const d = t.moveDraw(r); lines.push(d.line); return d.turtle; }
		const dict: { [v: string]: (turtlePrev: tt.Turtle2) => tt.Turtle2 } = {
			'A': movedraw,
			'B': movedraw,
			'+': t => t.turn(60),
			'-': t => t.turn(-60),
		};
		let turtle = tt.turtle2();
		vl.forEach(v => turtle = dict[v.v()](turtle));
		return lines;
	}
}
/** Pythagoras Tree - ピタゴラスの木 */
export namespace PythagorasTree {
	/** 0: draw a line segment ending in a leaf
		0 → 1[0]0 */
	export const A: V = {
		v: () => '0',
		p: () => [B, I, A, O, A],
	}
	/** 1: draw a line segment
		1 → 11 */
	export const B: V = {
		v: () => '1',
		p: () => [B, B],
	}
	/** [: push position and angle, turn left 45 degrees
		constants */
	export const I: V = {
		v: () => '[',
		p: () => [I],
	}
	/** ]: pop position and angle, turn right 45 degrees
		constants */
	export const O: V = {
		v: () => ']',
		p: () => [O],
	}
	export const start = [A];

	export function turtle2(vl: V[], r: number = 1): tt.Line2[] {
		const queue: tt.Turtle2[] = [];
		const lines: tt.Line2[] = [];
		const movedraw = (t: tt.Turtle2) => { const d = t.moveDraw(r); lines.push(d.line); return d.turtle; }
		const dict: { [v: string]: (turtlePrev: tt.Turtle2) => tt.Turtle2 } = {
			'0': movedraw,
			'1': movedraw,
			'[': t => { queue.push(t); return t.turn(45); },
			']': t => { const t2 = queue.pop(); return (t2 != undefined ? t2 : t).turn(-45); },
		};
		let turtle = tt.turtle2();
		vl.forEach(v => turtle = dict[v.v()](turtle));
		return lines;
	}
}
/** Dragon Curve - ドラゴン曲線 */
export namespace DragonCurve {
}
