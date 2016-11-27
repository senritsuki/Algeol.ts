
import * as vc from "./math/vector";
import * as mx from "./math/matrix";


export interface Basis3 {
	x(): vc.V3;
	y(): vc.V3;
	z(): vc.V3;
}

class Basis3Impl implements Basis3 {
	constructor(
		public _x: vc.V3,
		public _y: vc.V3,
		public _z: vc.V3) { }

	x(): vc.V3 { return this._x; }
	y(): vc.V3 { return this._y; }
	z(): vc.V3 { return this._z; }
}

export function basis3(
	x: vc.V3,
	y: vc.V3,
	z: vc.V3): Basis3 {
	return new Basis3Impl(x, y, z);
}


export interface Space {
	c(): vc.V3;
	d(): Basis3;
}

class SpaceImpl implements Space {
	constructor(
		public _c: vc.V3,
		public _d: Basis3) { }

	c(): vc.V3 { return this._c; }
	d(): Basis3 { return this._d; }
}

export function space(c: vc.V3, d: Basis3) {
	return new SpaceImpl(c, d);
}


export interface Obj {
	apply(m: mx.M4): void;
	clone(): Obj;
	children(): Obj[];
	duplicateOne(m: mx.M4): Obj;
	duplicateList(ms: mx.M4[]): Obj[];
}


/** Geometry - ジオメトリ */
export interface Geo {
	/** () -> ジオメトリ名 */
	name(): string;
	/** () -> 頂点座標の配列 */
	verts(): vc.V3[];
	/** () -> ポリゴン面を表す頂点インデックス配列の配列 */
	faces(): number[][];
}

export function geos_wavefrontObj(geos: Geo[]): string[] {
	const strs: string[] = [];
	geos.forEach((geo: Geo) => {

	});
	return strs;
}
export function geo_wavefrontObj(geo: Geo, offset: number = 0): string[] {
	const strs: string[] = [];
	strs.push(['g', geo.name()].join(' '));
	geo.verts().forEach(v => strs.push(['v', v.x(), v.z(), v.y()].join(' ')));
	geo.faces().forEach(f => strs.push(['f'].concat(f.map(i => '' + (i + 1 + offset))).join(' ')));
	return strs;
}


export interface Curve {
	coord(t: number): vc._Vector3;
	space(t: number, d: number): Space;
	seqCoord(start: number, step: number, count: number): vc._Vector3[];
	seqSpace(start: number, step: number, count: number): Space[];
}

class Spiral implements Curve {
	constructor(
		_o: vc._Vector3,
		_dirStart: vc._Vector3,
		_dirEnd: vc._Vector3) { }

	coord(t: number): vc._Vector3 { return null; }
	space(t: number, d: number): Space { return null; }
	seqCoord(start: number, step: number, count: number): vc._Vector3[] { return null; }
	seqSpace(start: number, step: number, count: number): Space[] { return null; }
}



export function hoge() { }
