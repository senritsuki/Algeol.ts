"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var ut = require("../../algorithm/utility");
var seq = require("../../algorithm/sequence");
var vc = require("../../algorithm/vector");
var mx = require("../../algorithm/matrix");
var al = require("../../geometry/surface_core");
var prim = require("../../geometry/primitive_surface");
var multi = require("../../geometry/surface_lib");
var wo = require("../../decoder/wavefront");
function save(name, geo) {
    var dir = 'test_geo_multi/';
    var data = wo.geos_to_strings(name, [geo]);
    var path = dir + data.objfile;
    fs.writeFile(path, data.objstrs.join('\n'));
    console.log('save: ' + path);
}
function test_al() {
    al.duplicate_v3([vc.v3(0, 0, 0), vc.v3(1, 0, 0)], 1, al.m4s_to_v4maps([mx.affine3_translate([1, 0, 0]), mx.affine3_translate([2, 0, 0])])).forEach(function (vv) { return vv.forEach(function (v) { return console.log(v); }); });
    al.compose_m4([0, 1], [
        function (d) { return mx.affine3_translate([d + 1, 0, 0]); },
        function (_d) { return mx.affine3_scale([2, 2, 2]); },
        function (d) { return mx.affine3_translate([0, d + 1, 0]); },
    ]).forEach(function (m) { return console.log(m); });
}
exports.test_al = test_al;
function test() {
    save('prismArray', multi.prismArray([
        prim.fn.circle.verts_i(8, 1, 0, 0),
        prim.fn.circle.verts_i(8, ut.r3, 0, 1),
        prim.fn.circle.verts_i(8, 2, 0, 2),
        prim.fn.circle.verts_i(8, ut.r3, 0, 3),
        prim.fn.circle.verts_i(8, 1, 0, 4),
    ]));
    save('antiprismArray-0', multi.antiprismArray([
        prim.fn.circle.verts_i(4, 1, ut.deg1 * 0, 0),
        prim.fn.circle.verts_i(4, 1, ut.deg1 * 45, 1),
    ]));
    save('antiprismArray-1', multi.antiprismArray(seq.arith(5).map(function (i) {
        return prim.fn.circle.verts_i(6, 1, ut.deg30 * i, i);
    })));
    save('antiprismArray-2', multi.antiprismArray(seq.arith(5).map(function (i) {
        return prim.fn.circle.verts_i(6, 1, ut.deg30 * i * 3, i);
    })));
    save('prismArray_pyramid', multi.prismArray_pyramid([
        prim.fn.circle.verts_c(4, 2.0, 0, 0),
        prim.fn.circle.verts_c(4, 1.6, 0, 0.4),
        prim.fn.circle.verts_c(4, 1.2, 0, 1.2),
        prim.fn.circle.verts_c(4, 0.8, 0, 2.8),
        prim.fn.circle.verts_c(4, 0.4, 0, 6.0),
    ], vc.v3(0, 0, 12.4)));
    save('antiprismArray_pyramid', multi.prismArray_pyramid([
        prim.fn.circle.verts_c(4, 2.0, 0, 0),
        prim.fn.circle.verts_i(4, 1.5, ut.deg90, 0.6),
        prim.fn.circle.verts_c(4, 1.0, ut.deg90, 1.8),
        prim.fn.circle.verts_i(4, 0.5, ut.deg90 * 2, 4.2),
    ], vc.v3(0, 0, 9.0)));
    save('prismArray_bipyramid', multi.prismArray_bipyramid(seq.arith(5, ut.deg30, ut.deg30).map(function (rad) { return prim.fn.circle.verts_i(12, 2 * Math.sin(rad), 0, 2 * -Math.cos(rad)); }), vc.v3(0, 0, -2), vc.v3(0, 0, 2)));
    save('antiprismArray_bipyramid', multi.antiprismArray_bipyramid(seq.arith(5, ut.deg30, ut.deg30).map(function (rad) { return prim.fn.circle.verts_i(12, 2 * Math.sin(rad), rad / 2, 2 * -Math.cos(rad)); }), vc.v3(0, 0, -2), vc.v3(0, 0, 2)));
    save('prismRing', multi.prismRing(al.duplicate_v3(prim.fn.circle.verts_i(4, 1), 1, al.compose_v4map(seq.arith(4), [
        function (_d) { return mx.affine3_rotate_x(ut.deg90); },
        function (_d) { return mx.affine3_translate([3, 0, 0]); },
        function (d) { return mx.affine3_rotate_z(ut.deg90 * d); },
    ]))));
    save('antiprismRing', multi.antiprismRing(al.duplicate_v3(prim.fn.circle.verts_i(4, 1), 1, al.compose_v4map(seq.arith(8), [
        function (d) { return mx.affine3_rotate_z(ut.deg45 * d); },
        function (_d) { return mx.affine3_rotate_x(ut.deg90); },
        function (_d) { return mx.affine3_translate([3, 0, 0]); },
        function (d) { return mx.affine3_rotate_z(ut.deg45 * d); },
    ]))));
}
test();
