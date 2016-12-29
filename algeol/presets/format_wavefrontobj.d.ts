/** Wavefront .obj */
import * as al from "../algeol";
import * as vc from "../math/vector";
/** 頂点vを文字列化する方法
    デフォルトでは3次元ベクトルを x z -y と並べていますが、変えたい場合は上書きしてください */
export declare let _vert_str: (v: vc.V3) => string;
/** 面fを文字列化する方法 */
export declare let _face_str: (f: number[], offset: number) => string;
/** ジオメトリを文字列化 */
export declare function geo_str(geo: al.GeoRoot, offset?: number): string;
/** ジオメトリ配列を文字列化 */
export declare function geoArray_str(geoArray: al.GeoRoot[], offset?: number): string;
/** ジオメトリグループを文字列化 */
export declare function geoGroup_str(geoGroup: al.GeoGroup, offset?: number): string;
/** ジオメトリグループ配列を文字列化 */
export declare function geoGroupArray_str(geoGroupArray: al.GeoGroup[], offset?: number): string;
/** ジオメトリ辞書を文字列化 */
export declare function geoDict_str(geoDict: al.GeoDict, offset?: number): string;
