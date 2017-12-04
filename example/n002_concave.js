"use strict";
exports.__esModule = true;
var seq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
var al = require("../geometry/geo");
var prim = require("../geometry/primitive");
var wf = require("../decoder/wavefront");
var cube = prim.cube(0.5);
var sq = seq.arith(21, -10, 1).map(function (x) { return seq.arith(21, -10, 1).map(function (y) { return vc.v2(x, y); }); })
    .reduce(function (a, b) { return a.concat(b); });
var duplicater = al.compositeMap(sq, [
    function (v) { return mx.trans_m4([v.x(), v.y(), 0.5]); },
    function (v) { return mx.scale_m4([1, 1, 1 + Math.min(9, v.length())]); },
]);
var cubes = al.duplicateVertsAffine(cube.verts, duplicater)
    .map(function (v) { return new al.Geo(v, cube.faces); });
wf.useBlenderCoordinateSystem();
var data = wf.geos_to_strings('work0001_cave', cubes);
var fs = require('fs');
fs.writeFile(data.objfile, data.objstrs.join('\n'), function (err) {
    if (err)
        throw err;
    console.log('save: ' + data.objfile);
});
