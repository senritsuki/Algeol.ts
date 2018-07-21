import * as sq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';

/**
 * 円弧
 * @param n             円弧を近似する辺の数
 * @param r             円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
export function arc_verts(n: number, r: number, rad1: number, rad2: number): vc.V2[] {
    return ellipse_arc_verts(n, vc.v2(r, r), rad1, rad2);
}
/**
 * 楕円弧
 * @param n             円弧を近似する辺の数
 * @param r             円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
export function ellipse_arc_verts(n: number, r: vc.V2, rad1: number, rad2: number): vc.V2[] {
    //const step = n >= 2 ? (rad2 - rad1) / (n - 1) : 0;
    //return sq.arithmetic(n + 1, rad1, step).map(t => vc.polar_to_v2(1, t).el_mul(r));
    return sq.range(rad1, rad2, n + 1, false).map(t => vc.polar_to_v2(1, t).el_mul(r));
}
