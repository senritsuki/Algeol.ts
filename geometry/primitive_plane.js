"use strict";
/** プリミティブオブジェクト */
Object.defineProperty(exports, "__esModule", { value: true });
var al = require("./surface_core");
var ut = require("../algorithm/utility");
var sq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var prim = require("./primitive_core");
var geometry = function (verts, faces) { return new al.Surfaces(verts, faces); };
/**
 * 円に内接するn角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の外接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 */
function circle_verts_i(n_gonal, r, rad) {
    if (rad === void 0) { rad = 0; }
    return sq.arith(n_gonal, rad, ut.deg360 / n_gonal)
        .map(function (rad) { return vc.polar_to_v2(r, rad); });
}
exports.circle_verts_i = circle_verts_i;
/**
 * 円に外接するn角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の内接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 */
function circle_verts_c(n_gonal, r, rad) {
    if (rad === void 0) { rad = 0; }
    var theta = ut.deg360 / (n_gonal * 2);
    var r2 = r / Math.cos(theta);
    var p2 = rad + theta;
    return circle_verts_i(n_gonal, r2, p2);
}
exports.circle_verts_c = circle_verts_c;
function circle_b2() {
    return function (v) {
        v = v.el_mul(v);
        return v.x + v.y <= 1;
    };
}
exports.circle_b2 = circle_b2;
/**
 * 円
 * @param n_gonal   円を近似する多角形の頂点数
 * @param rad       円を近似する多角形の最初の頂点の角度（default: 0）
 * @param use_c     多角形を円に外接させるか否か（false: 内接, true: 外接, default: false）
 */
function Circle(n_gonal, rad, use_c) {
    if (rad === void 0) { rad = 0; }
    if (use_c === void 0) { use_c = false; }
    var f = use_c == false ? circle_verts_i : circle_verts_c;
    return new prim.Plane(circle_b2(), f(n_gonal, 1, rad));
}
exports.Circle = Circle;
/**
 * 円弧
 * @param n             円弧を近似する辺の数
 * @param r             円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
function arc_verts(n, r, rad1, rad2) {
    var step = n >= 2 ? (rad2 - rad1) / (n - 1) : 0;
    return sq.arith(n + 1, rad1, step).map(function (t) { return vc.polar_to_v2(r, t); });
}
exports.arc_verts = arc_verts;
/**
 * パイ（円弧＋原点）
 * @param n             円弧を近似する辺の数
 * @param r             円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
function pie_verts(n, r, rad1, rad2) {
    return [vc.v2_zero].concat(arc_verts(n, r, rad1, rad2));
}
exports.pie_verts = pie_verts;
/** 半径1のパイ */
function pie_b2(rad1, rad2) {
    return function (v) {
        var r_r = vc.v2_to_polar(v);
        if (r_r[0] > 1)
            return false;
        var rad = ut.normalize_rad(r_r[1]);
        rad1 = ut.normalize_rad(rad1);
        rad2 = ut.normalize_rad(rad2);
        return ut.isin(rad1, rad2, rad);
    };
}
exports.pie_b2 = pie_b2;
function Pie(n_gonal, rad1, rad2) {
    return new prim.Plane(pie_b2(rad1, rad2), pie_verts(n_gonal, 1, rad1, rad2));
}
exports.Pie = Pie;
/**
 * ドーナツ
 * @param n             円弧を近似する辺の数
 * @param r             円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
function doughnut_verts(n, r1, r2, t1, t2) {
    var arc1 = arc_verts(n, r1, t1, t2);
    var arc2 = arc_verts(n, r2, t2, t1);
    return arc1.concat(arc2);
}
exports.doughnut_verts = doughnut_verts;
function to_v3_xy(z) {
    if (z === void 0) { z = 0; }
    return function (v) { return vc.v3(v.x, v.y, z); };
}
exports.to_v3_xy = to_v3_xy;
function to_v3_xz(y) {
    if (y === void 0) { y = 0; }
    return function (v) { return vc.v3(v.x, y, v.y); };
}
exports.to_v3_xz = to_v3_xz;
function plane(verts, f) {
    return geometry(verts.map(function (v) { return f(v); }), [verts.map(function (_, i) { return i; })]);
}
exports.plane = plane;
function extrude(verts, z) {
    var len = verts.length;
    var new_verts_1 = verts.map(function (v) { return vc.v2_to_v3(v, 0); });
    var new_verts_2 = verts.map(function (v) { return vc.v2_to_v3(v, z); });
    var new_verts = new_verts_1.concat(new_verts_2);
    var new_face_1 = sq.arith(len);
    var new_face_2 = sq.arith(len, len);
    var new_side_faces = sq.arith(len).map(function (n) { return [n, (n + 1) % len, len + (n + 1) % len, len + n]; });
    var new_faces = [];
    new_faces.push(new_face_1);
    new_faces.push(new_face_2);
    new_side_faces.forEach(function (f) { return new_faces.push(f); });
    return geometry(new_verts, new_faces);
}
exports.extrude = extrude;
