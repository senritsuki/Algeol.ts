var fs = require('fs');
var al = require("../algeol/al");
var li = require("../algeol/seqlim");
var ut = require("../algeol/math/util");
var vc = require("../algeol/math/vector");
var mx = require("../algeol/math/matrix");
var wo = require("../algeol/presets/format_wavefrontobj");
var prim = require("../algeol/presets/prim_old");
var deg1 = Math.PI / 180;
var deg90 = Math.PI / 2;
var exportGeo = function (geo, name) {
    fs.writeFile("al_out/" + name + ".obj", wo.geo_str(geo));
};
var exportGeos = function (geos, name) {
    //fs.writeFile(`al_out/${name}.obj`, wo.geogroup_str(al.geoGroup(name, geos)));
};
function testLimObj() {
    {
        var limobj = al.limobj(prim.octahedron(), []);
        exportGeos(limobj.geo(), 'empty');
    }
    {
        var limobj1 = al.limobj(prim.octahedron(), [
            li.lim(mx.scale_m4(0.5, 0.5, 1)),
            li.lim(mx.trans_m4(5, 0, 1)),
            li.seqlim(ut._arithobj(8, 0, ut.pi2 / 8), function (i) { return mx.rotZ_m4(i); }),
        ]);
        var limobj2 = al.limobj(prim.cube(), [
            li.lim(mx.scale_m4(0.5, 0.5, 0.5)),
            li.lim(mx.trans_m4(5, 0, 0.5)),
            li.seqlim(ut._arithobj(8, ut.pi2 / 16, ut.pi2 / 8), function (i) { return mx.rotZ_m4(i); }),
        ]);
        exportGeos(limobj1.geo().concat(limobj2.geo()), 'seqlim');
    }
}
function testGeo() {
    {
        var geo = al.geo([], []);
        exportGeo(geo, 'empty');
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
        var geo = al.geo(verts, faces);
        exportGeo(geo, 'triangle');
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
        var geo = al.geo(verts, faces);
        exportGeo(geo, 'triangle4');
    }
    // 螺旋階段
    /**
    const curve = new Curve(
        (i) => V3.FromV2(Deg(i * 90).v2(), i),
        (i, d) => );
     */
}
//testGeo();
testLimObj();
//# sourceMappingURL=al.js.map