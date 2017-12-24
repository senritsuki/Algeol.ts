"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var ut = require("../algorithm/utility");
var seq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
var cv = require("../algorithm/curve");
var cc = require("../algorithm/color_converter");
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
    var maps = al.compose_v3map(z_rates, [
        function (v) { return mx.scale_m4([v.x(), v.y(), 1]); },
        function (v) { return mx.trans_m4([0, 0, v.z()]); },
    ]);
    var polygons = al.duplicate_v3(xy_verts, maps);
    return geo_array.prismArray(polygons);
}
exports.xygeo_scale_trans = xygeo_scale_trans;
function xygeo_scale_rot_trans(xy_verts, z_num, z) {
    var z_rates = seq.range(0, 1, z_num).map(function (t) { return z(t); });
    var maps = al.compose_v3map(z_rates, [
        function (v) { return mx.scale_m4([v.x(), v.x(), 1]); },
        function (v) { return mx.rot_z_m4(v.y()); },
        function (v) { return mx.trans_m4([0, 0, v.z()]); },
    ]);
    var polygons = al.duplicate_v3(xy_verts, maps);
    return geo_array.prismArray(polygons);
}
exports.xygeo_scale_rot_trans = xygeo_scale_rot_trans;
function xygeo_z_scale_rot(xy_verts, zsr_list) {
    var maps = al.compose_v3map(zsr_list, [
        function (zsr) { return mx.trans_m4([0, 0, zsr.x()]); },
        function (zsr) { return mx.scale_m4([zsr.y(), zsr.y(), 1]); },
        function (zsr) { return mx.rot_z_m4(zsr.z()); },
    ]);
    var polygons = al.duplicate_v3(xy_verts, maps);
    return geo_array.prismArray(polygons);
}
exports.xygeo_z_scale_rot = xygeo_z_scale_rot;
function duplicate_rot_z(xy_verts, count, deg) {
    var maps = al.compose_v3map(seq.arith(count), [
        function (i) { return mx.rot_z_m4(ut.deg_to_rad(i * deg)); },
    ]);
    var new_verts = al.duplicate_v3(xy_verts, maps);
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
function v3_rot_z(v, deg) {
    return mx.rot_z_m3(ut.deg_to_rad(deg)).map(v);
}
exports.v3_rot_z = v3_rot_z;
function ray3_rot_z_scale(cd, deg, len) {
    var d = v3_rot_z(cd.d, deg).scalar(len);
    return cv.ray(cd.c, d);
}
exports.ray3_rot_z_scale = ray3_rot_z_scale;
var Connector = (function () {
    function Connector(ray, width) {
        this.ray = ray;
        this.width = width;
    }
    Connector.prototype.clone = function () {
        return new Connector(this.ray, this.width);
    };
    Connector.prototype.map = function (f) {
        var ray = cv.map_ray3(this.ray, f);
        return new Connector(ray, this.width);
    };
    /** コネクタ左端 */
    Connector.prototype.cl = function () {
        return ray3_rot_z_scale(this.ray, 90, this.width / 2).c;
    };
    /** コネクタ右端 */
    Connector.prototype.cr = function () {
        return ray3_rot_z_scale(this.ray, -90, this.width / 2).c;
    };
    return Connector;
}());
exports.Connector = Connector;
function build_connector(o, r, deg, width) {
    var d = vc.polar_to_v3(r, ut.deg_to_rad(deg), 0);
    var c = o.add(d);
    var cd = cv.ray(c, d);
    return new Connector(cd, width);
}
exports.build_connector = build_connector;
var FloorBase = (function () {
    function FloorBase(o, connectors) {
        this.o = o;
        this.connectors = connectors;
    }
    FloorBase.prototype.cn = function (i) {
        return this.connectors[i % this.connectors.length];
    };
    FloorBase.prototype.clone_update = function (o, connectors) {
        var t = this.clone();
        t.o = o;
        t.connectors = connectors;
        return t;
    };
    FloorBase.prototype.map = function (f) {
        var o = vc.v4map_v3(this.o, 1, f);
        var connectors = this.connectors.map(function (c) { return c.map(f); });
        return this.clone_update(o, connectors);
    };
    return FloorBase;
}());
exports.FloorBase = FloorBase;
var RegularFloor = (function (_super) {
    __extends(RegularFloor, _super);
    function RegularFloor(o, connectors, 
        /** 頂点数 */
        n, 
        /** 内接円半径 */
        ir, 
        /** 頂点の開始角度（0ならx軸正, 90ならy軸正） */
        deg_offset) {
        if (deg_offset === void 0) { deg_offset = 0; }
        var _this = _super.call(this, o, connectors) || this;
        _this.n = n;
        _this.ir = ir;
        _this.deg_offset = deg_offset;
        return _this;
    }
    RegularFloor.prototype.clone = function () {
        return new RegularFloor(this.o, this.connectors, this.n, this.ir, this.deg_offset);
    };
    RegularFloor.prototype.verts = function () {
        var _this = this;
        var cr = this.ir / Math.cos(ut.deg180 / this.n);
        var rad_start = ut.deg_to_rad(this.deg_offset + 180 / this.n);
        var verts = seq.arith(this.n, rad_start, ut.pi2 / this.n).map(function (rad) { return vc.polar_to_v3(cr, rad, 0); });
        return verts.map(function (v) { return v.add(_this.o); });
    };
    return RegularFloor;
}(FloorBase));
exports.RegularFloor = RegularFloor;
function floor_regular(o, 
    /** 頂点数 */
    n, 
    /** 内接円半径 */
    ir, 
    /** コネクタの幅（辺の幅と同じなら1.0, 半分なら0.5） */
    width_rate, 
    /** 頂点の開始角度（0ならx軸正, 90ならy軸正） */
    deg_offset) {
    /** コネクタの幅（辺の幅と同じなら1.0, 半分なら0.5） */
    if (width_rate === void 0) { width_rate = 1.0; }
    /** 頂点の開始角度（0ならx軸正, 90ならy軸正） */
    if (deg_offset === void 0) { deg_offset = 0; }
    var width = ir * ut.tan_deg(180 / n) * width_rate;
    var deg = function (i) { return i * 360 / n + deg_offset; };
    var connectors = seq.arith(n).map(function (i) { return build_connector(o, ir, deg(i), width); });
    return new RegularFloor(o, connectors, n, ir, deg_offset);
}
exports.floor_regular = floor_regular;
function floor_square(o, ir, width_rate, deg_offset) {
    if (width_rate === void 0) { width_rate = 1.0; }
    if (deg_offset === void 0) { deg_offset = 0; }
    return floor_regular(o, 4, ir, width_rate, deg_offset);
}
exports.floor_square = floor_square;
function floor_hexa(o, ir, width_rate, deg_offset) {
    if (width_rate === void 0) { width_rate = 1.0; }
    if (deg_offset === void 0) { deg_offset = 0; }
    return floor_regular(o, 6, ir, width_rate, deg_offset);
}
exports.floor_hexa = floor_hexa;
function calc_cross_point(cd1, cd2) {
    // 位置ベクトルと方向ベクトル取り出し
    var c11 = cd1.c;
    var c21 = cd2.c;
    var c22 = cd2.c.add(cd2.d);
    var d11_12 = cd1.d;
    var d11_21 = c21.sub(c11);
    var d11_22 = c22.sub(c11);
    var d21_22 = cd2.d;
    // cd2の始点と終点の、cd1との距離を求める
    var cross_1 = d11_12.cp(d11_21);
    var cross_2 = d11_12.cp(d11_22);
    // 距離がゼロとなる係数を求める（ゼロとならない＝平行ならnull）
    var cross_d = cross_2 - cross_1;
    if (cross_d == 0)
        return null;
    var t = cross_1 / cross_d;
    // 距離がゼロとなる位置を求める
    var c = c21.sub(d21_22.scalar(t));
    return c;
}
exports.calc_cross_point = calc_cross_point;
function calc_cross_point_v3(cd1, cd2) {
    var cd1_ = cv.ray3_to_ray2(cd1);
    var cd2_ = cv.ray3_to_ray2(cd2);
    return calc_cross_point(cd1_, cd2_);
}
exports.calc_cross_point_v3 = calc_cross_point_v3;
function build_curve_simple(c1, c2) {
    var d = c2.ray.c.sub(c1.ray.c);
    var len = d.length();
    var mid1 = c1.ray.p(len / 3);
    var mid2 = c2.ray.p(len / 3);
    var controls = [c1.ray.c, mid1, mid2, c2.ray.c];
    return cv.bezier(controls);
}
exports.build_curve_simple = build_curve_simple;
function build_curve_arc(c1, c2) {
    var oz = (c1.ray.c.z() + c2.ray.c.z()) / 2;
    var ray1 = ray3_rot_z_scale(c1.ray, 90, 1);
    var ray2 = ray3_rot_z_scale(c2.ray, 90, 1);
    var oxy = calc_cross_point_v3(ray1, ray2);
    console.log(ray1.toString());
    console.log(ray2.toString());
    console.log(oxy != null ? oxy.toString() : null);
    if (oxy == null) {
        return build_curve_simple(c1, c2);
    }
    var o = v3(oxy.x(), oxy.y(), oz);
    return cv.bezier3_interpolate_arc(c1.ray.c, c2.ray.c, o);
}
exports.build_curve_arc = build_curve_arc;
var Route = (function () {
    function Route(c1, c2, builder) {
        this.c1 = c1;
        this.c2 = c2;
        this.curve = builder(c1, c2);
    }
    /** tに対応する左, 中央, 右, 方向 */
    Route.prototype.lcrd = function (t) {
        var len1 = this.c1.width / 2;
        var len2 = this.c2.width / 2;
        var len = (1 - t) * len1 + t * len2;
        var ray = this.curve.ray(t);
        var l = cv.rot_ray3d_z(ray, ut.deg90).unit();
        var r = cv.rot_ray3d_z(ray, -ut.deg90).unit();
        return [l.p(len), ray.c, r.p(len), ray.d];
    };
    return Route;
}());
exports.Route = Route;
function route_simple(c1, c2) {
    return new Route(c1, c2, build_curve_simple);
}
exports.route_simple = route_simple;
function lch(l, c, h) {
    var name = "lch" + ut.format_02d(l) + ut.format_02d(c) + ut.format_02d(h);
    var lch = cc.clamp01(cc.lch_to_rgb01([l * 5, c * 5, h * 15]));
    return new al.Material(name, lch);
}
exports.lch = lch;
