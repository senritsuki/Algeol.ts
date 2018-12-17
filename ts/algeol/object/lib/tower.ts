/**
 * 塔
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../../common';
import * as sq from '../../algorithm/sequence';
import * as vc from '../../datatype/vector';
import * as mx from '../../datatype/matrix';
import * as prim_cube from '../../geometry/primitive3/cube';
import * as prim_prism from '../../geometry/primitive3/prism';
import * as obj from '../object';
import * as arch from './arch';

export interface BasicSquareInfo {
    floor_radius: vc.V2|number[];
    floor_top_z: number;
    floor_depth: number;
    column_radius: number;
    column_bottom_z: number;
    facename_floor: string|null;
    facename_column: string|null;
}

export function basic_square(
    d: BasicSquareInfo,
    transform: mx.M4|null = null,
): obj.Object {
    const floor = _square_floor(d);
    const column = _square_column(d);
    const columns = _rect_columns(column, vc.to_v2_if_not(d.floor_radius));
    return obj.objGrouped([floor, columns], null, transform);
}

export interface BasicPrismInfo {
    floor_vertex: number;
    floor_radius: number;
    floor_top_z: number;
    floor_depth: number;
    floor_outside_circle: boolean;
    column_radius: number;
    column_bottom_z: number;
    facename_floor: string;
    facename_column: string;
}

export function basic_prism(
    d: BasicPrismInfo,
    transform: mx.M4|null = null,
): obj.Object {
    const floor = _prism_floor(d);
    const column = _prism_column(d);
    const columns = _duplicates(column, d);
    return obj.objGrouped([floor, columns], null, transform);
}

export interface ArchPrismInfo extends BasicPrismInfo {
    arch_div: number;
}

export function arch_prism(
    d: ArchPrismInfo,
    transform: mx.M4|null = null,
): obj.Object {
    const floor = _prism_floor(d);
    const column = _prism_column(d);
    const columns = _duplicates(column, d);
    const wall = _arch_wall(d);
    const walls = _duplicates(wall, d);
    return obj.objGrouped([floor, columns, walls], null, transform);
}

interface SquareFloorInfo {
    floor_radius: vc.V2|number[];
    floor_top_z: number;
    floor_depth: number;
    facename_floor: string|null;
    facename_column: string|null;
}

function _square_floor(d: SquareFloorInfo): obj.Object {
    const r = vc.to_v2_if_not(d.floor_radius);
    const verts = prim_cube.verts(1);
    const faces_floor = prim_cube.faces_top();
    const faces_column = prim_cube.faces_side().concat(prim_cube.faces_bottom());
    const fg = [
        obj.faceGroup(faces_floor, d.facename_floor),
        obj.faceGroup(faces_column, d.facename_column),
    ];
    const transform = mx.mulAllRev([
        mx.m4_translate3([0, 0, -0.5]),
        mx.m4_scale3([r.x, r.y, d.floor_depth]),
        mx.m4_translate3([0, 0, d.floor_top_z]),
    ]);
    return obj.objMultiFaceGroup(verts, fg, transform);
}

interface PrismFloorInfo {
    floor_vertex: number;
    floor_radius: number;
    floor_top_z: number;
    floor_depth: number;
    floor_outside_circle: boolean;
    facename_floor: string;
    facename_column: string;
}

function _prism_floor(d: PrismFloorInfo): obj.Object {
    const verts = prim_prism.verts(d.floor_vertex, 1, 1, d.floor_outside_circle);
    const faces_floor = prim_prism.faces_top(d.floor_vertex);
    const faces_column = prim_prism.faces_side(d.floor_vertex)
        .concat(prim_prism.faces_bottom(d.floor_vertex));
    const fg = [
        obj.faceGroup(faces_floor, d.facename_floor),
        obj.faceGroup(faces_column, d.facename_column),
    ];
    const transform = mx.mulAllRev([
        mx.m4_translate3([0, 0, -0.5]),
        mx.m4_scale3([d.floor_radius, d.floor_radius, d.floor_depth]),
        mx.m4_translate3([0, 0, d.floor_top_z]),
    ]);
    return obj.objMultiFaceGroup(verts, fg, transform);
}

interface SquareColumnInfo {
    floor_top_z: number;
    floor_depth: number;
    column_radius: number;
    column_bottom_z: number;
    facename_column: string|null;
}

function _square_column(d: SquareColumnInfo): obj.Object {
    const verts = prim_cube.verts(1);
    const faces = prim_cube.faces();
    const fg = [obj.faceGroup(faces, d.facename_column)];
    const transform = mx.mulAllRev([
        mx.m4_translate3([-0.5, -0.5, 0.5]),
        mx.m4_scale3([d.column_radius, d.column_radius, d.column_bottom_z - d.floor_depth - d.floor_top_z]),
        mx.m4_translate3([0, 0, d.column_bottom_z]),
    ]);
    return obj.objMultiFaceGroup(verts, fg, transform);
}

interface PrismColumnInfo {
    floor_vertex: number;
    floor_top_z: number;
    floor_depth: number;
    floor_outside_circle: boolean;
    column_radius: number;
    column_bottom_z: number;
    facename_column: string|null;
}

function to_outer(vertex: number, n: number): number {
    return n / Math.cos(ut.deg180 / vertex);
}

function _prism_column(d: PrismColumnInfo): obj.Object {
    const r = d.floor_outside_circle ? to_outer(d.floor_vertex, 1) : 1;
    const verts = prim_prism.verts(d.floor_vertex, r, 1);
    const faces = prim_prism.faces(d.floor_vertex);
    const fg = [obj.faceGroup(faces, d.facename_column)];
    const transform = mx.mulAllRev([
        mx.m4_translate3([-0.5, -0.5, 0.5]),
        mx.m4_scale3([d.column_radius, d.column_radius, d.column_bottom_z - d.floor_depth - d.floor_top_z]),
        mx.m4_translate3([0, 0, d.column_bottom_z]),
    ]);
    return obj.objMultiFaceGroup(verts, fg, transform);
}

function _rect_columns(column: obj.Object, r: vc.V2): obj.Object {
    const transforms = [
        mx.m4_translate3([r.x, r.y]),
        mx.mulAllRev([mx.m4_rotate3_z90(), mx.m4_translate3([-r.x, r.y])]),
        mx.mulAllRev([mx.m4_rotate3_z180(), mx.m4_translate3([-r.x, -r.y])]),
        mx.mulAllRev([mx.m4_rotate3_z270(), mx.m4_translate3([r.x, -r.y])]),
    ];
    return obj.objDuplicated(column, transforms);
}

interface PrismColumnsInfo {
    floor_vertex: number;
    floor_radius: number;
    floor_outside_circle: boolean;
}

function _duplicates(column: obj.Object, d: PrismColumnsInfo): obj.Object {
    const r = d.floor_outside_circle ? to_outer(d.floor_vertex, d.floor_radius) : d.floor_radius;
    const rad_offset = d.floor_outside_circle ? ut.deg180 / d.floor_vertex : 0;
    const translate = mx.m4_translate3([r, 0, 0]);
    const rotates = sq.range(0, ut.deg360, d.floor_vertex + 1, true)
        .map(rad => mx.m4_rotate3_z(rad + rad_offset));
    const transforms = rotates.map(rot => mx.mulAllRev([translate, rot]));
    return obj.objDuplicated(column, transforms);
}

interface ArchColumnInfo {
    floor_vertex: number;
    floor_radius: number;
    floor_top_z: number;
    //floor_depth: number;
    floor_outside_circle: boolean;
    column_radius: number;
    //column_bottom_z: number;
    arch_div: number;
    facename_column: string|null;
}

function _arch_wall(d: ArchColumnInfo): obj.Object {
    let len = d.floor_radius - d.column_radius * 2;
    if (d.floor_outside_circle) len = to_outer(d.floor_vertex, len);
    const height = len / 2;
    const div = d.arch_div;
    const thick_x = d.column_radius * 2;
    const thick_z = thick_x;
    const vf2 = arch.vf2_archwall(len, height, div, thick_x, thick_z);
    const width_type = arch.ExpandDir.Left;
    const width = d.column_radius * 2;
    const facename = d.facename_column;
    const transfrom = mx.mulAllRev([
        mx.m4_translate3([0, 0, d.floor_top_z - height]),
        mx.m4_rotate3_z(ut.degToRad(180 - ((d.floor_vertex - 2) * 180) / d.floor_vertex / 2)),
    ]);
    const archwall = arch.arch(vf2, width_type, width, facename, transfrom);
    return archwall;
}
