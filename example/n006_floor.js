"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// テーマ：森の隠れ家
var ut = require("../algorithm/utility");
var seq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
var al = require("../geometry/geo");
var prim = require("../geometry/primitive");
var prim2 = require("../geometry/primitive2");
var lib = require("./n005_lib");
var wf = require("../decoder/wavefront");
var saver = require("./n003_save");
var v3 = vc.v3;
var BottomZ = -100;
function geo_rfloor_simple(floor) {
    var o = v3(floor.o.x(), floor.o.y(), 0);
    var verts = floor.verts().map(function (v) { return v.sub(o); });
    var geo = lib.xygeo_z_scale_rot(verts, [
        v3(0, 1, 0),
        v3(-1 / 8, 1, 0),
        v3(-1, 1 / 8, 0),
        v3(BottomZ, 1 / 8, 0),
    ]);
    return al.translate(geo, o);
}
exports.geo_rfloor_simple = geo_rfloor_simple;
function geo_route_planes(route, n) {
    var lcrd = seq.range(0, 1, n + 1).map(function (t) { return route.lcrd(t); });
    var bases = seq.arith(n).map(function (i) {
        var d1 = lcrd[i];
        var d2 = lcrd[i + 1];
        var z = d1[1].z();
        var base = [d1[0], d1[2], d2[2], d2[0]];
        return prim.plane_xy(base, z);
    });
    return al.merge_geos(bases);
}
exports.geo_route_planes = geo_route_planes;
function save(objs) {
    var result = wf.objs_to_strings('./_obj/n006', objs);
    saver.save_objmtl(result);
}
exports.save = save;
function main() {
    var square = lib.floor_square(v3(0, 0, 3), 1);
    var duplicate_square = al.compose_v4map(seq.arith(4), [
        function (_) { return mx.trans_m4(v3(5, 0, 0)); },
        function (i) { return mx.rot_z_m4(ut.deg90 * i); },
    ]);
    var squares = al.duplicate_f(square, duplicate_square);
    var geos_square = squares.map(function (rf) { return geo_rfloor_simple(rf); });
    var routes = squares.map(function (_, i) { return lib.route_simple(squares[i].connectors[0], squares[(i + 1) % squares.length].connectors[3], 5); });
    var geos_route = routes.map(function (route) { return geo_route_planes(route, 24); });
    var geo_plane = prim2.plane(prim2.circle_i(24, 10), prim2.to_v3_xy(0));
    save([
        al.geos_to_obj(geos_square, lib.lch(18, 0, 0)),
        al.geos_to_obj(geos_route, lib.lch(17, 0, 0)),
        al.geo_to_obj(geo_plane, lib.lch(17, 5, 17)),
    ]);
}
exports.main = main;
function test_build_curve1() {
    var square1 = lib.floor_square(v3(0, 0, 0), 1);
    var square2 = lib.floor_square(v3(5, 3, 0), 1);
    var route1 = lib.route_arc(square1.cn(0), square2.cn(3));
    var route2 = lib.route_simple(square1.cn(1), square2.cn(1), null);
    save([
        al.geo_to_obj(geo_route_planes(route1, 24), null),
        al.geo_to_obj(geo_route_planes(route2, 24), null),
    ]);
    // ok
}
exports.test_build_curve1 = test_build_curve1;
function test_build_curve2() {
    var square1 = lib.floor_square(v3(0, 5, 3), 1);
    var square2 = lib.floor_square(v3(-5, 0, 3), 1);
    var route = lib.route_simple(square1.connectors[2], square2.connectors[1], null);
    save([
        al.geo_to_obj(geo_route_planes(route, 24), null),
    ]);
    // ok
}
exports.test_build_curve2 = test_build_curve2;
function test_build_curve3() {
    var square = lib.floor_square(v3(0, 0, 3), 1);
    console.log(square.connectors[0].toString());
    console.log(square.connectors[3].toString());
    var duplicate_square = al.compose_v4map(seq.arith(2), [
        function (_) { return mx.trans_m4(v3(5, 0, 0)); },
        function (i) { return mx.rot_z_m4(ut.deg90 * i); },
    ]);
    var squares = al.duplicate_f(square, duplicate_square);
    var route = lib.route_simple(squares[0].connectors[0], squares[1].connectors[3], null);
    console.log(route.curve.toString());
    console.log(route.c1.toString());
    console.log(route.c2.toString());
    save([
        al.geos_to_obj(squares.map(function (rf) { return geo_rfloor_simple(rf); }), lib.lch(18, 0, 0)),
        al.geo_to_obj(geo_route_planes(route, 24), lib.lch(17, 0, 0)),
    ]);
}
exports.test_build_curve3 = test_build_curve3;
main();
//test_build_curve1();
//test_build_curve2();
//test_build_curve3();
