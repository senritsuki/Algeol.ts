/**
 * Triangular Prism Array - 三角柱の列
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../datatype/vector';
import * as sq from '../../algorithm/sequence';
import * as gut from '../utility';

export function verts(vv: (vc.V2|number[])[], h: number): vc.V3[] {
    const vv1: vc.V2[] = vv.map(v => vc.to_v2_if_not(v));
    const vv2 = [vc.v2_zero].concat(vv1);
    const verts1 = vv2.map(v => vc.v3(v.x, v.y, 0)); // 底面
    const verts2 = vv2.map(v => vc.v3(v.x, v.y, h)); // 上面
    return verts1.concat(verts2);
}

const n_gonal = 3;

function faces_tb(vv: (vc.V2|number[])[], closed: boolean, offset: number): number[][] {
    const count = vv.length - 1;
    const faces = sq.arithmetic(count).map(i => [offset, offset + i + 1, offset + i + 2]);
    if (closed) {
        faces.push([offset, offset + count + 1, offset + 1]);
    }
    return faces;
}
export function faces_top(vv: (vc.V2|number[])[], closed: boolean): number[][] {
    return faces_tb(vv, closed, 0);
}
export function faces_bottom(vv: (vc.V2|number[])[], closed: boolean): number[][] {
    return faces_tb(vv, closed, vv.length + 1);
}
export function faces_side(vv: (vc.V2|number[])[], closed: boolean): number[][] {
    const count = vv.length - 1;
    const offset = vv.length + 1;
    const faces = sq.arithmetic(count)
        .map(i => [i + 1, i + 2])
        .map(v => [v[0], v[1], v[1] + offset, v[0] + offset]);
    if (closed) {
        faces.push([count + 1, 1, offset + 1, offset + count + 1]);
    }
    return faces;
}
export function faces(vv: (vc.V2|number[])[], closed: boolean): number[][] {
    return faces_side(vv, closed)
        .concat(faces_top(vv, closed))
        .concat(faces_bottom(vv, closed));
}

export function vf(vv: (vc.V2|number[])[], h: number, closed: boolean): gut.VF<vc.V3> {
    return {
        verts: verts(vv, h),
        faces: faces(vv, closed),
    }
}
