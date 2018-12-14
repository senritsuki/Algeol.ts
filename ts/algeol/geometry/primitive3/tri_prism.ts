/**
 * Triangular Prism - 三角柱
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../datatype/vector';
import * as sq from '../../algorithm/sequence';
import * as gut from '../utility';

export function verts(v1: vc.V2|number[], v2: vc.V2|number[], h: number): vc.V3[] {
    const verts: vc.V2[] = [vc.v2_zero, vc.to_v2_if_not(v1), vc.to_v2_if_not(v2)];
    const verts1 = verts.map(v => vc.v3(v.x, v.y, 0)); // 底面
    const verts2 = verts.map(v => vc.v3(v.x, v.y, h)); // 上面
    return verts1.concat(verts2);
}

const n_gonal = 3;

export function faces_top(): number[][] {
    return [
        sq.arithmetic(n_gonal),
    ];
}
export function faces_bottom(): number[][] {
    return [
        sq.arithmetic(n_gonal).map(i => i + n_gonal),
    ];
}
export function faces_side(): number[][] {
    return sq.arithmetic(n_gonal)
        .map(i => [i, (i + 1) % n_gonal])
        .map(v => [v[0], v[1], v[1] + n_gonal, v[0] + n_gonal]);
}
export function faces(): number[][] {
    return faces_side()
        .concat(faces_top())
        .concat(faces_bottom());
}

export function vf(v1: vc.V2|number[], v2: vc.V2|number[], h: number): gut.VF<vc.V3> {
    return {
        verts: verts(v1, v2, h),
        faces: faces(),
    }
}
