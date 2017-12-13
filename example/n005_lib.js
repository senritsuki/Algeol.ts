"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var seq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
var cv = require("../algorithm/curve");
var al = require("../geometry/geo");
var geo_array = require("../geometry/array");
var v3 = vc.v3;
function verts_to_one_face_geo(verts) {
    var faces = verts.map(function (_, i) { return i; });
    return new al.Geo(verts, [faces]);
}
function arch_wall(o, outer_dx, outer_dy, inner_dx, inner_dy, inner_v_num) {
    var p1 = o.add(outer_dx);
    var p2 = p1.add(outer_dy);
    var p4 = o.sub(outer_dx);
    var p3 = p4.add(outer_dy);
    var px_inner = o.add(outer_dx.scalar(inner_dx));
    var py_inner = o.add(outer_dy.scalar(inner_dy));
    var arc = cv.circle(o, px_inner, py_inner);
    var p_arch = seq.range(0.5, 0, inner_v_num).map(function (t) { return arc.coord(t); });
    var verts = [p1, p2, p3, p4].concat(p_arch);
    return verts_to_one_face_geo(verts);
}
exports.arch_wall = arch_wall;
function arch_bar(o, outer_dx, outer_dy, inner_dx, inner_dy, inner_v_num) {
    var x_outer = o.add(outer_dx);
    var y_outer = o.add(outer_dy);
    var x_inner = o.add(outer_dx.scalar(inner_dx));
    var y_inner = o.add(outer_dy.scalar(inner_dy));
    var arc_outer = cv.circle(o, x_outer, y_outer);
    var arc_inner = cv.circle(o, x_inner, y_inner);
    var p_arch_outer = seq.range(0, 0.5, inner_v_num).map(function (t) { return arc_outer.coord(t); });
    var p_arch_inner = seq.range(0.5, 0, inner_v_num).map(function (t) { return arc_inner.coord(t); });
    var verts = p_arch_outer.concat(p_arch_inner);
    return verts_to_one_face_geo(verts);
}
exports.arch_bar = arch_bar;
// x axis one face series
function xof_arch_wall(outer_dx, outer_dy, inner_dx, inner_dy, inner_v_num) {
    return arch_wall(vc.v3_zero, vc.v3(outer_dx, 0, 0), vc.v3(0, 0, outer_dy), inner_dx, inner_dy, inner_v_num);
}
exports.xof_arch_wall = xof_arch_wall;
function xof_arch_bar(outer_dx, outer_dy, inner_dx, inner_dy, inner_v_num) {
    return arch_bar(vc.v3_zero, vc.v3(outer_dx, 0, 0), vc.v3(0, 0, outer_dy), inner_dx, inner_dy, inner_v_num);
}
exports.xof_arch_bar = xof_arch_bar;
// x axis geo series
/**
 * x axis one face geometry をy軸方向に厚みをつける
 * @param xof
 * @param y0
 * @param y1
 */
function xg_extract(xof, y0, y1) {
    var verts_0 = xof.verts.map(function (v) { return v.add([0, y0, 0]); });
    var verts_1 = xof.verts.map(function (v) { return v.add([0, y1, 0]); });
    return geo_array.prismArray([verts_0, verts_1]);
}
exports.xg_extract = xg_extract;
function to_square_verts(o, dx, dy) {
    return [
        o.add(dx).add(dy),
        o.sub(dx).add(dy),
        o.sub(dx).sub(dy),
        o.add(dx).sub(dy),
    ];
}
/**
 *
 * @param dx
 * @param dy
 * @param z_num
 * @param z     (0 ... 1) => x縮小率, y縮小率, z位置
 */
function square_ground(dx, dy, z_num, z) {
    var ground_verts = to_square_verts(vc.v3_zero, v3(dx, 0, 0), v3(0, dy, 0));
    var z_rates = seq.range(0, 1, z_num).map(function (t) { return z(t); });
    var maps = al.compose(z_rates, [
        function (v) { return mx.scale_m4([v.x(), v.y(), 1]); },
        function (v) { return mx.trans_m4([0, 0, v.z()]); },
    ]);
    var polygons = al.duplicate_verts(ground_verts, maps);
    return geo_array.prismArray(polygons);
}
exports.square_ground = square_ground;
