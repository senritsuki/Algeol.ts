import * as vc from "./math/vector";
import * as mx from "./math/matrix";
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
export declare function geo(verts: vc.V3[], faces: number[][]): Geo;
export declare function geoGroup(name: string, geos: Geo[]): GeoGroup;
export interface ObjBase {
    arrayOXYZ(): vc.V3[];
    o(): vc.V3;
    x(): vc.V3;
    y(): vc.V3;
    z(): vc.V3;
    m4(): mx.M4;
}
export declare const oxyz_default: ObjBase;
export interface Obj {
    duplicate(lim: (v: vc.V3) => vc.V3[]): Obj[];
    geo(): Geo;
}
export interface Basis3 {
    array(): vc.V3[];
    x(): vc.V3;
    y(): vc.V3;
    z(): vc.V3;
    m4(): mx.M4;
}
export declare function basis3(x: vc.V3, y: vc.V3, z: vc.V3): Basis3;
export declare function ar_basis3(vl: vc.V3[]): Basis3;
export declare const default_basis3: Basis3;
export interface Space {
    array(): vc.V3[];
    c(): vc.V3;
    d(): Basis3;
    m4(): mx.M4;
}
export declare function space(c: vc.V3, d: Basis3): Space;
export declare function ar_space(vl: vc.V3[]): Space;
export declare const default_space: Space;
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
export declare function _obj(name: string, verts: vc.V3[], geo: (name: string, verts: vc.V3[]) => Geo): _Obj;
export interface LimObj {
    obj(): _Obj;
    lims(): seqlim.SeqLim[];
    geo(): Geo[];
}
export declare function limobj(obj: _Obj, lims: seqlim.SeqLim[]): LimObj;
export interface Curve {
    coord(t: number): vc._Vector3;
    space(t: number, d: number): Space;
    seqCoord(start: number, step: number, count: number): vc._Vector3[];
    seqSpace(start: number, step: number, count: number): Space[];
}
