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
    dict(): {
        [name: string]: GeoGroup;
    };
    /** () -> ジオメトリ */
    geogroups(): GeoGroup[];
    /** 複製 */
    duplicate(lambda: (geo: Geo) => Geo[]): GeoDict;
}
/** (頂点(3次元ベクトル)の配列, 面(頂点インデックス配列)の配列) -> ジオメトリ */
export declare function geo(verts: vc.V3[], faces: number[][]): Geo;
/** (グループ名, ジオメトリの配列) -> ジオメトリグループ */
export declare function geoGroup(name: string, geos: Geo[]): GeoGroup;
/** (ジオメトリグループの配列) -> ジオメトリグループ辞書 */
export declare function geoDict(geogroups: GeoGroup[]): GeoDict;
/** (ジオメトリグループ辞書の配列) -> ジオメトリグループ辞書 */
export declare function merge_geoDict(geodicts: GeoDict[]): GeoDict;
/** アフィン写像によるジオメトリ複製 */
export declare function duplicateGeoWithAffine(g: Geo, m4: mx.M4[]): Geo[];
/** 3次元→3次元のラムダ関数によるジオメトリ複製 */
export declare function duplicateGeoWithLambda(g: Geo, map: (v: vc.V3) => vc.V3[]): Geo[];
/** データ配列を併用したアフィン写像の合成 */
export declare function compositeAffineWithDataArray<T>(data: T[], lambdas: Array<(d: T) => mx.M4>): mx.M4[];
