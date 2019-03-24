/**
 * アーチ
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as sq from '../../algorithm/sequence';
import * as vc from '../../datatype/vector';
import * as mx from '../../datatype/matrix';
import * as cv from '../../datatype/curve';
import * as gut from '../../geometry/utility';
import * as gcv from '../../geometry/primitive2/curve';
import * as gcp from '../../geometry/primitive2/curve_plane';
import * as obj from '../../datatype/object';

export enum ThickType {
    Inner,
    Outer,
    Both,
}

export enum ExpandDir {
    Left,
    Right,
    Both,
}

function to_expand_dir(thick_type: ThickType): gcv.ExpandDir {
    return thick_type == ThickType.Inner ? 
        gcv.ExpandDir.Left :
        thick_type == ThickType.Outer ?
        gcv.ExpandDir.Right :
        gcv.ExpandDir.Both;
}

export interface VF2 {
    verts: vc.V2[];
    faces: number[][];
}

export function expand_arch(
    vf: VF2,
    width_type: ExpandDir,
    width: number,
): gut.ExpandedPrism<vc.V3> {
    const verts3 = vf.verts.map(v => vc.v3(v.x, 0, v.y));
    const expand = width_type == ExpandDir.Left ?
        gut.toPrism(verts3, vc.v3(0, width, 0), vf.faces) :
        width_type == ExpandDir.Right ?
        gut.toPrism(verts3, vc.v3(0, -width, 0), vf.faces) :
        gut.toPrism2(verts3, vc.v3(0, -width / 2, 0), vc.v3(0, width / 2, 0), vf.faces);
    return expand;
}

export function vf2_arch(
    len: number,
    height: number,
    div: number,
    thick_type: ThickType,
    thick: number,
): VF2 {
    const len2 = len / 2;
    const curve = cv.circle(vc.v2(len2, 0), vc.v2(len2, 0), vc.v2(0, height));
    const t_dir = to_expand_dir(thick_type);
    const verts = gcv.verts_expand(curve, div, t_dir, thick);
    const faces = gcv.faces(div);
    return {verts, faces};
}

export function vf2_archwall(
    len: number,
    height: number,
    div: number,
    thick_x: number,
    thick_z: number,
): VF2 {
    const len2 = len / 2;
    const curve = cv.circle(vc.v2(len2, 0), vc.v2(len2 - thick_x, 0), vc.v2(0, height - thick_z));
    const verts_cv = sq.range(0, 1, div + 1).map(t => curve.coord(t));
    const verts2 = [vc.v2(len, 0)].concat(verts_cv).concat([vc.v2(0, 0)]);
    const cp = new gcp.CurvePlane2(vc.v2(len, height), vc.v2(0, height), verts2);
    const verts = cp.verts();
    const faces = cp.faces();
    return {verts, faces};
}

export function arch(
    vf: VF2,
    width_type: ExpandDir,
    width: number,
    facename: string|null,
    transform: mx.M4|null,
): obj.Object {
    const prism = expand_arch(vf, width_type, width);
    return obj.objSingle(
        {verts: prism.verts(), faces: prism.faces()},
        facename,
        transform,
    );
}

/*
export interface ArchInfo {
    v1: vc.V2;
    v2: vc.V2;
    arch: cv.Curve2;
    arch_thickness: number;
    arch_div: number;
    arch_base_z: number;
    arch_width: number;
    arch_top_z: number;
    //arch_column_bottom_z: number|null;
    thick_type: ThickType;
    facename: string|null;
}

export class DefaultArchInfo implements ArchInfo {
    constructor(
        public v1: vc.V2,
        public v2: vc.V2,
        public arch: cv.Curve2,
        public arch_thickness: number,
        public arch_div: number = 12,
        public arch_base_z: number = 0,
        public arch_width: number = 1,
        public arch_top_z: number = 1,
        //public arch_column_bottom_z: number|null = null,
        public thick_type: ThickType = ThickType.Inner,
        public facename: string|null = null,
    ) {}
}

export function deg180_plane(
    d: ArchInfo,
    transform: mx.M4|null = null,
): vc.V3[] {
    const tfs = _transforms(d);
    const verts_inner = _verts_archplane(d, tfs, true);
    const verts_outer = _verts_archplane(d, tfs, false);
    return verts_inner.concat(verts_outer);
}

function _merge_verts_simple_archplane(inner: vc.V3[], outer: vc.V3[], d: ArchInfo, z: number|null): vc.V3[] {
    //const z = d.arch_column_bottom_z;
    if (!z) {
        return inner.concat(outer);
    }
    const o = vc.mid(d.v1, d.v2, 0.5);
    const d1 = d.v1.sub(o);
    const d2 = d.v2.sub(o);
    const v11 = vc.v2_to_v3(d1.length_add(_v_len_add(d, true)), z);
    const v12 = vc.v2_to_v3(d1.length_add(_v_len_add(d, false)), z);
    const v21 = vc.v2_to_v3(d2.length_add(_v_len_add(d, true)), z);
    const v22 = vc.v2_to_v3(d2.length_add(_v_len_add(d, false)), z);
    return [v12, v11].concat(inner).concat([v21, v22]).concat(outer);
}

interface _verts_archplane_if {
    arch: cv.Curve2;
    arch_thickness: number;
    thick_type: ThickType;
    arch_div: number;
}

function _verts_archplane(d: _verts_archplane_if, tfs: [mx.M4, mx.M4], is_inner: boolean): vc.V3[] {
    const len_add = _v_len_add(d, is_inner);
    const tt = is_inner ? sq.range(0, 1, d.arch_div + 1) : sq.range(1, 0, d.arch_div + 1);
    return tt
        .map(t => d.arch.coord(t))
        .map(v => vc.v3(v.x, 0, v.y))
        .map(v => tfs[0].map_v3(v, 1))
        .map(v => v.length_add(len_add))
        .map(v => tfs[1].map_v3(v, 1));
}
interface _v_len_add_if {
    arch_thickness: number;
    thick_type: ThickType;
}
function _v_len_add(d: _v_len_add_if, is_inner: boolean): number {
    const n1 = is_inner ? -1 : 0;
    const n2 = d.thick_type == ThickType.Inner ? 0 : d.thick_type == ThickType.Both ? 0.5 : 1;
    return (n1 + n2) * d.arch_thickness;
}

interface _transforms_if {
    v1: vc.V2;
    v2: vc.V2;
    arch_base_z: number;
    arch_width: number;
    arch_top_z: number;
}
function _transforms(d: _transforms_if): [mx.M4, mx.M4] {
    const height = d.arch_top_z - d.arch_base_z;
    const dir = d.v2.sub(d.v1);
    const tf1 = mx.compose([
        mx.m4_scale3([dir.length(), d.arch_width, height]),
        mx.m4_rotate_from_10_to_v(dir),
    ]);
    const tf2 = mx.m4_translate3([d.v1.x, d.v1.y, d.arch_base_z]);
    return [tf1, tf2];
}

export function expand_plane(plane: vc.V3[], d: ArchInfo): gut.ExpandedPrism<vc.V3> {
    const dir = d.v2.sub(d.v1);
    const dir_side = vc.v3(-dir.y, dir.x, 0);
    const d1 = dir_side.unit().scalar(d.arch_width / 2);
    const d2 = d1.scalar(-1);
    return gut.expand2(plane, d1, d2);
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
*/
