/**
 * Pyramid - 角錐
 */

import * as sq from '../../algorithm/sequence';
import * as vc from '../../datatype/vector';
import * as circle from './circle';

/** (底面の頂点数, 底面の外接円の半径, 高さ) -> 角錐の頂点の配列 */
export function verts_i(n_gonal: number, r: number, h: number): vc.V3[] {
    // 底面
    const verts = circle.verts_i(n_gonal, r, 0, 0);
    // 頭頂点
    verts.push(vc.v3(0, 0, h));
    return verts;
}
/** (底面の頂点数, 底面の内接円の半径, 高さ) -> 角錐の頂点の配列 */
export function verts_c(n_gonal: number, r: number, h: number): vc.V3[] {
    // 底面
    const verts = circle.verts_c(n_gonal, r, 0, 0);
    // 頭頂点
    verts.push(vc.v3(0, 0, h));
    return verts;
}

export function faces_side(n_gonal: number, index_top: number = n_gonal): number[][] {
    return sq.arithmetic(n_gonal)
        .map(i => [i, (i + 1) % n_gonal])
        .map(v => [v[0], v[1], index_top]);
}

/** (底面の頂点数) -> 角錐の面の配列 */
export function faces(n_gonal: number): number[][] {
    // 側面
    const faces = faces_side(n_gonal);
    // 底面
    faces.push(sq.arithmetic(n_gonal));
    return faces;
}
