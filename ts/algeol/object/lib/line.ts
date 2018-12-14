/**
 * 線
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../datatype/vector';
import * as mx from '../../datatype/matrix';
import * as prim_cube from '../../geometry/primitive3/cube';
import * as prim_octahedron from '../../geometry/primitive3/octahedron';
import * as obj from '../object';

export function make_transform(
    v1: vc.V3,
    d: vc.V3,
    rx: number,
    ry: number,
): mx.M4 {
    return mx.mulAllRev([
        mx.m4_translate3([0, 0, 0.5]),
        mx.m4_scale3([rx, ry, d.length()]),
        mx.m4_rotate_from_001_to_v(d),
        mx.m4_translate3(v1),
    ]);
}

export function generate_new_verts(
    verts: vc.V3[],
    v1: vc.V3,
    v2: vc.V3,
    rx: number,
    ry: number,
): vc.V3[] {
    const d = v2.sub(v1);
    const transform = make_transform(v1, d, rx, ry);
    const new_verts = mx.apply_affine3(transform, verts, 1);
    return new_verts;
}

export function cube(
    v1: vc.V3,
    v2: vc.V3,
    rx: number,
    ry: number,
): obj.VF {
    const verts = prim_cube.verts(0.5);
    const faces = prim_cube.faces();
    const new_verts = generate_new_verts(verts, v1, v2, rx, ry);
    return {
        verts: new_verts,
        faces: faces,
    };
}

export function octahedron(
    v1: vc.V3,
    v2: vc.V3,
    rx: number,
    ry: number,
): obj.VF {
    const verts = prim_octahedron.verts(0.5);
    const faces = prim_octahedron.faces();
    const new_verts = generate_new_verts(verts, v1, v2, rx, ry);
    return {
        verts: new_verts,
        faces: faces,
    };
}
