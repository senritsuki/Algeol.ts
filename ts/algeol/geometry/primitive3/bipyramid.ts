/**
 * Bipyramid - 双角錐
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as sq from '../../algorithm/sequence';
import * as vc from '../../datatype/vector';
import * as circle from './circle';

/** (底面の頂点数, 底面の外接円の半径, 高さ, 深さ) -> 双角錐の頂点の配列 */
export function verts_i(n_gonal: number, r: number, h1: number, h2: number): vc.V3[] {
    const verts: vc.V3[] = [];
    circle.verts_i(n_gonal, r, 0, 0).forEach(v => verts.push(v)); // 底面
    verts.push(vc.v3(0, 0, h1)); // 頭頂点
    verts.push(vc.v3(0, 0, h2)); // 頭頂点の逆
    return verts;
}
/** (底面の頂点数, 底面の内接円の半径, 高さ, 深さ) -> 双角錐の頂点の配列 */
export function verts_c(n_gonal: number, r: number, z1: number, z2: number): vc.V3[] {
    const verts: vc.V3[] = [];
    circle.verts_c(n_gonal, r, 0, 0).forEach(v => verts.push(v)); // 底面
    verts.push(vc.v3(0, 0, z1)); // 頭頂点
    verts.push(vc.v3(0, 0, z2)); // 頭頂点の逆
    return verts;
}

export function faces(n_gonal: number): number[][] {
    const faces: number[][] = [];
    const n1 = n_gonal * 2;
    const n2 = n_gonal * 2 + 1;
    // 上側面
    sq.arithmetic(n_gonal)
        .map(i => [n1, i, (i + 1) % n_gonal])
        .forEach(v => faces.push(v));
    // 下側面
    sq.arithmetic(n_gonal)
        .map(i => [n2, (i + 1) % n_gonal, i])
        .forEach(v => faces.push(v));
    return faces;
}
