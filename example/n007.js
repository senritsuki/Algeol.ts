"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("../algorithm/utility");
var seq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
var cv = require("../algorithm/curve");
var al = require("../geometry/surface_core");
var lib = require("./n005_lib");
var wf = require("../decoder/wavefront");
var saver = require("./n003_save");
var v3 = vc.v3;
lib.config_bottom_z(-500);
function save(objs) {
    saver.save_objmtl(wf.objs_to_strings('./_obj/n007', objs));
}
exports.save = save;
function at(tt, i) {
    return tt[i % tt.length];
}
exports.at = at;
function fz_circle(n, height) {
    var height_step = height * 2 / n;
    return function (i) { return Math.abs(n / 2 - i) * height_step; };
}
exports.fz_circle = fz_circle;
function route_arc_o(c1, c2) {
    var p1 = c1.ray.c;
    var p2 = c2.ray.c;
    var o = v3(0, 0, (p1.z + p2.z) / 2);
    return new lib.Route(c1, c2, cv.bezier3_interpolate_arc(p1, p2, o));
}
exports.route_arc_o = route_arc_o;
function dupl_circle(n, r, fz, con1, con2) {
    return function (floor) {
        var floors = al.duplicate_f(floor, al.compose_v4map(seq.arith(n), [
            function (i) { return mx.affine3_trans(v3(0, r, fz(i))); },
            function (i) { return mx.affine3_rot_z(ut.deg360 / n * -i); },
        ]));
        var routes = floors.map(function (_, i) { return lib.route_arc(at(floors, i + 1).con(con2), at(floors, i).con(con1)); });
        return [floors, routes];
    };
}
exports.dupl_circle = dupl_circle;
exports.dupl_circle_square = function (n, r, fz) { return dupl_circle(n, r, fz, 0, 2); };
exports.dupl_circle_hexa = function (n, r, fz) { return dupl_circle(n, r, fz, 0, 3); };
function dupl_arc(n, r, deg1, deg2, fz, con1, con2) {
    var rad_1 = ut.deg_to_rad(deg1);
    var rad_d = ut.deg_to_rad((deg2 - deg1) / (n - 1));
    return function (floor) {
        var floors = al.duplicate_f(floor, al.compose_v4map(seq.arith(n), [
            function (i) { return mx.affine3_trans(v3(0, r, fz(i))); },
            function (i) { return mx.affine3_rot_z(rad_1 + rad_d * i); },
        ]));
        var routes = floors.map(function (_, i) { return lib.route_arc(at(floors, i).con(con1), at(floors, i + 1).con(con2)); });
        return [floors, routes];
    };
}
exports.dupl_arc = dupl_arc;
exports.dupl_arc_square = function (n, r, deg1, deg2, fz) { return dupl_arc(n, r, deg1, deg2, fz, 2, 0); };
exports.dupl_arc_hexa = function (n, r, deg1, deg2, fz) { return dupl_arc(n, r, deg1, deg2, fz, 3, 0); };
function dupl_lines(n, r, fz, con1, con2) {
    return function (floor) {
        var floors = al.duplicate_f(floor, al.compose_v4map(seq.arith(n), [
            function (_) { return mx.affine3_rot_z(ut.deg180 / floor.n); },
            function (i) { return mx.affine3_trans(v3(0, r, fz(i))); },
            function (i) { return mx.affine3_rot_z(ut.deg360 / n * -i); },
        ]));
        var routes = floors.map(function (_, i) { return lib.route_curve(at(floors, i + 1).con(con2), at(floors, i).con(con1), null); });
        return [floors, routes];
    };
}
exports.dupl_lines = dupl_lines;
exports.dupl_lines_square = function (n, r, fz) { return dupl_lines(n, r, fz, 3, 2); };
exports.dupl_lines_hexa = function (n, r, fz) { return dupl_lines(n, r, fz, 5, 3); };
function floor_simple() {
    return function (floor) { return lib.geo_rfloor_simple(floor); };
}
exports.floor_simple = floor_simple;
function route_arc(n, d) {
    return function (route) { return lib.geo_route_stairs(route, n, d); };
}
exports.route_arc = route_arc;
function geo_floors_routes(floor, dupl, geo_floor, geo_route) {
    var floor_route = dupl(floor);
    var geo_floors = floor_route[0].map(function (floor) { return geo_floor(floor); });
    var geo_routes = floor_route[1].map(function (route) { return geo_route(route); });
    return [geo_floors, geo_routes];
}
exports.geo_floors_routes = geo_floors_routes;
function main() {
    var square = lib.floor_square(v3(0, 0, 1), 1);
    var hexa = lib.floor_hexa(v3(0, 0, 1), 1);
    var stair_d = 1 / 8;
    var fr_circle12 = geo_floors_routes(hexa, exports.dupl_circle_hexa(12, 10, fz_circle(12, 12)), floor_simple(), route_arc(12, stair_d));
    var fr_circle4 = geo_floors_routes(square, exports.dupl_lines_square(4, 5, fz_circle(4, 12)), floor_simple(), route_arc(12, stair_d));
    var m_floor = lib.lch(20, 0, 1);
    var m_route = lib.lch(20, 0, 11);
    save([
        al.merge_surfaces(fr_circle12[0], m_floor),
        al.merge_surfaces(fr_circle12[1], m_route),
        al.merge_surfaces(fr_circle4[0], m_floor),
        al.merge_surfaces(fr_circle4[1], m_route),
    ]);
}
exports.main = main;
main();
