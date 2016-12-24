/** Scalable Vector Graphics .svg */
import * as vc from "../math/vector";
import * as cv from "../math/curve2";
/** (内部要素, svg幅, svg高さ, viewbox幅, viewbox高さ) -> <svg> */
export declare function svg(inner: string, width: number, height: number, viewbox_width: number, viewbox_height: number): string;
/** (直線) -> <line> */
export declare function curve_line(line: cv.Curve, stroke: string, strokeWidth: number): string;
/** (連続直線) -> <path> */
export declare function curveArray_path(lines: cv.CurveArray, fill: string, stroke: string, strokeWidth: number, z: boolean): string;
/** (3次元ベクトル(x=cx, y=cy, z=r)) -> <circle> */
export declare function v_circle(v: vc.V3): string;
