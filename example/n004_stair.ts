import * as ut from '../algorithm/utility';
import * as seq from '../algorithm/sequence';
import * as vc from '../algorithm/vector';
import * as mx from '../algorithm/matrix';
import * as cv from '../algorithm/curve';
import * as cc from '../algorithm/color_converter';
import * as al from '../geometry/geo';
import * as prim from '../geometry/primitive';
import * as wf from '../decoder/wavefront';
import * as save from './n003_save';

const lch = ut.compose_2f(cc.lch_to_rgb01, (nn: number[]) => cc.clamp(nn, 0, 1));

function lch5(l: number, c: number, h: number): al.Material {
    const diffuse = lch([l*5, c*5, h*15]);
    const name = 'c' + ut.format_02d(l) + ut.format_02d(c) + ut.format_02d(h);
    return new al.Material(name, diffuse);
}

const start = vc.v3(0, 0, 0);
const goal = vc.v3(1, 5, 2);

const geo_floor = prim.cuboid_vv([-1/2, -1/2, -1/8], [1/2, 1/2, 0]);
const geo_stairstep = prim.cuboid_vv([-3/8, -1/16, -1/8], [3/8, 1/16, 0]);

const floor_duplicater = al.compose_v3map([start, goal], [
    d => mx.trans_m4(d),
]);

const stair_start = start.add([0, 1/2, 0]);
const stair_goal = goal.add([0, -1/2, 0]);
const xd = stair_goal.x() - stair_start.x();
const stair_mid1 = stair_start.scalar(2).add(stair_goal).scalar(1/3).sub([xd/3, 0, 0]);
const stair_mid2 = stair_goal.scalar(2).add(stair_start).scalar(1/3).add([xd/3, 0, 0]);

const stair_curve = cv.bezier([stair_start, stair_mid1, stair_mid2, stair_goal]);

const stair_step_num = Math.round(Math.abs(stair_goal.y() - stair_start.y()) * 8);

const stair_coords = seq.arith(stair_step_num + 1).map(i => stair_curve.coord(i / stair_step_num));

const stairstep_duplicater = al.compose_v3map(stair_coords, [
    d => mx.trans_m4(d),
]);

const obj_floors = al.geos_to_obj(al.duplicate_f(geo_floor, floor_duplicater), lch5(19, 0, 0));
const obj_stairsteps = al.geos_to_obj(al.duplicate_f(geo_stairstep, stairstep_duplicater), lch5(18, 1, 17));

const objs = [obj_floors, obj_stairsteps];

const result = wf.objs_to_strings('./_obj/n004_stair', objs);

save.save_objmtl(result);
