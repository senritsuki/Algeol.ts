var fs = require('fs');
var al = require("../../algeol/al");
var vc = require("../../algeol/math/vector");
var prim = require("../../algeol/presets/prim");
var dummy = prim;
// 簡易目視テスト
function test() {
    var exportGeo = function (obj, name) {
        fs.writeFile("prim/" + name + ".obj", al.geo_wavefrontObj(obj.geo()).join('\n'));
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
    {
        console.log('tetrahedron');
        var obj = prim.tetrahedron();
        console.log(obj);
        exportGeo(obj, 'tetrahedron');
    }
}
test();
//# sourceMappingURL=prim.js.map