"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("../algorithm/utility");
var seq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
var cv = require("../algorithm/curve");
var cc = require("../algorithm/color_converter");
var al = require("../geometry/geo");
var prim = require("../geometry/primitive");
var wf = require("../decoder/wavefront");
var save = require("./n003_save");
var lch = ut.composite_2f(cc.lch_to_rgb01, function (nn) { return cc.clamp(nn, 0, 1); });
function lch5(l, c, h) {
    var diffuse = lch([l * 5, c * 5, h * 15]);
    var name = 'c' + ut.format_02d(l) + ut.format_02d(c) + ut.format_02d(h);
    return new al.Material(name, diffuse);
}
var start = vc.v3(0, 0, 0);
var goal = vc.v3(1, 5, 2);
var geo_floor = prim.cuboid_vv([-1 / 2, -1 / 2, -1 / 8], [1 / 2, 1 / 2, 0]);
var geo_stairstep = prim.cuboid_vv([-3 / 8, -1 / 16, -1 / 8], [3 / 8, 1 / 16, 0]);
var floor_duplicater = al.composite_m4([start, goal], [
    function (d) { return mx.trans_m4(d); },
]);
var stair_start = start.add([0, 1 / 2, 0]);
var stair_goal = goal.add([0, -1 / 2, 0]);
var xd = stair_goal.x() - stair_start.x();
var stair_mid1 = stair_start.scalar(2).add(stair_goal).scalar(1 / 3).sub([xd / 3, 0, 0]);
var stair_mid2 = stair_goal.scalar(2).add(stair_start).scalar(1 / 3).add([xd / 3, 0, 0]);
var stair_curve = cv.bezier([stair_start, stair_mid1, stair_mid2, stair_goal]);
var stair_step_num = Math.round(Math.abs(stair_goal.y() - stair_start.y()) * 8);
var stair_coords = seq.arith(stair_step_num + 1).map(function (i) { return stair_curve.coord(i / stair_step_num); });
var stairstep_duplicater = al.composite_m4(stair_coords, [
    function (d) { return mx.trans_m4(d); },
]);
var obj_floors = al.merge_geos(al.duplicate(geo_floor, floor_duplicater), lch5(19, 0, 0));
var obj_stairsteps = al.merge_geos(al.duplicate(geo_stairstep, stairstep_duplicater), lch5(18, 1, 17));
var objs = [obj_floors, obj_stairsteps];
var result = wf.objs_to_strings('./_obj/n004_stair', objs);
save.save_objmtl(result);
