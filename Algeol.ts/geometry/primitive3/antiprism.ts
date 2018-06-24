/**
 * Antiprism - 反角柱
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../../algorithm/utility';
import * as sq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';
import * as circle from './circle';


/** (底面の頂点数, 底面の外接円の半径, 高さ) -> 角柱の頂点の配列 */
export function verts_i(n_gonal: number, r: number, h: number): vc.V3[] {
    const rad1 = 0;
    const rad2 = ut.deg360 / (n_gonal * 2);
    const verts1 = circle.verts_i(n_gonal, r, rad1, 0); // 底面
    const verts2 = circle.verts_i(n_gonal, r, rad2, h); // 上面
    return verts1.concat(verts2);
}

export function faces(n_gonal: number): number[][] {
    const faces: number[][] = [];
    const pairs = sq.arithmetic(n_gonal).map(i => [i, (i + 1) % n_gonal]);
    // 側面△
    pairs.map(v => [v[0], v[1], v[0] + n_gonal])
        .forEach(v => faces.push(v));
    // 側面▽
    pairs.map(v => [v[1] + n_gonal, v[0] + n_gonal, v[1]])
        .forEach(v => faces.push(v));
    // 上面と底面
    faces.push(sq.arithmetic(n_gonal));
    faces.push(sq.arithmetic(n_gonal).map(i => i + n_gonal));
    return faces;
}
