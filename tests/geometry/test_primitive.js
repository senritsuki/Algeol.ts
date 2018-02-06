"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var prim = require("../../geometry/primitive_surface");
var wo = require("../../decoder/wavefront");
function save(name, geo) {
    var dir = 'test_geo_primitive/';
    var data = wo.geos_to_strings(name, [geo]);
    var path = dir + data.objfile;
    fs.writeFile(path, data.objstrs);
    console.log('save: ' + path);
}
function test() {
    save('tetrahedron', prim.tetrahedron(1));
    save('octahedron', prim.octahedron(1));
    save('cube', prim.cube(1));
    save('dodecahedron', prim.dodecahedron(1));
    save('icosahedron', prim.icosahedron(1));
    save('prism', prim.prism(8, 1, 2));
    save('pyramid', prim.pyramid(8, 1, 2));
    save('bipyramid', prim.bipyramid(8, 1, 1, 1));
}
test();
