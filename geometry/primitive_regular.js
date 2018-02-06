"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("../algorithm/utility");
var seq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var sfl = require("./surface_lib");
var prim = require("./primitive_core");
/** 半径1の球 */
function Sphere(div_horizontal, div_vertical) {
    return new prim.BasePrimitive(b3_sphere, build_sf_sphere(div_horizontal, div_vertical));
}
exports.Sphere = Sphere;
/** 半径1の球 */
function b3_sphere(v) {
    v = v.el_mul(v);
    return v.x + v.y + v.z <= 1;
}
/** 半径1の球 (UV Sphere) */
function build_sf_sphere(hd, vd) {
    var rad_vs = seq.range_wo_last(-ut.pi / 2, ut.pi / 2, vd).slice(1);
    var rad_hs = seq.range_wo_last(0, ut.pi2, hd);
    var polygons = rad_vs.map(function (rad_v) { return rad_hs.map(function (rad_h) { return vc.sphere_to_v3(1, rad_h, rad_v); }); });
    var v1 = vc.v3(0, 0, -1);
    var v2 = vc.v3(0, 0, 1);
    return function () { return sfl.antiprismArray_bipyramid(polygons, v1, v2); };
}
/** 半径1の球に外接する立方体 */
function b3_cube(v) {
    return Math.max(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z)) <= 1;
}
exports.b3_cube = b3_cube;
/** 半径1の球に外接する立方体 */
function sf_cube() {
    var verts = [vc.v3(1, 1, 0), vc.v3(-1, 1, 0), vc.v3(-1, -1, 0), vc.v3(1, -1, 0)];
    return sfl.extrude3(verts, vc.v3(0, 0, -1), vc.v3(0, 0, 1));
}
exports.sf_cube = sf_cube;
/** 半径1の球に内接する正八面体 */
function b3_octahedron(v) {
    return Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z) <= 1;
}
exports.b3_octahedron = b3_octahedron;
function sf_octahedron() {
    var verts = [vc.v3(0, 1, 0), vc.v3(0, 1, 0), vc.v3(-1, 0, 0), vc.v3(0, -1, 0)];
    return sfl.extrude3_bicone(verts, vc.v3(0, 0, -1), vc.v3(0, 0, 1));
}
exports.sf_octahedron = sf_octahedron;
/** 半径1の球に外接する立方体 */
function Cube() {
    return new prim.BasePrimitive(b3_cube, sf_cube);
}
exports.Cube = Cube;
/** 半径1の球に内接する正八面体 */
function Octahedron() {
    return new prim.BasePrimitive(b3_octahedron, sf_octahedron);
}
exports.Octahedron = Octahedron;
/** 半径1の球の一部 */
function build_b3_pie(deg_h_max, deg_v_min, deg_v_max) {
    return function (v) {
        var r_rh_rv = vc.v3_to_sphere(v);
        if (r_rh_rv[0] > 1)
            return false;
        var deg_h = ut.rad_to_deg(r_rh_rv[1]);
        var deg_v = ut.rad_to_deg(r_rh_rv[2]);
        return ut.isin(0, deg_h_max, deg_h) && ut.isin(deg_v_min, deg_v_max, deg_v);
    };
}
exports.build_b3_pie = build_b3_pie;
