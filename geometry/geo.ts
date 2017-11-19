/** Algorithm and Geometry - ジオメトリと複製アルゴリズム */

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
	clone(lambda: (v: vc.V3) => vc.V3): Geo;
}

/** Geometry Group - ジオメトリグループ */
export interface GeoGroup extends GeoRoot {
	/** () -> グループ名 */
	name(): string;
	/** () -> ジオメトリ */
	geos(): Geo[];
	/** 複製 */
	clone(lambda: (v: vc.V3) => vc.V3): GeoGroup;
}

/** ジオメトリグループの辞書 */
export interface GeoDict extends GeoRoot {
	/** () -> 辞書 */
	dict(): { [name: string]: GeoGroup };
	/** () -> ジオメトリ */
	geogroups(): GeoGroup[];
	/** 複製 */
	clone(lambda: (v: vc.V3) => vc.V3): GeoDict;
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
	clone(lambda: (v: vc.V3) => vc.V3): Geo {
		return new GeoImpl(this._verts.map(lambda), this._faces);
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
	clone(lambda: (v: vc.V3) => vc.V3): GeoGroup {
		return new GeoGroupImpl(this._name, this._geos.map(g => g.clone(lambda)));
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
	clone(lambda: (v: vc.V3) => vc.V3): GeoDict {
		return new GeoDictImpl(this.geogroups().map(geogroup => geogroup.clone(lambda)));
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


const map_mm4 = (mm: mx.M4[]) => mm.map(m => (v: vc.V3) => m.map_v3(v, 1));

/** 写像配列を用いた3次元ベクトル配列複製 */
export function duplicateVerts(verts: vc.V3[], maps: Array<(v: vc.V3) => vc.V3>): vc.V3[][] {
	return maps.map(m => verts.map(m));
}
/** アフィン写像配列を用いた3次元ベクトル配列複製 */
export function duplicateVertsAffine(verts: vc.V3[], m4: mx.M4[]): vc.V3[][] {
	return duplicateVerts(verts, map_mm4(m4));
}

/** 写像配列を用いたジオメトリ複製 */
export function duplicateGeo(g: Geo, maps: Array<(v: vc.V3) => vc.V3>): Geo[] {
	const verts = g.verts();
	const faces = g.faces();
	return maps.map(m => geo(verts.map(m), faces));
}
/** アフィン写像配列を用いたジオメトリ複製 */
export function duplicateGeoAffine(g: Geo, m4: mx.M4[]): Geo[] {
	return duplicateGeo(g, map_mm4(m4));
}
/** 写像配列を用いたジオメトリグループ複製 */
export function duplicateGeoGroup(gg: GeoGroup, maps: Array<(v: vc.V3) => vc.V3>): GeoGroup {
	const gg2 = gg.geos()
		.map(g => duplicateGeo(g, maps))
		.reduce((a, b) => a.concat(b), <GeoGroup[]>[]);
	return geoGroup(gg.name(), gg2);
}
/** アフィン写像配列を用いたジオメトリグループ複製 */
export function duplicateGeoGroupAffine(gg: GeoGroup, m4: mx.M4[]): GeoGroup {
	return duplicateGeoGroup(gg, map_mm4(m4));
}
/** 写像配列を用いたジオメトリ辞書複製 */
export function duplicateGeoDict(gd: GeoDict, maps: Array<(v: vc.V3) => vc.V3>): GeoDict {
	const gg2 = gd.geogroups()
		.map(gg => duplicateGeoGroup(gg, maps))
		.reduce((a, b) => a.concat(b), <GeoGroup[]>[]);
	return geoDict(gg2);
}
/** アフィン写像配列を用いたジオメトリ辞書複製 */
export function duplicateGeoDictAffine(gd: GeoDict, m4: mx.M4[]): GeoDict {
	return duplicateGeoDict(gd, map_mm4(m4));
}

/** 任意のデータ配列を用いた合成写像の生成 */
export function compositeMap<T>(data: T[], lambdas: Array<(d: T) => mx.M4>): mx.M4[] {
	return data.map(d => lambdas.reduce((m, lambda) => lambda(d).mul(m), mx.unit_m4));
}

