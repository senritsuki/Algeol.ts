"use strict";
/** プリミティブオブジェクト */
Object.defineProperty(exports, "__esModule", { value: true });
var al = require("./geo");
var ut = require("../algorithm/utility");
var sq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var v3 = vc.v3;
var v2_polar = vc.polar_to_v2;
var geometry = function (verts, faces) { return new al.Geo(verts, faces); };
/** Polygon - 多角形 */
var polygon;
(function (polygon) {
    /**
     * 円に内接するn角形
     * @param   n_gonal     多角形の頂点数
     * @param   r           多角形の外接円の半径
     * @param   t           多角形の1つ目の頂点の偏角
     */
    function verts_i(n_gonal, r, t) {
        if (t === void 0) { t = 0; }
        return sq.arith(n_gonal, t, ut.deg360 / n_gonal)
            .map(function (rad) { return v2_polar(r, rad); });
    }
    polygon.verts_i = verts_i;
    /**
     * 円に外接するn角形
     * @param   n_gonal     多角形の頂点数
     * @param   r           多角形の内接円の半径
     * @param   t           多角形の1つ目の頂点の偏角
     */
    function verts_c(n_gonal, r, t) {
        if (t === void 0) { t = 0; }
        var theta = ut.deg360 / (n_gonal * 2);
        var r2 = r / Math.cos(theta);
        var p2 = t + theta;
        return verts_i(n_gonal, r2, p2);
    }
    polygon.verts_c = verts_c;
})(polygon = exports.polygon || (exports.polygon = {}));
function arc(n, r, t1, t2) {
    var step = n >= 2 ? (t2 - t1) / (n - 1) : 0;
    return sq.arith(n, t1, step).map(function (t) { return v2_polar(r, t); });
}
exports.arc = arc;
function pie(n, r, t1, t2) {
    return [vc.v2_zero].concat(arc(n, r, t1, t2));
}
exports.pie = pie;
function doughnut(n, r1, r2, t1, t2) {
    var arc1 = arc(n, r1, t1, t2);
    var arc2 = arc(n, r2, t2, t1);
    return arc1.concat(arc2);
}
exports.doughnut = doughnut;
/** 円に内接するn角形 */
function circle_i(n_gonal, r, t) {
    if (t === void 0) { t = 0; }
    return polygon.verts_i(n_gonal, r, t);
}
exports.circle_i = circle_i;
/** 円に外接するn角形 */
function circle_c(n_gonal, r, t) {
    if (t === void 0) { t = 0; }
    var theta = ut.deg360 / (n_gonal * 2);
    var r2 = r / Math.cos(theta);
    var p2 = t + theta;
    return circle_i(n_gonal, r2, p2);
}
exports.circle_c = circle_c;
function to_v3_xy(z) {
    if (z === void 0) { z = 0; }
    return function (v) { return v3(v.x(), v.y(), z); };
}
exports.to_v3_xy = to_v3_xy;
function to_v3_xz(y) {
    if (y === void 0) { y = 0; }
    return function (v) { return v3(v.x(), y, v.y()); };
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
