/**
 * 階段
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../../algorithm/utility';
import * as sq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';
import * as mx from '../../algorithm/matrix';
import * as cv from '../../algorithm/curve';
import * as prim_cube from '../../geometry/primitive3/cube';
import * as obj from '../object';


function _steps_t(steps: number, count: number = steps, offset: number = 0): number[] {
    return sq.arithmetic(count).map(i => ((i + 0.5) / steps) + offset);
}

export function stair(
    v1: vc.V3, 
    v2: vc.V3, 
    steps: number,
    step: obj.Object,
): obj.Object {
    const d = vc.sub(v2, v1).scalar(1 / steps);
    const coords = _steps_t(steps).map(t => vc.mid(v1, v2, t));
    const rot = mx.m4_rotate_from_10_to_v([d.x, d.y]);
    const transforms = coords.map(c => mx.compose([
        rot,
        mx.m4_translate3(c),
    ]));
    return obj.obj_duplicate(step, transforms);
}

export function rays_stair(
    rays: cv.Ray3[],
    step: obj.Object,
): obj.Object {
    const transforms = rays.map(ray => mx.compose([
        mx.m4_rotate_from_10_to_v([ray.d.x, ray.d.y]),
        mx.m4_translate3(ray.c),
    ]));
    return obj.obj_duplicate(step, transforms);
}

export function curve_stair(
    curve: cv.Curve3,
    steps: number,
    step: obj.Object,
): obj.Object {
    const rays = _steps_t(steps).map(t => curve.ray(t));
    return rays_stair(rays, step);
}

function _spiral_stair_dz(
    v1: vc.V3,
    v2: vc.V3,
    dx: vc.V3,  // right
    dy: vc.V3,  // front
    rounds: number,
    steps_per_round: number,
    additional_steps: number,
): vc.V3 {
    const fix_rounds_float = rounds + additional_steps / steps_per_round;
    const ad_rad = ut.deg360 / (additional_steps / steps_per_round);
    const ad_x = dx.scalar(Math.cos(ad_rad));
    const ad_y = dy.scalar(Math.sin(ad_rad));
    const d = v2.sub(v1);
    const dz_full = d.sub(ad_x).sub(ad_y);
    const dz = dz_full.scalar(1 / fix_rounds_float);
    return dz;
}

function _spiral_stair_rays(
    spiral: cv.Curve3,
    rounds: number,
    steps_per_round: number,
    additional_steps: number,
): cv.Ray3[] {
    const ad_rounds = Math.floor(additional_steps / steps_per_round);
    let ad_steps = additional_steps % steps_per_round;
    if (ad_steps < 0) ad_steps += steps_per_round;
    const fix_rounds = rounds + ad_rounds;
    const rays1 = sq.arithmetic(fix_rounds)
        .map(i => _steps_t(steps_per_round, steps_per_round, i)
        .map(t => spiral.ray(t)));
    const rays2 = _steps_t(steps_per_round, ad_steps, fix_rounds)
        .map(t => spiral.ray(t));
    const rays = rays1.reduce((a, b) => a.concat(b)).concat(rays2);
    return rays;
}

export function spiral_stair(
    v1: vc.V3,
    v2: vc.V3,
    dx: vc.V3,  // right
    dy: vc.V3,  // front
    rounds: number,
    steps_per_round: number,
    additional_steps: number,
    step: obj.Object,
): obj.Object {
    const o = v1.sub(dx);
    const dz = _spiral_stair_dz(v1, v2, dx, dy, rounds, steps_per_round, additional_steps);
    const spiral = cv.spiral(o, o.add(dx), o.add(dy), o.add(dz));
    const rays = _spiral_stair_rays(spiral, rounds, steps_per_round, additional_steps);
    return rays_stair(rays, step);
}

export function step_basic(
    v1: vc.V3, 
    v2: vc.V3, 
    steps: number,
    width: number,
    depth: number,
    facegroup_name: string|null,
    material_name: string|null = facegroup_name,
): obj.Object {
    const dir = v2.sub(v1);
    const d = dir.scalar(1 / steps);
    const step_verts = prim_cube.verts(0.5);
    const step_verts_transform = mx.compose([
        mx.m4_translate3([0, 0, -0.5]),
        mx.m4_scale3([d.length(), width, depth]),
    ]);
    const step_faces = prim_cube.faces();
    const step_fg = [obj.facegroup(step_faces, facegroup_name, material_name)];
    return obj.obj_single(step_verts, step_fg, step_verts_transform);
}

export function stair_basic(
    v1: vc.V3, 
    v2: vc.V3, 
    steps: number,
    width: number,
    depth: number,
    facegroup_name: string|null,
    material_name: string|null = facegroup_name,
): obj.Object {
    const step = step_basic(v1, v2, steps, width, depth, facegroup_name, material_name)
    return stair(v1, v2, steps, step);
}


