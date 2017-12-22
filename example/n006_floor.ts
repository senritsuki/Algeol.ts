// テーマ：森の隠れ家
import * as ut from "../algorithm/utility";
import * as seq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";
import * as mx from "../algorithm/matrix";
//import * as cv from "../algorithm/curve";

import * as al from '../geometry/geo';
//import * as prim from '../geometry/primitive';
import * as prim2 from '../geometry/primitive2';
import * as lib from './n005_lib';

import * as wf from '../decoder/wavefront';
import * as saver from './n003_save';

const v3 = vc.v3;


const BottomZ = -100;

const square = geo_rfloor_simple(lib.floor_square(v3(0, 0, 3), 1));

const squares = al.duplicate(square, al.compose(seq.arith(4), [
    _ => mx.trans_m4(v3(0, 5, 0)),
    i => mx.rot_z_m4(ut.deg90 * i),
]));

export function geo_rfloor_simple(floor: lib.RegularFloor): al.Geo {
    return lib.xygeo_z_scale_rot(floor.verts(), [
        v3(0, 1, 0),
        v3(-1/8, 1, 0),
        v3(-1, 1/8, 0),
        v3(BottomZ, 1/8, 0),
    ]);
}

const plane = prim2.plane(prim2.circle_i(24, 10), prim2.to_v3_xy(0));

save([
    al.geos_to_obj(squares, lib.lch(18, 0, 0)),
    al.geo_to_obj(plane, lib.lch(17, 5, 2)),
]);

function save(objs: al.Obj[]) {
    const result = wf.objs_to_strings('./_obj/n006', objs);
    saver.save_objmtl(result);
}

