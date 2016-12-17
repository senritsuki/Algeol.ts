var fs = require('fs');
var vc = require("../../algeol/math/vector");
var wo = require("../../algeol/presets/format_wavefrontobj");
var prim = require("../../algeol/presets/prim_old");
var dummy = prim;
// 簡易目視テスト
function test() {
    var exportGeo = function (obj, name) {
        fs.writeFile("prim_out/" + name + ".obj", wo.geo_str(obj.geo()));
    };
    {
        console.log('polygon');
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
        var obj = prim.polygon(verts, faces);
        console.log(obj);
        exportGeo(obj, 'polygon');
    }
    var testObj = function (name, fn) {
        console.log(name);
        var obj = fn();
        console.log(obj);
        exportGeo(obj, name);
    };
    testObj('tetrahedron', prim.tetrahedron);
    testObj('octahedron', prim.octahedron);
    testObj('cube', prim.cube);
    testObj('dodecahedron', prim.dodecahedron);
    testObj('icosahedron', prim.icosahedron);
}
test();
//# sourceMappingURL=prim_old.js.map