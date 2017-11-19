"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var prim = require("../../geometry/primitive");
var wo = require("../../decoder/wavefront");
function save(name, geo) {
    var path = "test_geo_primitive/" + name + ".obj";
    fs.writeFile(path, wo.geo_str(geo));
    console.log('save: ' + path);
}
exports.save = save;
function test() {
    save('tetrahedron', prim.tetrahedron());
    save('octahedron', prim.octahedron());
    save('cube', prim.cube());
    save('dodecahedron', prim.dodecahedron());
    save('icosahedron', prim.icosahedron());
    save('prism', prim.prism(8));
    save('pyramid', prim.pyramid(8));
    save('bipyramid', prim.bipyramid(8));
}
exports.test = test;
test();
