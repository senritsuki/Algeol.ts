/**
 * Prism - 角柱
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../../common';
import * as vc from '../../datatype/vector';
import * as sq from '../../algorithm/sequence';
import * as gut from '../utility';
import * as circle from './circle';

function verts_common(n_gonal: number, r: number, rad: number, h: number, fn: (n: number, r: number, rad: number, h: number) => vc.V3[]): vc.V3[] {
    const verts1 = fn(n_gonal, r, rad, 0); // 底面
    const verts2 = fn(n_gonal, r, rad, h); // 上面
    return verts1.concat(verts2);
}

export function verts(n_gonal: number, r: number, h: number, outside_circle: boolean = false): vc.V3[] {
    return outside_circle ? verts_c(n_gonal, r, h) : verts_i(n_gonal, r, h);
}

/** (底面の頂点数, 底面の外接円の半径, 高さ) -> 角柱の頂点の配列 */
export function verts_i(n_gonal: number, r: number, h: number): vc.V3[] {
    return verts_common(n_gonal, r, 0, h, circle.verts_i);
}
/** (底面の頂点数, 底面の内接円の半径, 高さ) -> 角柱の頂点の配列 */
export function verts_c(n_gonal: number, r: number, h: number): vc.V3[] {
    return verts_common(n_gonal, r, ut.deg180 / n_gonal, h, circle.verts_c);
}

export function faces_top(n_gonal: number): number[][] {
    return [
        sq.arithmetic(n_gonal),
    ];
}
export function faces_bottom(n_gonal: number): number[][] {
    return [
        sq.arithmetic(n_gonal).map(i => i + n_gonal),
    ];
}

export function faces_side(n_gonal: number): number[][] {
    return sq.arithmetic(n_gonal)
        .map(i => [i, (i + 1) % n_gonal])
        .map(v => [v[0], v[1], v[1] + n_gonal, v[0] + n_gonal]);
}

export function faces(n_gonal: number): number[][] {
    return faces_side(n_gonal)
        .concat(faces_top(n_gonal))
        .concat(faces_bottom(n_gonal));
}

export function vf(n_gonal: number, r: number, h: number, outside_circle: boolean = false): gut.VF<vc.V3> {
    return {
        verts: verts(n_gonal, r, h, outside_circle),
        faces: faces(n_gonal),
    }
}
