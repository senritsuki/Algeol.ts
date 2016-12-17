var fs = require('fs');
var wo = require("../../algeol/presets/format_wavefrontobj");
var prim = require("../../algeol/presets/geo_primitive");
function write(name, geo) {
    var path = "test_geo_primitive/" + name + ".obj";
    fs.writeFile(path, wo.geo_str(geo));
    console.log('save: ' + path);
}
function test() {
    write('tetrahedron', prim.tetrahedron());
    write('octahedron', prim.octahedron());
    write('cube', prim.cube());
    write('dodecahedron', prim.dodecahedron());
    write('icosahedron', prim.icosahedron());
    write('prism', prim.prism(8));
    write('pyramid', prim.pyramid(8));
    write('bipyramid', prim.bipyramid(8));
}
test();
//# sourceMappingURL=test_geo_primitive.js.map