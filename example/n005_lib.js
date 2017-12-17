"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("../algorithm/utility");
var seq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
var cv = require("../algorithm/curve");
var al = require("../geometry/geo");
var geo_array = require("../geometry/array");
var v3 = vc.v3;
var v3_zero = vc.v3_zero;
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
// x/z plane geometry
function xzgeo_arch_wall(outer_dx, outer_dy, inner_dx, inner_dy, inner_v_num) {
    return arch_wall(v3_zero, vc.v3(outer_dx, 0, 0), vc.v3(0, 0, outer_dy), inner_dx, inner_dy, inner_v_num);
}
exports.xzgeo_arch_wall = xzgeo_arch_wall;
function xzgeo_arch_bar(outer_dx, outer_dy, inner_dx, inner_dy, inner_v_num) {
    return arch_bar(v3_zero, vc.v3(outer_dx, 0, 0), vc.v3(0, 0, outer_dy), inner_dx, inner_dy, inner_v_num);
}
exports.xzgeo_arch_bar = xzgeo_arch_bar;
/**
 * x/z plane geometry をy軸方向に厚みをつける
 * @param xzgeo
 * @param y0
 * @param y1
 */
function xzgeo_extract(xzgeo, y0, y1) {
    var verts_0 = xzgeo.verts.map(function (v) { return v.add([0, y0, 0]); });
    var verts_1 = xzgeo.verts.map(function (v) { return v.add([0, y1, 0]); });
    return geo_array.prismArray([verts_0, verts_1]);
}
exports.xzgeo_extract = xzgeo_extract;
function to_xy_square(o, dx, dy) {
    return [
        o.add(dx).add(dy),
        o.sub(dx).add(dy),
        o.sub(dx).sub(dy),
        o.add(dx).sub(dy),
    ];
}
exports.to_xy_square = to_xy_square;
function to_xy_square_basis(dx, dy) {
    return to_xy_square(v3_zero, v3(dx, 0, 0), v3(0, dy, 0));
}
exports.to_xy_square_basis = to_xy_square_basis;
function to_xy_hexagon(o, d0, d1) {
    return [
        o.add(d0),
        o.add(d1),
        o.add(d1).sub(d0),
        o.sub(d0),
        o.sub(d1),
        o.sub(d1).add(d0),
    ];
}
exports.to_xy_hexagon = to_xy_hexagon;
function to_xy_hexagon_basis(d, offset_deg) {
    var rad0 = ut.deg_to_rad(offset_deg);
    var rad1 = ut.deg_to_rad(offset_deg + 60);
    var d0 = v3(d * Math.cos(rad0), d * Math.sin(rad0), 0);
    var d1 = v3(d * Math.cos(rad1), d * Math.sin(rad1), 0);
    return to_xy_hexagon(v3_zero, d0, d1);
}
exports.to_xy_hexagon_basis = to_xy_hexagon_basis;
function to_xy_hexagon_basis_deg30(d_inner) {
    var d_outer = d_inner * 2 / ut.r3;
    return to_xy_hexagon_basis(d_outer, 30);
}
exports.to_xy_hexagon_basis_deg30 = to_xy_hexagon_basis_deg30;
// x/y plane & z depth geometry
/**
 *
 * @param xy_verts
 * @param z_num
 * @param z     (0 ... 1) => x縮小率, y縮小率, z位置
 */
function xygeo_scale_trans(xy_verts, z_num, z) {
    var z_rates = seq.range(0, 1, z_num).map(function (t) { return z(t); });
    var maps = al.compose(z_rates, [
        function (v) { return mx.scale_m4([v.x(), v.y(), 1]); },
        function (v) { return mx.trans_m4([0, 0, v.z()]); },
    ]);
    var polygons = al.duplicate_verts(xy_verts, maps);
    return geo_array.prismArray(polygons);
}
exports.xygeo_scale_trans = xygeo_scale_trans;
function xygeo_scale_rot_trans(xy_verts, z_num, z) {
    var z_rates = seq.range(0, 1, z_num).map(function (t) { return z(t); });
    var maps = al.compose(z_rates, [
        function (v) { return mx.scale_m4([v.x(), v.x(), 1]); },
        function (v) { return mx.rot_z_m4(v.y()); },
        function (v) { return mx.trans_m4([0, 0, v.z()]); },
    ]);
    var polygons = al.duplicate_verts(xy_verts, maps);
    return geo_array.prismArray(polygons);
}
exports.xygeo_scale_rot_trans = xygeo_scale_rot_trans;
function duplicate_rot_z(xy_verts, count, deg) {
    var maps = al.compose(seq.arith(count), [
        function (i) { return mx.rot_z_m4(ut.deg_to_rad(i * deg)); },
    ]);
    var new_verts = al.duplicate_verts(xy_verts, maps);
    return geo_array.flatten(new_verts);
}
exports.duplicate_rot_z = duplicate_rot_z;
function duplicate_rot_z_90_4(xy_verts) {
    return duplicate_rot_z(xy_verts, 4, 90);
}
exports.duplicate_rot_z_90_4 = duplicate_rot_z_90_4;
function duplicate_rot_z_120_3(xy_verts) {
    return duplicate_rot_z(xy_verts, 3, 120);
}
exports.duplicate_rot_z_120_3 = duplicate_rot_z_120_3;
