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
 * 楕円に内接するn角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の外接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 */
function ellipse_verts(n_gonal, r, rad) {
    return sq.arith(n_gonal, rad, ut.deg360 / n_gonal)
        .map(function (rad) { return vc.polar_to_v2(1, rad); })
        .map(function (v) { return v.el_mul(r); });
}
exports.ellipse_verts = ellipse_verts;
/*
 * 円に内接するn角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の外接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 */
function circle_verts(n_gonal, r, rad) {
    return ellipse_verts(n_gonal, vc.v2(r, r), rad);
}
exports.circle_verts = circle_verts;
/**
 * 円に外接するn角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の内接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 */
function circle_verts_c(n_gonal, r, rad) {
    var theta = ut.deg360 / (n_gonal * 2);
    var r2 = r / Math.cos(theta);
    var p2 = rad + theta;
    return circle_verts(n_gonal, r2, p2);
}
exports.circle_verts_c = circle_verts_c;
function ellipse_b2(r) {
    return function (v) {
        v = v.el_div(r);
        v = v.el_mul(v);
        return v.x + v.y <= 1;
    };
}
exports.ellipse_b2 = ellipse_b2;
function circle_b2(r) {
    return ellipse_b2(vc.v2(r, r));
}
exports.circle_b2 = circle_b2;
/**
 * 円
 * @param n_gonal   円を近似する多角形の頂点数
 * @param rad       円を近似する多角形の最初の頂点の角度（default: 0）
 * @param use_c     多角形を円に外接させるか否か（false: 内接, true: 外接, default: false）
 */
