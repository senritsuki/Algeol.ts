
import * as vc from "./math/vector";
import * as mx from "./math/matrix";
import * as li from "./seqlim";


export interface Basis3 {
	array(): vc.V3[];
	x(): vc.V3;
	y(): vc.V3;
	z(): vc.V3;
	m4(): mx.M4;
}

class Basis3Impl implements Basis3 {
	constructor(
		public _x: vc.V3,
		public _y: vc.V3,
		public _z: vc.V3) { }

	array(): vc.V3[] { return [this._x, this._y, this._z] }
	x(): vc.V3 { return this._x; }
	y(): vc.V3 { return this._y; }
	z(): vc.V3 { return this._z; }
	m4(): mx.M4 { return mx.m3_m4(mx.v3cols_m3(this.array())); }
}

class Basis3Default implements Basis3 {
	array(): vc.V3[] { return [this.x(), this.y(), this.z()] }
	x(): vc.V3 { return vc.unitX_v3; }
	y(): vc.V3 { return vc.unitY_v3; }
	z(): vc.V3 { return vc.unitZ_v3; }
	m4(): mx.M4 { return mx.unit_m4; }
}

export function basis3(x: vc.V3, y: vc.V3, z: vc.V3): Basis3 {
	return new Basis3Impl(x, y, z);
}
export function ar_basis3(vl: vc.V3[]): Basis3 {
	return new Basis3Impl(vl[0], vl[1], vl[2]);
}
export const default_basis3: Basis3 = new Basis3Default();


export interface Space {
	array(): vc.V3[];
	c(): vc.V3;
	d(): Basis3;
	m4(): mx.M4;
}

class SpaceImpl implements Space {
	constructor(
		public _c: vc.V3,
		public _d: Basis3) { }

	array(): vc.V3[] { return [this._c].concat(this._d.array()) }
	c(): vc.V3 { return this._c; }
	d(): Basis3 { return this._d; }
	m4(): mx.M4 { return mx.trans_v3_m4(this._c).mul(this._d.m4()); }
}
class SpaceDefault implements Space {
	static _c = vc.zero_v3;
	static _d = default_basis3;
	static _array = [vc.zero_v3].concat(default_basis3.array());

	array(): vc.V3[] { return SpaceDefault._array; }
	c(): vc.V3 { return SpaceDefault._c; }
	d(): Basis3 { return SpaceDefault._d; }
	m4(): mx.M4 { return mx.unit_m4; }
}

export function space(c: vc.V3, d: Basis3): Space {
	return new SpaceImpl(c, d);
}
export function ar_space(vl: vc.V3[]): Space {
	return new SpaceImpl(vl[0], ar_basis3(vl.slice(1)));
}
export const default_space: Space = new SpaceDefault();


export interface Obj {
	/** Affine Transformation - アフィン写像
		(4次元正方行列) -> void
		全ての頂点(w=1扱い)にアフィン写像を適用し、自身を上書きする. 破壊的操作! */
	_apply(m: mx.M4): void;
	/** 1つのアフィン写像による複製
		(4次元正方行列) -> 自身の複製にアフィン写像を適用した結果
		自身を複製して全ての頂点(w=1扱い)にアフィン写像を適用する. 非破壊操作 */
	duplicateOne(m: mx.M4): Obj;
	/** 複数のアフィン写像による複製
		(4次元正方行列の配列) -> 自身の複製にアフィン写像を適用した結果の配列
		自身を複製して全ての頂点(w=1扱い)にアフィン写像を適用する、という操作を写像の数だけ繰り返す. 非破壊操作 */
	duplicateList(ms: mx.M4[]): Obj[];
	/** () -> 自身の複製
		浅いコピー */
	clone(): Obj;
	/** () -> ジオメトリ */
	geo(): Geo;
}

class ObjImpl implements Obj {
	constructor(
		public _name: string,
		public _verts: vc.V3[],
		public _geo: (name: string, verts: vc.V3[]) => Geo) { }

	_apply(m: mx.M4): void {
		this._verts = this._verts.map(v => vc.v4_v3(m.map(vc.v3_v4(v, 1))));
	}
	duplicateOne(m: mx.M4): Obj {
		const o = this.clone(); o._apply(m); return o;
	}
	duplicateList(ms: mx.M4[]): Obj[] {
		return ms.map(m => this.duplicateOne(m));
	}
	clone(): Obj {
		return new ObjImpl(this._name, this._verts, this._geo);
	}
	geo(): Geo {
		return this._geo(this._name, this._verts);
	}
}

export function obj(name: string, verts: vc.V3[], geo: (name: string, verts: vc.V3[]) => Geo): Obj {
	return new ObjImpl(name, verts, geo);
}


export interface LimObj {
	obj(): Obj;
	lims(): li.SeqLim[];
	geo(): Geo[];
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

class GeoImpl implements Geo {
	constructor(
		public _name: string,
		public _verts: vc.V3[],
		public _faces: number[][]) {}

	name(): string { return this._name; }
	verts(): vc.V3[] { return this._verts; }
	faces(): number[][] { return this._faces; }
}

export function geo(name: string, verts: vc.V3[], faces: number[][]): Geo {
	return new GeoImpl(name, verts, faces);
}


export function geos_wavefrontObj(geos: Geo[]): string[] {
	return geos.map(geo => geo_wavefrontObj(geo)).reduce((a, b) => a.concat(b));
}
export function geo_wavefrontObj(geo: Geo, offset: number = 0): string[] {
	const strs: string[] = [];
	strs.push(['g', geo.name()].join(' '));
	geo.verts().forEach(v => strs.push(['v', v.x(), v.z(), -v.y()].join(' ')));
	geo.faces().forEach(f => strs.push(['f'].concat(f.map(i => '' + (i + 1 + offset))).join(' ')));
	return strs;
}


export interface Curve {
	coord(t: number): vc._Vector3;
	space(t: number, d: number): Space;
	seqCoord(start: number, step: number, count: number): vc._Vector3[];
	seqSpace(start: number, step: number, count: number): Space[];
}

/*
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
*/
