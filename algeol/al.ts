
import * as ut from "./math/util";
import * as vc from "./math/vector";
import * as mx from "./math/matrix";
import * as lim from "./lim";
import * as seqlim from "./seqlim";


/** Geometry - ジオメトリ */
export interface Geo {
	/** () -> 頂点座標の配列 */
	verts(): vc.V3[];
	/** () -> ポリゴン面を表す頂点インデックス配列の配列 */
	faces(): number[][];
	/** () -> 頂点数 */
	vertsNum(): number;
}
export interface GeoGroup {
	/** () -> グループ名 */
	name(): string;
	/** () -> ジオメトリ */
	geos(): Geo[];
	/** () -> 頂点数 */
	vertsNum(): number;
}


class GeoImpl implements Geo {
	constructor(
		public _verts: vc.V3[],
		public _faces: number[][]) { }

	verts(): vc.V3[] {
		return this._verts;
	}
	faces(): number[][] {
		return this._faces;
	}
	vertsNum(): number {
		return this._verts.length;
	}
}
class GeoGroupImpl implements GeoGroup {
	constructor(
		public _name: string,
		public _geos: Geo[]) { }

	name(): string {
		return this._name;
	}
	geos(): Geo[] {
		return this._geos;
	}
	vertsNum(): number {
		return this.geos().reduce((n, geo) => n + geo.vertsNum(), 0);
	}
}

export function geo(verts: vc.V3[], faces: number[][]): Geo {
	return new GeoImpl(verts, faces);
}
export function geoGroup(name: string, geos: Geo[]): GeoGroup {
	return new GeoGroupImpl(name, geos);
}



export interface ObjBase {
	arrayOXYZ(): vc.V3[];
	o(): vc.V3;
	x(): vc.V3;
	y(): vc.V3;
	z(): vc.V3;
	m4(): mx.M4;
}

class ObjBaseImpl implements ObjBase {
	constructor(
		public _o: vc.V3 = vc.zero_v3,
		public _x: vc.V3 = vc.unitX_v3,
		public _y: vc.V3 = vc.unitY_v3,
		public _z: vc.V3 = vc.unitZ_v3) { }

	static FromArrayOXYZ(v: vc.V3[]): ObjBaseImpl { return new ObjBaseImpl(v[0], v[1], v[2], v[3]); }

	arrayOXYZ(): vc.V3[] { return [this._o, this._x, this._y, this._z]; }
	o(): vc.V3 { return this._o; }
	x(): vc.V3 { return this._x; }
	y(): vc.V3 { return this._y; }
	z(): vc.V3 { return this._z; }
	m4(): mx.M4 { return mx.v4cols_m4([this._x, this._y, this._z, this._o].map(v => vc.v3_v4(v, 1))); }
}

export const oxyz_default: ObjBase = new ObjBaseImpl();

export interface Obj {
	duplicate(lim: (v: vc.V3) => vc.V3[]): Obj[];
	geo(): Geo;
}

class ObjOXYZ implements Obj {
	constructor(
		public _geo: (oxyz: ObjBase) => Geo,
		public _oxyz: ObjBase = oxyz_default) {}

	duplicate(seqlim: (v: vc.V3) => vc.V3[]): Obj[] {
		const ar_oxyz = this._oxyz.arrayOXYZ().map(seqlim);
		const la_oxyz = (i: number) => ObjBaseImpl.FromArrayOXYZ(ut.seq.arith(4).map(j => ar_oxyz[j][i]));
		const ar_i = ut.seq.arith(ar_oxyz[0].length);
		return ar_i.map(i => new ObjOXYZ(this._geo, la_oxyz(i)));
	}
	geo(): Geo {
		return this._geo(this._oxyz);
	}
}

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
	const c = vl[0];
	const d = vl.slice(1).map(v => v.sub(c));
	return new SpaceImpl(c, ar_basis3(d));
}
export const default_space: Space = new SpaceDefault();


export interface _Obj {
	/** Affine Transformation - アフィン写像
		(4次元正方行列) -> void
		全ての頂点(w=1扱い)にアフィン写像を適用し、自身を上書きする. 破壊的操作! */
	_apply(m: mx.M4): void;
	/** 1つのアフィン写像による複製
		(4次元正方行列) -> 自身の複製にアフィン写像を適用した結果
		自身を複製して全ての頂点(w=1扱い)にアフィン写像を適用する. 非破壊操作 */
	duplicateOne(m: mx.M4): _Obj;
	/** 複数のアフィン写像による複製
		(4次元正方行列の配列) -> 自身の複製にアフィン写像を適用した結果の配列
		自身を複製して全ての頂点(w=1扱い)にアフィン写像を適用する、という操作を写像の数だけ繰り返す. 非破壊操作 */
	duplicateList(ms: mx.M4[]): _Obj[];
	/** () -> 自身の複製
		浅いコピー */
	clone(): _Obj;
	/** () -> ジオメトリ */
	geo(): Geo;
}

class _ObjImpl implements _Obj {
	constructor(
		public _name: string,
		public _verts: vc.V3[],
		public _geo: (name: string, verts: vc.V3[]) => Geo) { }

	_apply(m: mx.M4): void {
		this._verts = this._verts.map(v => vc.v4_v3(m.map_v4(vc.v3_v4(v, 1))));
	}
	duplicateOne(m: mx.M4): _Obj {
		const o = this.clone(); o._apply(m); return o;
	}
	duplicateList(ms: mx.M4[]): _Obj[] {
		return ms.map(m => this.duplicateOne(m));
	}
	clone(): _Obj {
		return new _ObjImpl(this._name, this._verts, this._geo);
	}
	geo(): Geo {
		return this._geo(this._name, this._verts);
	}
}

export function _obj(name: string, verts: vc.V3[], geo: (name: string, verts: vc.V3[]) => Geo): _Obj {
	return new _ObjImpl(name, verts, geo);
}


export interface LimObj {
	obj(): _Obj;
	lims(): seqlim.SeqLim[];
	geo(): Geo[];
}

class LimObjImpl implements LimObj {
	constructor(
		public _obj: _Obj,
		public _lims: seqlim.SeqLim[]) { }

	obj(): _Obj {
		return this._obj;
	}
	lims(): seqlim.SeqLim[] {
		return this._lims;
	}
	geo(): Geo[] {
		return this._obj.duplicateList(seqlim.merge(this._lims).lim()).map(o => o.geo());
	}
}

export function limobj(obj: _Obj, lims: seqlim.SeqLim[]): LimObj {
	return new LimObjImpl(obj, lims);
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
