/** Curve with Parametric Equation - パラメトリック方程式による曲線 */

import * as ut from "../math/util";
import * as vc from "./vector";

export let E = 0.001;


/** 位置ベクトルと方向ベクトルのペア */
export interface CD {
	/** Coordinate Vector - 位置ベクトル */
	c(): vc.V3;
	/** Direction Vector - 方向ベクトル */
	d(): vc.V3;
}
class CDImpl implements CD {
	constructor(
		public _c: vc.V3,
		public _d: vc.V3) { }

	c(): vc.V3 { return this._c; }
	d(): vc.V3 { return this._d; }
}
/** 位置ベクトルと方向ベクトルのペア */
export function cd(c: vc.V3, d: vc.V3): CD {
	return new CDImpl(c, d);
}

/** Curve with Parametric Equation - パラメトリック方程式による曲線 */
export interface Curve {
	start(): vc.V3;
	end(): vc.V3;
	coord(i: number): vc.V3;
	cd(i: number, delta?: number): CD;
}

abstract class CurveBase implements Curve {
	constructor(
		public _v: vc.V3[]) { }

	start(): vc.V3 { return this.coord(0); }
	end(): vc.V3 { return this.coord(1); }

	cd(i: number, delta: number = E): CD {
		const c = this.coord(i);
		const d1 = this.coord(i - delta);
		const d2 = this.coord(i + delta);
		return cd(c, d2.sub(d1));
	}

	abstract coord(i: number): vc.V3;
}

/** (3次元ベクトル配列, 媒介変数) -> 3次元ベクトル を満たす任意の関数で定義される曲線 */
class LambdaCurve extends CurveBase {
	constructor(
		v: vc.V3[],
		public _lambda: (v: vc.V3[], i: number) => vc.V3) {
		super(v);
	}

	coord(i: number): vc.V3 { return this._lambda(this._v, i); }
}

/** 制御点が2つの曲線 */
abstract class Curve2 extends CurveBase {
	constructor(start: vc.V3, end: vc.V3) {
		super([start, end]);
	}

	abstract coord(i: number): vc.V3;
}
/** 直線・一次曲線 */
class Line extends Curve2 {
	coord(i: number): vc.V3 {
		const c0 = this.start().scalar(1 - i);
		const c1 = this.end().scalar(i);
		return c0.add(c1);
	}
}

/** 制御点が3つの曲線 */
abstract class Curve3 extends CurveBase {
	constructor(start: vc.V3, mid: vc.V3, end: vc.V3) {
		super([start, mid, end]);
	}

	abstract coord(i: number): vc.V3;
}
/** 2次ベジェ曲線 */
class BezierCurve2 extends Curve3 {
	coord(i: number): vc.V3 {
		return ut.seq.bernstein(3, i)
			.map((n, i) => this._v[i].scalar(n))
			.reduce((a, b) => a.add(b));
	}
}

/** 制御点が4つの曲線 */
abstract class Curve4 extends CurveBase {
	constructor(start: vc.V3, mid1: vc.V3, mid2: vc.V3, end: vc.V3) {
		super([start, mid1, mid2, end]);
	}

	abstract coord(i: number): vc.V3;
}
/** 3次ベジェ曲線 */
class BezierCurve3 extends Curve4 {
	coord(i: number): vc.V3 {
		return ut.seq.bernstein(3, i)
			.map((n, i) => this._v[i].scalar(n))
			.reduce((a, b) => a.add(b));
	}
}

/** (3次元ベクトル配列, 媒介変数) -> 3次元ベクトル を満たす任意の関数で定義される曲線 */
export function lambda(v: vc.V3[], la: (v: vc.V3[], i: number) => vc.V3): Curve {
	return new LambdaCurve(v, la);
}
/** (始点, 終点) -> 直線 */
export function line(start: vc.V3, end: vc.V3): Curve {
	return new Line(start, end);
}
/** ([始点, 終点]) -> 直線 */
export function ar_line(v: vc.V3[]): Curve {
	return new Line(v[0], v[1]);
}
/** (始点, 制御点, 終点) -> 2次ベジェ曲線 */
export function bezier2(start: vc.V3, mid: vc.V3, end: vc.V3): Curve {
	return new BezierCurve2(start, mid, end);
}
/** ([始点, 制御点, 終点]) -> 2次ベジェ曲線 */
export function ar_bezier2(v: vc.V3[]): Curve {
	return new BezierCurve2(v[0], v[1], v[2]);
}
/** (始点, 始点側制御点, 終点側制御点, 終点) -> 3次ベジェ曲線 */
export function bezier3(start: vc.V3, mid1: vc.V3, mid2: vc.V3, end: vc.V3): Curve {
	return new BezierCurve3(start, mid1, mid2, end);
}
/** ([始点, 始点側制御点, 終点側制御点, 終点]) -> 3次ベジェ曲線 */
export function ar_bezier3(v: vc.V3[]): Curve {
	return new BezierCurve3(v[0], v[1], v[2], v[3]);
}

