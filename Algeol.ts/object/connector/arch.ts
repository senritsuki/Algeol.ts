/**
 * アーチ
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../../algorithm/utility';
import * as sq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';
import * as vsq from '../../algorithm/vector_sequence';
import * as prism from '../../geometry/primitive3/prism';
import * as obj from '../object';

export enum ThickType {
    Inner,
    Outer,
    Both,
}

function apply_thickness(v: vc.V3, thickness: number, type: ThickType): [vc.V3, vc.V3] {
    switch (type) {
        case ThickType.Inner:
            return [v.length_sub(thickness), v];
        case ThickType.Outer:
            return [v, v.length_add(thickness)];
        case ThickType.Both:
            return [v.length_sub(thickness), v.length_add(thickness)];
    }
}

export function arc180_verts(o: vc.V3, dx: vc.V3, dy: vc.V3, division: number): vc.V3[] {
    return vsq.arc_range(o, dx, dy, 0, ut.deg180, division);
}

export function base_arc_faces(length: number): number[][] {
    return sq.arithmetic(length / 2 - 1)
        .map(i => [i, length-i-1, length-i-2, i+1]);
}

export function base_arc180(
    v1: vc.V3, 
    v2: vc.V3, 
    height: number|null, 
    thickness: number, 
    thick_type: ThickType, 
    division: number,
): obj.VF {
    const v3 = v1.add(v2).scalar(0.5);
    const dx = v1.sub(v3);
    const r = dx.length();
    const dy = vc.v3(0, 0, r);
    const o = v3.add([0, 0, height ? height - r : 0]);
    const dx2 = apply_thickness(dx, thickness, thick_type);
    const dy2 = apply_thickness(dy, thickness, thick_type);
    const sq_inner = arc180_verts(o, dx2[0], dy2[0], division);
    const sq_outer = arc180_verts(o, dx2[1].scalar(-1), dy2[1], division);
    const sq_base1 = height ? [sq_outer[sq_outer.length-1], sq_inner[0]] : [];
    const sq_base2 = height ? [sq_inner[sq_inner.length-1], sq_outer[0]] : [];
    const verts = sq_base1.concat(sq_inner).concat(sq_base2).concat(sq_outer);
    const faces = base_arc_faces(verts.length);
    return {verts, faces};
}

export function base_wall180(
    v1: vc.V3, 
    v2: vc.V3, 
    height: number, 
    thickness: number, 
    division: number,
): obj.VF {
    const o = v1.add(v2).scalar(0.5);
    const dx = v1.sub(o).length_sub(thickness);
    const dy = vc.v3(0, 0, dx.length());
    const sq_inner = arc180_verts(o, dx, dy, division);
    const outer1 = o.add(dx);
    const outer2 = o.sub(dy);
    const dh = vc.v3(0, 0, height);
    const sq_outer = [outer2, outer2.add(dh), outer1.add(dh), outer1];
    const verts = sq_inner.concat(sq_outer);
    const faces = [verts.map((_, i) => i)];
    return {verts, faces};
}

export function arch(
    v1: vc.V3, 
    v2: vc.V3, 
    base: obj.VF, 
    width: number,
): obj.VF {
    const d = v2.sub(v1);
    const dw = vc.v3(d.y, -d.x, 0).unit().scalar(width);
    const dw2 = dw.scalar(0.5);
    const verts2 = base.verts.map(v => v.sub(dw2));
    const faces2 = base.faces.map(face => face.map(i => i + base.verts.length));
    const faces_side = prism.faces_side(base.verts.length);
    return {
        verts: base.verts.concat(verts2),
        faces: base.faces.concat(faces2).concat(faces_side),
    };
}

