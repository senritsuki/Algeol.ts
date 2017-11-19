/** Geometry */

import * as ut from "../algorithm/utility";
import * as vc from "../algorithm/vector";
import * as mx from "../algorithm/matrix";
//import * as col from "./math/color";

namespace col {
    export interface NamedColor{
        name(): any;
        color(): any;
    }
}

export interface GeoBase<T extends GeoBase<T>> {
    /** () -> 頂点座標の配列 */
    verts(): vc.V3[];
    /** () -> ポリゴン面を表す頂点インデックス配列の配列 */
    faces(): number[][];
    /** 複製 */
    clone(lambda: (v: vc.V3) => vc.V3): T;
}

/** Geometry Unit - ジオメトリユニット */
export interface GeoUnit extends GeoBase<GeoUnit> {
}

/** Geometry - ジオメトリ */
export interface Geo extends GeoBase<Geo> {
    /** () -> ジオメトリ名 */
    name(): string;
    /** () -> ユニット */
    units(): GeoUnit[];
    /** () -> 色を取得（default:null） */
    getColor(): col.NamedColor|null;
    /** () -> 色を設定 */
    setColor(color: col.NamedColor|null): void;
}

/** ジオメトリグループの辞書 */
export interface GeoDict extends GeoBase<GeoDict> {
    /** () -> 辞書 */
    dict(): { [name: string]: Geo };
    /** () -> ジオメトリ */
    geogroups(): Geo[];
}


namespace priv {
    export class GeoImpl implements GeoUnit {
        constructor(
            public _verts: vc.V3[],
            public _faces: number[][]) { }

        verts(): vc.V3[] {
            return this._verts;
        }
        faces(): number[][] {
            return this._faces;
        }
        clone(lambda: (v: vc.V3) => vc.V3): GeoUnit {
            return new GeoImpl(this._verts.map(lambda), this._faces);
        }
    }

    export class GeoGroupImpl implements Geo {
        constructor(
            public _name: string,
            public _geos: GeoUnit[],
            public _color: col.NamedColor|null = null,
            ) { }

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
        units(): GeoUnit[] {
            return this._geos;
        }
        clone(lambda: (v: vc.V3) => vc.V3): Geo {
            return new GeoGroupImpl(this._name, this._geos.map(g => g.clone(lambda)));
        }
        getColor(): col.NamedColor|null {
            return this._color;
        }
        setColor(color: col.NamedColor|null): void {
            this._color = color;
        }
    }

    export class GeoDictImpl implements GeoDict {
        _names: string[] = [];
        _dict: { [name: string]: Geo } = {};

        constructor(geogroups: Geo[]) {
            geogroups.forEach(geogroup => {
                const name = geogroup.name();
                if (this._dict[name] == undefined) {
                    this._dict[name] = geogroup;
                    this._names.push(name);
                } else {
                    this._dict[name] = new GeoGroupImpl(name, this._dict[name].units().concat(geogroup.units()));
                }
            });
        }

        static Merge(geodicts: GeoDict[]): GeoDictImpl {
            return new GeoDictImpl(geodicts.reduce((geogroups, geodict) => geogroups.concat(geodict.geogroups()), <Geo[]>[]));
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
        dict(): { [name: string]: Geo } {
            return this._dict;
        }
        geogroups(): Geo[] {
            return this._names.map(name => this._dict[name]);
        }
        clone(lambda: (v: vc.V3) => vc.V3): GeoDict {
            return new GeoDictImpl(this.geogroups().map(geogroup => geogroup.clone(lambda)));
        }
    }

    export const map_mm4 = (mm: mx.M4[]) => mm.map(m => (v: vc.V3) => m.map_v3(v, 1));
}

/** (頂点(3次元ベクトル)の配列, 面(頂点インデックス配列)の配列) -> ジオメトリ */
export function geoUnit(verts: vc.V3[], faces: number[][]): GeoUnit {
    return new priv.GeoImpl(verts, faces);
}
/** (グループ名, ジオメトリの配列) -> ジオメトリグループ */
export function geo(name: string, units: GeoUnit[]): Geo {
    return new priv.GeoGroupImpl(name, units);
}
/** (グループ名, ジオメトリの配列, ジオメトリの色) -> ジオメトリグループ */
export function coloredGeo(name: string, units: GeoUnit[], color: col.NamedColor): Geo {
    return new priv.GeoGroupImpl(name, units, color);
}
/** (ジオメトリグループの配列) -> ジオメトリグループ辞書 */
export function geoDict(geogroups: Geo[]): GeoDict {
    return new priv.GeoDictImpl(geogroups);
}


/** (ジオメトリグループ辞書の配列) -> ジオメトリグループ辞書 */
export function mergeGeoDict(geodicts: GeoDict[]): GeoDict {
    return priv.GeoDictImpl.Merge(geodicts);
}

export function applyColors(geos: Geo[], colors: col.NamedColor[]): void {
    const iMax = ut.min(geos.length, colors.length);
    for (let i = 0; i < iMax; i++) {
        geos[i].setColor(colors[i]);
    }
}


/** 写像配列を用いた3次元ベクトル配列複製 */
export function duplicateVerts(verts: vc.V3[], maps: Array<(v: vc.V3) => vc.V3>): vc.V3[][] {
    return maps.map(m => verts.map(m));
}
/** アフィン写像配列を用いた3次元ベクトル配列複製 */
export function duplicateVertsAffine(verts: vc.V3[], m4: mx.M4[]): vc.V3[][] {
    return duplicateVerts(verts, priv.map_mm4(m4));
}

/** 写像配列を用いたジオメトリ複製 */
export function duplicateGeoUnit(g: GeoUnit, maps: Array<(v: vc.V3) => vc.V3>): GeoUnit[] {
    const verts = g.verts();
    const faces = g.faces();
    return maps.map(m => geoUnit(verts.map(m), faces));
}
/** 写像配列を用いたジオメトリグループ複製 */
export function duplicateGeo(gg: Geo, maps: Array<(v: vc.V3) => vc.V3>): Geo {
    const gg2 = gg.units()
        .map(g => duplicateGeoUnit(g, maps))
        .reduce((a, b) => a.concat(b), <Geo[]>[]);
    return geo(gg.name(), gg2);
}
/** 写像配列を用いたジオメトリ辞書複製 */
export function duplicateGeoDict(gd: GeoDict, maps: Array<(v: vc.V3) => vc.V3>): GeoDict {
    const gg2 = gd.geogroups()
        .map(gg => duplicateGeo(gg, maps))
        .reduce((a, b) => a.concat(b), <Geo[]>[]);
    return geoDict(gg2);
}

export const affines_to_maps = (m4: mx.M4[]): Array<(v: vc.V3) => vc.V3> => priv.map_mm4(m4);

/** 任意のデータ配列を用いた合成写像の生成 */
export function compositeMap<T>(data: T[], lambdas: Array<(d: T) => mx.M4>): mx.M4[] {
    return data.map(d => lambdas.reduce((m, lambda) => lambda(d).mul(m), mx.unit_m4));
}

