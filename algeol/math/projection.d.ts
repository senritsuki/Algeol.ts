import * as vc from "../math/vector";
import * as mx from "../math/matrix";
export interface Projection {
    projection(dist: vc.V3): vc.V3;
}
/** Parallel Projection - 平行投影 */
export declare function parallel(m: mx.M4, scale: number): Projection;
/** Perspective Projection - 透視投影 */
export declare function perspective(m: mx.M4, scale: number, tan: number, near?: number): Projection;
/** x軸方向のプロジェクタをxy平面、奥行きzに変換 */
export declare function viewport_x(): mx.M3;
