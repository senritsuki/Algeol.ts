/** Algorithm and Geometry - ジオメトリと複製アルゴリズム */

import * as ut from "./math/utility";
import * as vc from "./math/vector";
import * as mx from "./math/matrix";

export interface GeoRoot {
	/** () -> 頂点座標の配列 */
	verts(): vc.V3[];
	/** () -> ポリゴン面を表す頂点インデックス配列の配列 */
	faces(): number[][];
}

/** Geometry - ジオメトリ */
export interface Geo extends GeoRoot {
	/** 複製 */
	duplicate(lambda: (geo: Geo) => Geo[]): Geo[];
}

/** Geometry Group - ジオメトリグループ */
export interface GeoGroup extends GeoRoot {
	/** () -> グループ名 */
	name(): string;
	/** () -> ジオメトリ */
	geos(): Geo[];
	/** 複製 */
	duplicate(lambda: (geo: Geo) => Geo[]): GeoGroup;
}

/** ジオメトリグループの辞書 */
export interface GeoDict extends GeoRoot {
	/** () -> 辞書 */
	dict(): { [name: string]: GeoGroup };
	/** () -> ジオメトリ */
	geogroups(): GeoGroup[];
	/** 複製 */
	duplicate(lambda: (geo: Geo) => Geo[]): GeoDict;
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
	duplicate(lambda: (geo: Geo) => Geo[]): Geo[] {
		return lambda(this);
	}
}

class GeoGroupImpl implements GeoGroup {
	constructor(
		public _name: string,
		public _geos: Geo[]) { }

	verts(): vc.V3[] {
		return this._geos
			.map(geo => geo.verts())
			.reduce((array, verts) => array.concat(verts), []);
	}
	faces(): number[][] {
		const faces: number[][] = [];
		let offset = 0;
		this._geos.forEach(geo => {
			geo.faces()
				.map(face => face.map(i => i + offset))
				.forEach(face => faces.push(face));
			offset += geo.verts().length;
		});
		return faces;
	}
	name(): string {
		return this._name;
	}
	geos(): Geo[] {
		return this._geos;
	}
	duplicate(lambda: (geo: Geo) => Geo[]): GeoGroup {
		return new GeoGroupImpl(this._name, this._geos.map(lambda).reduce((a, b) => a.concat(b), <Geo[]>[]));
	}
}

class GeoDictImpl implements GeoDict {
	_names: string[] = [];
	_dict: { [name: string]: GeoGroup } = {};

	constructor(geogroups: GeoGroup[]) {
		geogroups.forEach(geogroup => {
			const name = geogroup.name();
			if (this._dict[name] == undefined) {
				this._dict[name] = geogroup;
				this._names.push(name);
			} else {
				this._dict[name] = new GeoGroupImpl(name, this._dict[name].geos().concat(geogroup.geos()));
			}
		});
	}

	static Merge(geodicts: GeoDict[]): GeoDictImpl {
		return new GeoDictImpl(geodicts.reduce((geogroups, geodict) => geogroups.concat(geodict.geogroups()), <GeoGroup[]>[]));
	}

	verts(): vc.V3[] {
		return this.geogroups()
			.map(geo => geo.verts())
			.reduce((array, verts) => array.concat(verts), []);
	}
	faces(): number[][] {
		const faces: number[][] = [];
		let offset = 0;
		this.geogroups().forEach(geo => {
			geo.faces()
				.map(face => face.map(i => i + offset))
				.forEach(face => faces.push(face));
			offset += geo.verts().length;
		});
		return faces;
	}
	dict(): { [name: string]: GeoGroup } {
		return this._dict;
	}
	geogroups(): GeoGroup[] {
		return this._names.map(name => this._dict[name]);
	}
	duplicate(lambda: (geo: Geo) => Geo[]): GeoDict {
		return new GeoDictImpl(this.geogroups().map(geogroup => geogroup.duplicate(lambda)));
	}
}

/** (頂点(3次元ベクトル)の配列, 面(頂点インデックス配列)の配列) -> ジオメトリ */
export function geo(verts: vc.V3[], faces: number[][]): Geo {
	return new GeoImpl(verts, faces);
}
/** (グループ名, ジオメトリの配列) -> ジオメトリグループ */
export function geoGroup(name: string, geos: Geo[]): GeoGroup {
	return new GeoGroupImpl(name, geos);
}
/** (ジオメトリグループの配列) -> ジオメトリグループ辞書 */
export function geoDict(geogroups: GeoGroup[]): GeoDict {
	return new GeoDictImpl(geogroups);
}
/** (ジオメトリグループ辞書の配列) -> ジオメトリグループ辞書 */
export function merge_geoDict(geodicts: GeoDict[]): GeoDict {
	return GeoDictImpl.Merge(geodicts);
}


/** アフィン写像配列を用いたジオメトリ複製 */
export function duplicateGeoWithAffine(g: Geo, m4: mx.M4[]): Geo[] {
	return duplicateGeo(g, m4.map(m => (v: vc.V3) => m.map_v3(v, 1)));
}
/** 写像配列を用いたジオメトリ複製 */
export function duplicateGeo(g: Geo, maps: Array<(v: vc.V3) => vc.V3>): Geo[] {
	const verts = g.verts();
	const faces = g.faces();
	return maps.map(m => geo(verts.map(m), faces));
}

/** 任意のデータ配列を用いた合成写像の生成 */
export function compositeMap<T>(data: T[], lambdas: Array<(d: T) => mx.M4>): mx.M4[] {
	return data.map(d => lambdas.reduce((m, lambda) => m.mul(lambda(d)), mx.unit_m4));
}