function circle(n_gonal, r, rad, use_c) {
    if (r === void 0) { r = 1; }
    if (rad === void 0) { rad = 0; }
    if (use_c === void 0) { use_c = false; }
    var f = use_c == false ? circle_verts : circle_verts_c;
    return prim.primitive2(circle_b2(r), f(n_gonal, r, rad));
}
exports.circle = circle;
function ellipse(n_gonal, r, rad) {
    if (rad === void 0) { rad = 0; }
    r = vc.to_v2_if(r);
    return prim.primitive2(ellipse_b2(r), ellipse_verts(n_gonal, r, rad));
}
exports.ellipse = ellipse;
function round4_1(x, y) {
    return [
        vc.v2(x, 0),
        vc.v2(0, y),
        vc.v2(-x, 0),
        vc.v2(0, -y),
    ];
}
exports.round4_1 = round4_1;
function round4_2(x, y) {
    return [
        vc.v2(x, y),
        vc.v2(-x, y),
        vc.v2(-x, -y),
        vc.v2(x, -y),
    ];
}
exports.round4_2 = round4_2;
/** ひし形 */
function rhombus_verts(r) {
    return round4_1(r.x, r.y);
}
exports.rhombus_verts = rhombus_verts;
/** ひし形 */
function rhombus_b2(r) {
    return function (v) {
        v = v.el_div(r);
        return Math.abs(v.x) + Math.abs(v.y) <= 1;
    };
}
exports.rhombus_b2 = rhombus_b2;
/** ひし形 */
function rhombus(r) {
    r = vc.to_v2_if(r);
    return prim.primitive2(rhombus_b2(r), rhombus_verts(r));
}
exports.rhombus = rhombus;
/**
 * 円弧
 * @param n             円弧を近似する辺の数
 * @param r             円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
function arc_verts(n, r, rad1, rad2) {
    return ellipse_arc_verts(n, vc.v2(r, r), rad1, rad2);
}
exports.arc_verts = arc_verts;
/**
 * 楕円弧
 * @param n             円弧を近似する辺の数
 * @param r             円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
function ellipse_arc_verts(n, r, rad1, rad2) {
    var step = n >= 2 ? (rad2 - rad1) / (n - 1) : 0;
    return sq.arith(n + 1, rad1, step).map(function (t) { return vc.polar_to_v2(1, t).el_mul(r); });
}
exports.ellipse_arc_verts = ellipse_arc_verts;
/**
 * パイ（円弧＋原点）
 * @param n             円弧を近似する辺の数
 * @param r             円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
function pie_verts(n, r, rad1, rad2) {
    return ellipse_arc_verts(n, vc.v2(r, r), rad1, rad2);
}
exports.pie_verts = pie_verts;
function ellipse_pie_verts(n, r, rad1, rad2) {
    return [vc.v2_zero].concat(ellipse_arc_verts(n, r, rad1, rad2));
}
exports.ellipse_pie_verts = ellipse_pie_verts;
/** 半径1のパイ */
function pie_b2(r, rad1, rad2) {
    return ellipse_pie_b2(vc.v2(r, r), rad1, rad2);
}
exports.pie_b2 = pie_b2;
function ellipse_pie_b2(r, rad1, rad2) {
    return function (v) {
        v = v.el_div(r);
        var r_r = vc.v2_to_polar(v);
        if (r_r[0] > 1)
            return false;
        var rad = ut.normalize_rad(r_r[1]);
        rad1 = ut.normalize_rad(rad1);
        rad2 = ut.normalize_rad(rad2);
        return ut.isin(rad1, rad2, rad);
    };
}
exports.ellipse_pie_b2 = ellipse_pie_b2;
function pie(n_gonal, r, rad1, rad2) {
    return prim.primitive2(pie_b2(r, rad1, rad2), pie_verts(n_gonal, r, rad1, rad2));
}
exports.pie = pie;
function ellipse_pie(n_gonal, r, rad1, rad2) {
    r = vc.to_v2_if(r);
    return prim.primitive2(ellipse_pie_b2(r, rad1, rad2), ellipse_pie_verts(n_gonal, r, rad1, rad2));
}
exports.ellipse_pie = ellipse_pie;
/** 90度のパイやドーナツの角柱化は容易だが、リングの角柱化は意外と難しい。ドーナツを一周させるか */
function ellipse_doughnut_verts(n, r1, r2) {
    var v1 = ellipse_verts(n, r1, 0);
    var v2 = ellipse_verts(n, r2, 0);
    var f = function (i) { return [v1[i], v2[i]]; };
    return sq.arith(n).map(function (i) { return f(i); });
}
exports.ellipse_doughnut_verts = ellipse_doughnut_verts;
function doughnut_verts(n, r1, r2) {
    return ellipse_doughnut_verts(n, vc.v2(r1, r1), vc.v2(r2, r2));
}
exports.doughnut_verts = doughnut_verts;
function ellipse_doughnut_b2(r1, r2) {
    var b1 = ellipse_b2(r1);
    var b2 = ellipse_b2(r2);
    return function (v) {
        return ut.xor(b1(v), b2(v));
    };
}
exports.ellipse_doughnut_b2 = ellipse_doughnut_b2;
function doughnut_b2(r1, r2) {
    return ellipse_doughnut_b2(vc.v2(r1, r1), vc.v2(r2, r2));
}
exports.doughnut_b2 = doughnut_b2;
/**
 * 穴あきパイ
 * @param n             円弧を近似する辺の数
 * @param r1            内側の円の半径
 * @param r2            外側の円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
function doughnut_pie_verts(n, r1, r2, rad1, rad2) {
    return ellipse_doughnut_pie_verts(n, vc.v2(r1, r1), vc.v2(r2, r2), rad1, rad2);
}
exports.doughnut_pie_verts = doughnut_pie_verts;
/**
 * 楕円穴あきパイ（円ドーナツの楕円化における厚みの歪み対策）
 * @param n             円弧を近似する辺の数
 * @param rx1           内側の円のx半径
 * @param ry1           内側の円のy半径
 * @param rx2           外側の円のx半径
 * @param ry2           外側の円のy半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
function ellipse_doughnut_pie_verts(n, r1, r2, rad1, rad2) {
    var arc1 = ellipse_arc_verts(n, r1, rad1, rad2);
    var arc2 = ellipse_arc_verts(n, r2, rad2, rad1);
    return arc1.concat(arc2);
}
exports.ellipse_doughnut_pie_verts = ellipse_doughnut_pie_verts;
/** 半分のひし形ドーナツ */
function rhombus_doughnut_half_verts(rx1, ry1, rx2, ry2) {
    return [
        vc.v2(rx1, 0),
        vc.v2(0, ry1),
        vc.v2(-rx1, 0),
        vc.v2(-rx2, 0),
        vc.v2(0, ry2),
        vc.v2(rx2, 0),
    ];
}
exports.rhombus_doughnut_half_verts = rhombus_doughnut_half_verts;
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
