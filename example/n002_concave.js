"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var seq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
var al = require("../geometry/surface_core");
var prim = require("../geometry/primitive_surface");
var wf = require("../decoder/wavefront");
var cube = prim.cube(0.5);
var sq = seq.arith(21, -10, 1).map(function (x) { return seq.arith(21, -10, 1).map(function (y) { return vc.v2(x, y); }); })
    .reduce(function (a, b) { return a.concat(b); });
var duplicater = al.compose_v4map(sq, [
    function (v) { return mx.affine3_translate([v.x, v.y, 0.5]); },
    function (v) { return mx.affine3_scale([1, 1, 1 + Math.min(12, v.length())]); },
]);
var cubes = al.duplicate_v3(cube.verts, 1, duplicater)
    .map(function (v) { return new al.Surfaces(v, cube.faces); });
wf.useBlenderCoordinateSystem();
var data = wf.geos_to_strings('./_obj/w001_concave', cubes);
var fs = require('fs');
fs.writeFile(data.objfile, data.objstrs.join('\n'), function (err) {
    if (err)
        throw err;
    console.log('save: ' + data.objfile);
});
