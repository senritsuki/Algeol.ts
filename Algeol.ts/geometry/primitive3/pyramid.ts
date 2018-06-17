/**
 * Pyramid - 角錐
 */

import * as sq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';
import * as circle from './circle';

/** (底面の頂点数, 底面の外接円の半径, 高さ) -> 角錐の頂点の配列 */
export function verts_i(n_gonal: number, r: number, h: number): vc.V3[] {
    const verts: vc.V3[] = [];
    verts.push(vc.v3(0, 0, h)); // // 頭頂点
    circle.verts_i(n_gonal, r, 0, 0).forEach(v => verts.push(v)); // 底面
    return verts;
}
/** (底面の頂点数, 底面の内接円の半径, 高さ) -> 角錐の頂点の配列 */
export function verts_c(n_gonal: number, r: number, h: number): vc.V3[] {
    const verts: vc.V3[] = [];
    verts.push(vc.v3(0, 0, h)); // // 頭頂点
    circle.verts_c(n_gonal, r, 0, 0).forEach(v => verts.push(v)); // 底面
    return verts;
}
/** (底面の頂点数) -> 角錐の面の配列 */
export function faces(n_gonal: number): number[][] {
    const faces: number[][] = [];
    // 側面
    sq.arithmetic(n_gonal)
        .map(i => [0, i + 1, (i + 1) % n_gonal + 1])
        .forEach(v => faces.push(v));
    // 底面
    faces.push(sq.arithmetic(n_gonal).map(i => i + 1));
    return faces;
}
