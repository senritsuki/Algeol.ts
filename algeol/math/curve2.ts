/** Curve with Parametric Equation - 2次元平面におけるパラメトリック方程式による曲線 */

import * as ut from "../math/utility";
import * as vc from "./vector";

export let _E = 0.001;


/** 位置ベクトルと方向ベクトルのペア */
export interface CD {
	/** Coordinate Vector - 位置ベクトル */
	c(): vc.V2;
	/** Direction Vector - 方向ベクトル */
	d(): vc.V2;
}

class CDImpl implements CD {
	constructor(
		public _c: vc.V2,
		public _d: vc.V2) { }

	c(): vc.V2 { return this._c; }
	d(): vc.V2 { return this._d; }
}

/** 位置ベクトルと方向ベクトルのペア */
export function cd(c: vc.V2, d: vc.V2): CD {
	return new CDImpl(c, d);
}



/** Curve with Parametric Equation - パラメトリック方程式による曲線 */
export interface Curve {
	/** coord(0) と同値 */
	start(): vc.V2;
	/** coord(1) と同値 */
	end(): vc.V2;
	/** パラメータiに対応する位置 */
	coord(i: number): vc.V2;
	/** パラメータiに対応する位置と方向 */
	cd(i: number, delta?: number): CD;
	/** 制御点の配列 */
	controls(): vc.V2[];
}

/** 連続曲線 */
export interface CurveArray extends Curve {
	/** 曲線の配列 */
	curves(): Curve[];
	/** 曲線の数 */
	curveNum(): number;
}


class CurveArrayImpl implements CurveArray {
	constructor(
		public _curves: Curve[]){}

	start(): vc.V2 { return this.coord(0); }
	end(): vc.V2 { return this.coord(1); }
	curves(): Curve[] { return this._curves.slice(0); }
	curveNum(): number { return this._curves.length; }

	controls(): vc.V2[] {
		return this._curves.map(c => c.controls()).reduce((a, b) => a.concat(b), <vc.V2[]>[]);
	}
	cd(i: number, delta: number = _E): CD {
		const c = this.coord(i);
		const d1 = this.coord(i - delta);
		const d2 = this.coord(i + delta);
		return cd(c, d2.sub(d1));
	}
	coord(i: number): vc.V2 {
		const j = i <= 0 ?
			0 :
			i >= this._curves.length - 1 ?
				this._curves.length - 1 :
				ut.floor(i);
		const k = i - j;
		return this._curves[j].coord(k);
	}
}

abstract class CurveBase implements Curve {
	constructor(
		public _v: vc.V2[]) { }

	start(): vc.V2 { return this.coord(0); }
	end(): vc.V2 { return this.coord(1); }
	controls(): vc.V2[] { return this._v.slice(0); }

	cd(i: number, delta: number = _E): CD {
		const c = this.coord(i);
		const d1 = this.coord(i - delta);
		const d2 = this.coord(i + delta);
		return cd(c, d2.sub(d1));
	}
	abstract coord(i: number): vc.V2;
}

/** (2次元ベクトル配列, 媒介変数) -> 2次元ベクトル を満たす任意の関数で定義される曲線 */
class LambdaCurve extends CurveBase {
	constructor(
		v: vc.V2[],
		public _lambda: (v: vc.V2[], i: number) => vc.V2) {
		super(v);
	}
	coord(i: number): vc.V2 { return this._lambda(this._v, i); }
}

/** 直線・一次曲線 */
class Line extends CurveBase {
	constructor(start: vc.V2, end: vc.V2) {
		super([start, end]);
	}
	coord(i: number): vc.V2 {
		const c0 = this._v[0].scalar(1 - i);
		const c1 = this._v[1].scalar(i);
		return c0.add(c1);
	}
}

