"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vc = require("../algorithm/vector");
var sfl = require("./surface_lib");
var prim = require("./primitive_core");
var prism_z_min = 0;
var prism_z_max = 1;
/** 任意の平面形状の角柱 */
function Prism(p2) {
    return prim.primitive3(function (v) {
        if (v.z < prism_z_min || v.z > prism_z_max)
            return false;
        return p2.bool(vc.v3_to_v2(v));
    }, function () { return sfl.extrude2(p2.verts, prism_z_max); });
}
exports.Prism = Prism;
/** 任意の平面形状の角錐 */
function Cone(p2) {
    return prim.primitive3(function (v) {
        if (v.z < prism_z_min || v.z > prism_z_max)
            return false;
        if (v.z == prism_z_max) {
            v = vc.v3(0, 0, prism_z_max);
        }
        else {
            v = v.scalar(1 / (prism_z_max - v.z));
        }
        return p2.bool(vc.v3_to_v2(v));
    }, function () { return sfl.extrude2_cone(p2.verts, prism_z_max); });
}
exports.Cone = Cone;
/** 半径1の円に外接する正方形 */
function b2_square(v) {
    return Math.max(Math.abs(v.x), Math.abs(v.y)) <= 1;
}
exports.b2_square = b2_square;
/** 半径1の円に内接するひし形 */
function b2_rhombus(v) {
    return Math.abs(v.x) + Math.abs(v.y) <= 1;
}
exports.b2_rhombus = b2_rhombus;
