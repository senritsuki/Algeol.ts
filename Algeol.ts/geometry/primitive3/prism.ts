/**
 * Prism - 角柱
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as sq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';
import * as circle from './circle';


/** (底面の頂点数, 底面の外接円の半径, 高さ) -> 角柱の頂点の配列 */
export function verts_i(n_gonal: number, r: number, h: number): vc.V3[] {
    const verts: vc.V3[] = [];
    circle.verts_i(n_gonal, r, 0, h).forEach(v => verts.push(v)); // 上面
    circle.verts_i(n_gonal, r, 0, 0).forEach(v => verts.push(v)); // 底面
    return verts;
}
/** (底面の頂点数, 底面の内接円の半径, 高さ) -> 角柱の頂点の配列 */
export function verts_c(n_gonal: number, r: number, h: number): vc.V3[] {
    const verts: vc.V3[] = [];
    circle.verts_c(n_gonal, r, 0, h).forEach(v => verts.push(v)); // 上面
    circle.verts_c(n_gonal, r, 0, 0).forEach(v => verts.push(v)); // 底面
    return verts;
}
export function faces(n_gonal: number): number[][] {
    const faces: number[][] = [];
    // 側面
    sq.arithmetic(n_gonal)
        .map(i => [i, (i + 1) % n_gonal])
        .map(v => [v[0], v[0] + n_gonal, v[1] + n_gonal, v[1]])
        .forEach(v => faces.push(v));
    // 上面と底面
    faces.push(sq.arithmetic(n_gonal));
    faces.push(sq.arithmetic(n_gonal).map(i => i + n_gonal));
    return faces;
}
