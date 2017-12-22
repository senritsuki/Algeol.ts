"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// テーマ：森の隠れ家
var ut = require("../algorithm/utility");
var seq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
//import * as cv from "../algorithm/curve";
var al = require("../geometry/geo");
//import * as prim from '../geometry/primitive';
var prim2 = require("../geometry/primitive2");
var lib = require("./n005_lib");
var wf = require("../decoder/wavefront");
var saver = require("./n003_save");
var v3 = vc.v3;
var BottomZ = -100;
var square = geo_rfloor_simple(lib.floor_square(v3(0, 0, 3), 1));
var squares = al.duplicate(square, al.compose(seq.arith(4), [
    function (_) { return mx.trans_m4(v3(0, 5, 0)); },
    function (i) { return mx.rot_z_m4(ut.deg90 * i); },
]));
function geo_rfloor_simple(floor) {
    return lib.xygeo_z_scale_rot(floor.verts(), [
        v3(0, 1, 0),
        v3(-1 / 8, 1, 0),
        v3(-1, 1 / 8, 0),
        v3(BottomZ, 1 / 8, 0),
    ]);
}
exports.geo_rfloor_simple = geo_rfloor_simple;
var plane = prim2.plane(prim2.circle_i(24, 10), prim2.to_v3_xy(0));
save([
    al.geos_to_obj(squares, lib.lch(18, 0, 0)),
    al.geo_to_obj(plane, lib.lch(17, 5, 2)),
]);
function save(objs) {
    var result = wf.objs_to_strings('./_obj/n006', objs);
    saver.save_objmtl(result);
}
