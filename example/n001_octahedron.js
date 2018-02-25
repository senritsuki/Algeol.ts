"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var seq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
var al = require("../geometry/surface_core");
var prim = require("../geometry/primitive_surface");
var wf = require("../decoder/wavefront");
var octahedron = prim.octahedron(0.5);
var radius = 9;
var sq = [];
seq.range_step(-radius, radius, 1).forEach(function (x) {
    var dx = Math.abs(x);
    seq.range_step(-radius, radius, 1).forEach(function (y) {
        var dy = Math.abs(y);
        if (dx + dy > radius)
            return;
        seq.range_step(-radius, radius, 1).forEach(function (z) {
            var dz = Math.abs(z);
            if (dx + dy + dz > radius)
                return;
            if (dx + dy + dz < radius - 1)
                return;
            sq.push(vc.v3(x, y, z));
        });
    });
});
var duplicater = al.compose_v4map(sq, [
    function (v) { return mx.affine3_translate(v); },
]);
var octahedrons = al.duplicate_v3(octahedron.verts, 1, duplicater)
    .map(function (v) { return new al.Surfaces(v, octahedron.faces); });
wf.useBlenderCoordinateSystem();
var data = wf.geos_to_strings('./_obj/n001_octahedron', octahedrons);
var fs = require('fs');
fs.writeFile(data.objfile, data.objstrs.join('\n'), function (err) {
    if (err)
        throw err;
    console.log('save: ' + data.objfile);
});
