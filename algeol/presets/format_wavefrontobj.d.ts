/** Wavefront .obj */
import * as al from "../algeo";
import * as vc from "../math/vector";
/** 頂点vを文字列化する方法
    デフォルトでは3次元ベクトルを x z -y と並べていますが、変えたい場合は上書きしてください */
export declare let _vert_str: (v: vc.V3) => string;
/** 面fを文字列化する方法 */
export declare let _face_str: (f: number[], offset: number) => string;
/** ジオメトリを文字列化 */
export declare function geo_str(geo: al.GeoRoot, offset?: number): string;
/** ジオメトリ配列を文字列化 */
export declare function geoarray_str(geoarray: al.GeoRoot[], offset?: number): string;
/** ジオメトリグループを文字列化 */
export declare function geogroup_str(geogroup: al.GeoGroup, offset?: number): string;
/** ジオメトリグループ配列を文字列化 */
export declare function geogrouparray_str(geogrouparray: al.GeoGroup[], offset?: number): string;
