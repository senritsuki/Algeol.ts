/**
 * Prism - 角柱
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as sq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';
import * as circle from './circle';

function verts(n_gonal: number, r: number, h: number, fn: (n: number, r: number, rad: number, h: number) => vc.V3[]): vc.V3[] {
    const verts1 = fn(n_gonal, r, 0, 0); // 底面
    const verts2 = fn(n_gonal, r, 0, h); // 上面
    return verts1.concat(verts2);
}

/** (底面の頂点数, 底面の外接円の半径, 高さ) -> 角柱の頂点の配列 */
export function verts_i(n_gonal: number, r: number, h: number): vc.V3[] {
    return verts(n_gonal, r, h, circle.verts_i);
}
/** (底面の頂点数, 底面の内接円の半径, 高さ) -> 角柱の頂点の配列 */
export function verts_c(n_gonal: number, r: number, h: number): vc.V3[] {
    return verts(n_gonal, r, h, circle.verts_c);
}

export function faces_side(n_gonal: number): number[][] {
    return sq.arithmetic(n_gonal)
        .map(i => [i, (i + 1) % n_gonal])
        .map(v => [v[0], v[1], v[1] + n_gonal, v[0] + n_gonal]);
}

export function faces(n_gonal: number): number[][] {
    // 側面
    const faces = faces_side(n_gonal);
    // 上面と底面
    faces.push(sq.arithmetic(n_gonal));
    faces.push(sq.arithmetic(n_gonal).map(i => i + n_gonal));
    return faces;
}
