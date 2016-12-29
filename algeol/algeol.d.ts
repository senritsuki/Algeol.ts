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
    dict(): {
        [name: string]: GeoGroup;
    };
    /** () -> ジオメトリ */
    geogroups(): GeoGroup[];
    /** 複製 */
    clone(lambda: (v: vc.V3) => vc.V3): GeoDict;
}
/** (頂点(3次元ベクトル)の配列, 面(頂点インデックス配列)の配列) -> ジオメトリ */
export declare function geo(verts: vc.V3[], faces: number[][]): Geo;
/** (グループ名, ジオメトリの配列) -> ジオメトリグループ */
export declare function geoGroup(name: string, geos: Geo[]): GeoGroup;
/** (ジオメトリグループの配列) -> ジオメトリグループ辞書 */
export declare function geoDict(geogroups: GeoGroup[]): GeoDict;
/** (ジオメトリグループ辞書の配列) -> ジオメトリグループ辞書 */
export declare function merge_geoDict(geodicts: GeoDict[]): GeoDict;
/** 写像配列を用いた3次元ベクトル配列複製 */
export declare function duplicateVerts(verts: vc.V3[], maps: Array<(v: vc.V3) => vc.V3>): vc.V3[][];
/** アフィン写像配列を用いた3次元ベクトル配列複製 */
export declare function duplicateVertsAffine(verts: vc.V3[], m4: mx.M4[]): vc.V3[][];
/** 写像配列を用いたジオメトリ複製 */
export declare function duplicateGeo(g: Geo, maps: Array<(v: vc.V3) => vc.V3>): Geo[];
/** アフィン写像配列を用いたジオメトリ複製 */
export declare function duplicateGeoAffine(g: Geo, m4: mx.M4[]): Geo[];
/** 写像配列を用いたジオメトリグループ複製 */
export declare function duplicateGeoGroup(gg: GeoGroup, maps: Array<(v: vc.V3) => vc.V3>): GeoGroup;
/** アフィン写像配列を用いたジオメトリグループ複製 */
export declare function duplicateGeoGroupAffine(gg: GeoGroup, m4: mx.M4[]): GeoGroup;
/** 写像配列を用いたジオメトリ辞書複製 */
export declare function duplicateGeoDict(gd: GeoDict, maps: Array<(v: vc.V3) => vc.V3>): GeoDict;
/** アフィン写像配列を用いたジオメトリ辞書複製 */
export declare function duplicateGeoDictAffine(gd: GeoDict, m4: mx.M4[]): GeoDict;
/** 任意のデータ配列を用いた合成写像の生成 */
export declare function compositeMap<T>(data: T[], lambdas: Array<(d: T) => mx.M4>): mx.M4[];
