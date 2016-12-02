"use strict";
var fs = require('fs');
var al = require("../algeol/al");
var vc = require("../algeol/math/vector");
var deg1 = Math.PI / 180;
var deg90 = Math.PI / 2;
function test() {
    {
        var geo = al.geo('empty', [], []);
        var geoText = al.geo_wavefrontObj(geo).join('\n');
        fs.writeFile("out/" + geo.name() + ".obj", geoText);
    }
    {
        var verts = [
            vc.v3(0, 0, 0),
            vc.v3(1, 0, 0),
            vc.v3(0, 1, 0),
        ];
        var faces = [
            [0, 1, 2],
        ];
        var geo = al.geo('triangle', verts, faces);
        var geoText = al.geo_wavefrontObj(geo).join('\n');
        fs.writeFile("out/" + geo.name() + ".obj", geoText);
    }
    {
        var verts = [
            vc.v3(0, 0, 0),
            vc.v3(1, 0, 0),
            vc.v3(0, 1, 0),
            vc.v3(0, 0, 1),
        ];
        var faces = [
            [0, 1, 3],
            [1, 2, 3],
            [2, 0, 3],
            [2, 1, 0],
        ];
        var geo = al.geo('triangle4', verts, faces);
        var geoText = al.geo_wavefrontObj(geo).join('\n');
        fs.writeFile("out/" + geo.name() + ".obj", geoText);
    }
    // 螺旋階段
    /**
    const curve = new Curve(
        (i) => V3.FromV2(Deg(i * 90).v2(), i),
        (i, d) => );
     */
}
test();
//# sourceMappingURL=al.js.map