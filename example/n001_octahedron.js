"use strict";
exports.__esModule = true;
var seq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
var al = require("../geometry/geo");
var prim = require("../geometry/primitive");
var wf = require("../decoder/wavefront");
var octahedron = prim.octahedron(0.5);
var radius = 9;
var sq = [];
seq.range(-radius, radius, 1).forEach(function (x) {
    var dx = Math.abs(x);
    seq.range(-radius, radius, 1).forEach(function (y) {
        var dy = Math.abs(y);
        if (dx + dy > radius)
            return;
        seq.range(-radius, radius, 1).forEach(function (z) {
            var dz = Math.abs(z);
            if (dx + dy + dz > radius)
                return;
            if (dx + dy + dz < radius - 1)
                return;
            sq.push(vc.v3(x, y, z));
        });
    });
});
var duplicater = al.compositeMap(sq, [
    function (v) { return mx.trans_m4(v); },
]);
var octahedrons = al.duplicateVertsAffine(octahedron.verts, duplicater)
    .map(function (v) { return new al.Geo(v, octahedron.faces); });
wf.useBlenderCoordinateSystem();
var data = wf.geos_to_strings('n001_octahedron', octahedrons);
var fs = require('fs');
fs.writeFile(data.objfile, data.objstrs.join('\n'), function (err) {
    if (err)
        throw err;
    console.log('save: ' + data.objfile);
});
