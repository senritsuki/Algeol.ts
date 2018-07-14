/**
 * アーチ
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../../algorithm/utility';
import * as sq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';
import * as mx from '../../algorithm/matrix';
import * as cv from '../../algorithm/curve';
import * as vsq from '../../algorithm/vector_sequence';
import * as prism from '../../geometry/primitive3/prism';
import * as obj from '../object';


export enum ThickType {
    Inner,
    Outer,
    Both,
}

export interface ArchInfo {
    v1: vc.V2;
    v2: vc.V2;
    arch: cv.Curve2;
    arch_thickness: number;
    arch_base_z: number;
    arch_width: number;
    arch_height_scale: number;
    arch_div: number;
    arch_column_depth: number|null;
    thick_type: ThickType;
    facename: string|null;
}

export class DefaultArchInfo implements ArchInfo {
    constructor(
        public v1: vc.V2,
        public v2: vc.V2,
        public arch: cv.Curve2,
        public arch_thickness: number,
        public arch_base_z: number = 0,
        public arch_width: number = 1,
        public arch_height_scale: number = 1,
        public arch_div: number = 12,
        public arch_column_depth: number|null = null,
        public thick_type: ThickType = ThickType.Inner,
        public facename: string|null = null,
    ) {}
}

export interface ArchInfo {
    v1: vc.V2;
    v2: vc.V2;
    arch: cv.Curve2;
    arch_thickness: number;
    arch_height_scale: number;
    arch_div: number;
    arch_column_depth: number|null;
    thick_type: ThickType;
}
export function simple_arch(
    d: ArchInfo,
    transform: mx.M4|null = null,
): obj.Object {
    const verts_inner = _verts_arch(d, true);
    const verts_outer = _verts_arch(d, false);
}

interface _merge_verts_simple_arch(inner: vc.V3[], outer: vc.V3[], d: ArchInfo): vc.V3[] {

}

interface _VertsArchInfo {
    arch: cv.Curve2;
    arch_thickness: number;
    thick_type: ThickType;
    arch_div: number;
}
function _verts_arch(d: _VertsArchInfo, is_inner: boolean): vc.V3[] {
    const len_add = _v_len_add(d.arch_thickness, d.thick_type, is_inner);
    const tt = is_inner ? sq.range(0, 1, d.arch_div + 1) : sq.range(1, 0, d.arch_div + 1);
    return tt
        .map(t => d.arch.coord(t))
        .map(v => vc.v3(v.x, 0, v.y))
        .map(v => v.length_add(len_add));
}
function _v_len_add(thickness: number, type: ThickType, is_inner: boolean): number {
    const n1 = is_inner ? -1 : 0;
    const n2 = type == ThickType.Inner ? 0 : type == ThickType.Both ? 0.5 : 1;
    return (n1 + n2) * thickness;
}

interface _TransformInfo {
    v1: vc.V2;
    v2: vc.V2;
    arch_width: number;
    arch_height_scale: number;
    arch_base_z: number;
}
function _transform(d: _TransformInfo): mx.M4 {
    const dir = d.v2.sub(d.v1);
    return mx.compose([
        mx.m4_scale3([dir.length(), d.arch_width, d.arch_height_scale]),
        mx.m4_rotate_from_10_to_v(dir),
        mx.m4_translate3([d.v1.x, d.v1.y, d.arch_base_z]),
    ]);
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
    return vsq.arc_range(o, dx, dy, 0, ut.deg180, division+1);
}

export function arc60x2_verts(o: vc.V3, dx: vc.V3, dy: vc.V3, division: number): vc.V3[] {
    const sq1 = vsq.arc_range(o.sub(dx), dx.scalar(2), dy.scalar(ut.r3 / 2), 0, ut.deg60, division / 2 + 1, true);
    const sq2 = vsq.arc_range(o.add(dx), dx.scalar(-2), dy.scalar(ut.r3 / 2), ut.deg60, 0, division / 2 + 1);
    return sq1.concat(sq2);
}

export function arc90_verts(o: vc.V3, dx: vc.V3, dy: vc.V3, division: number): vc.V3[] {
    return vsq.arc_range(o, dx, dy, 0, ut.deg90, division+1);
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
    const faces = [sq.arithmetic(verts.length)];
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
    const faces = [sq.arithmetic(verts.length)];
    return {verts, faces};
}

export function common_vf(
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

export function wall180(
    v1: vc.V3, 
    v2: vc.V3, 
    height: number, 
    thickness: number, 
    division: number,
    width: number,
): obj.Object {
}
