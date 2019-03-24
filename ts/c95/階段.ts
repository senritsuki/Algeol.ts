/**
 * 階段
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../algeol/common'
import * as vc from '../algeol/datatype/vector'
import * as mx from '../algeol/datatype/matrix'
import * as ray from '../algeol/datatype/ray'
import * as cv from '../algeol/datatype/curve'
import * as sq from '../algeol/algorithm/sequence'
import * as obj from '../algeol/datatype/object';

function _steps_t(steps: number, count: number = steps, offset: number = 0): number[] {
    return sq.arithmetic(count).map(i => ((i + 0.5) / steps) + offset);
}

export interface StairInfo {
    始点: vc.V3, 
    終点: vc.V3, 
    段数: number,
    step: obj.Object,
}
export function stair(info: StairInfo): obj.Object {
    const d = vc.sub(info.終点, info.始点).scalar(1 / info.段数);
    const coords = _steps_t(info.段数).map(t => vc.mid(info.始点, info.終点, t));
    const rot = mx.m4_rotate_from_10_to_v([d.x, d.y]);
    const transforms = coords.map(c => mx.mulAll([
        mx.m4_translate3(c),
        rot,
    ]));
    return obj.objDuplicated(info.step, transforms);
}

export function rays_stair(
    rays: ray.Ray3[],
    step: obj.Object,
): obj.Object {
    const transforms = rays.map(ray => mx.mulAllRev([
        mx.m4_rotate_from_10_to_v([ray.d.x, ray.d.y]),
        mx.m4_translate3(ray.c),
    ]));
    return obj.objDuplicated(step, transforms);
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
): ray.Ray3[] {
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

export interface SpiralStairInfo {
    始点: vc.V3,
    終点: vc.V3,
    dx: vc.V3,  // right
    dy: vc.V3,  // front
    螺旋数: number,
    螺旋段数: number,
    additional_steps: number,
    step: obj.Object,
}
export function spiralStair(info: SpiralStairInfo): obj.Object {
    const o = info.始点.sub(info.dx);
    const dz = _spiral_stair_dz(info.始点, info.終点, info.dx, info.dy, info.螺旋数, info.螺旋段数, info.additional_steps);
    const spiral = cv.spiral(o, o.add(info.dx), o.add(info.dy), o.add(dz));
    const rays = _spiral_stair_rays(spiral, info.螺旋数, info.螺旋段数, info.additional_steps);
    return rays_stair(rays, info.step);
}
