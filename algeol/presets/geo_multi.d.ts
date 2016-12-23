/** 複合オブジェクト */
import * as al from "../algeol";
import * as vc from "../math/vector";
/** 連続角柱 */
export declare function prismArray(polygons: vc.V3[][]): al.Geo;
/** 連続反角柱 */
export declare function antiprismArray(polygons: vc.V3[][]): al.Geo;
/** 連続角柱 + 上に角錐 */
export declare function prismArray_pyramid(polygons: vc.V3[][], v1: vc.V3): al.Geo;
/** 連続反角柱 + 上に角錐 */
export declare function antiprismArray_pyramid(polygons: vc.V3[][], v1: vc.V3): al.Geo;
/** 連続角柱 + 上下に角錐 */
export declare function prismArray_bipyramid(polygons: vc.V3[][], v1: vc.V3, v2: vc.V3): al.Geo;
/** 連続反角柱 + 上下に角錐 */
export declare function antiprismArray_bipyramid(polygons: vc.V3[][], v1: vc.V3, v2: vc.V3): al.Geo;
/** 角柱の輪 */
export declare function prismRing(polygons: vc.V3[][]): al.Geo;
/** 反角柱の輪 */
export declare function antiprismRing(polygons: vc.V3[][]): al.Geo;
/** 押し出し */
export declare function extrude(polygon: vc.V3[], v1: vc.V3, v2: vc.V3): al.Geo;