/** 2次ベジェ曲線 */
class BezierCurve2 extends CurveBase {
	constructor(start: vc.V2, mid: vc.V2, end: vc.V2) {
		super([start, mid, end]);
	}
	coord(i: number): vc.V2 {
		return ut.seq.bernstein(3, i)
			.map((n, j) => this._v[j].scalar(n))
			.reduce((a, b) => a.add(b));
	}
}

/** 3次ベジェ曲線 */
class BezierCurve3 extends CurveBase {
	constructor(start: vc.V2, mid1: vc.V2, mid2: vc.V2, end: vc.V2) {
		super([start, mid1, mid2, end]);
	}
	coord(i: number): vc.V2 {
		return ut.seq.bernstein(3, i)
			.map((n, j) => this._v[j].scalar(n))
			.reduce((a, b) => a.add(b));
	}
}

/** 楕円 */
class Ellipse extends CurveBase {
	constructor(o: vc.V2, x: vc.V2, y: vc.V2) {
		super([o, x, y]);
	}
	coord(i: number): vc.V2 {
		const rad = i * ut.deg360;
		const o = this._v[0];
		const dx = this._v[1].sub(o).scalar(ut.cos(rad));
		const dy = this._v[2].sub(o).scalar(ut.sin(rad));
		return o.add(dx).add(dy);
	}
}
/** 螺旋 */
class Spiral extends CurveBase {
	constructor(o: vc.V2, x: vc.V2, y: vc.V2, z: vc.V2) {
		super([o, x, y, z]);
	}
	coord(i: number): vc.V2 {
		const rad = i * ut.deg360;
		const o = this._v[0];
		const dx = this._v[1].sub(o).scalar(ut.cos(rad));
		const dy = this._v[2].sub(o).scalar(ut.sin(rad));
		const dz = this._v[3].sub(o).scalar(i);
		return o.add(dx).add(dy).add(dz);
	}
}


/** (始点, 終点) -> 直線 */
export function line(start: vc.V2, end: vc.V2): Curve {
	return new Line(start, end);
}
/** ([始点, 終点]) -> 直線 */
export function ar_line(v: vc.V2[]): Curve {
	return new Line(v[0], v[1]);
}

/** (2次元ベクトル配列, 媒介変数) -> 2次元ベクトル を満たす任意の関数で定義される曲線 */
export function lambda(v: vc.V2[], la: (v: vc.V2[], i: number) => vc.V2): Curve {
	return new LambdaCurve(v, la);
}

/** (始点, 制御点, 終点) -> 2次ベジェ曲線 */
export function bezier2(start: vc.V2, mid: vc.V2, end: vc.V2): Curve {
	return new BezierCurve2(start, mid, end);
}
/** ([始点, 制御点, 終点]) -> 2次ベジェ曲線 */
export function ar_bezier2(v: vc.V2[]): Curve {
	return new BezierCurve2(v[0], v[1], v[2]);
}
/** (始点, 始点側制御点, 終点側制御点, 終点) -> 3次ベジェ曲線 */
export function bezier3(start: vc.V2, mid1: vc.V2, mid2: vc.V2, end: vc.V2): Curve {
	return new BezierCurve3(start, mid1, mid2, end);
}
/** ([始点, 始点側制御点, 終点側制御点, 終点]) -> 3次ベジェ曲線 */
export function ar_bezier3(v: vc.V2[]): Curve {
	return new BezierCurve3(v[0], v[1], v[2], v[2]);
}

/** (中心, x, y) -> 楕円 */
export function ellipse(o: vc.V2, x: vc.V2, y: vc.V2): Curve {
	return new Ellipse(o, x, y);
}
/** (中心, x, y, z) -> 螺旋 */
export function spiral(o: vc.V2, x: vc.V2, y: vc.V2, z: vc.V2): Curve {
	return new Spiral(o, x, y, z);
}

/** 連続曲線 */
export function multicurve2(curves: Curve[]): CurveArray {
	return new CurveArrayImpl(curves);
}
