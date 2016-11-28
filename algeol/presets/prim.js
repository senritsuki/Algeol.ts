var al = require("../al");
var vc = require("../math/vector");
var mx = require("../math/matrix");
var deg120_c = Math.cos(120 * Math.PI / 180);
var deg120_s = Math.sin(120 * Math.PI / 180);
var deg240_c = Math.cos(240 * Math.PI / 180);
var deg240_s = Math.sin(240 * Math.PI / 180);
var tetrahedron_rad = Math.acos(-1 / 3); // 半径:高さ = 3:4
var tetrahedron_c = Math.cos(tetrahedron_rad);
var tetrahedron_s = Math.sin(tetrahedron_rad);
/** Polygon - 多角形 */
function polygon(verts, faces) {
    return al.obj('polygon', verts, function (name, verts) {
        return al.geo(name, verts, faces);
    });
}
exports.polygon = polygon;
/** Tetrahedron - 正4面体 */
function tetrahedron(sp) {
    if (sp === void 0) { sp = al.default_space; }
    var orig_vers = [
        vc.v3(0, 0, 1),
        vc.v3(0, tetrahedron_s, tetrahedron_c),
        vc.v3(deg120_s, deg120_c * tetrahedron_s, tetrahedron_c),
        vc.v3(deg240_s, deg240_c * tetrahedron_s, tetrahedron_c),
    ];
    var faces = [
        [0, 1, 2],
        [0, 2, 3],
        [0, 3, 1],
        [3, 2, 1],
    ];
    return al.obj('tetrahedron', sp.array(), function (name, verts) {
        return al.geo(name, mx.map_m4_v3(orig_vers, al.ar_space(verts).m4()), faces);
    });
}
exports.tetrahedron = tetrahedron;
//# sourceMappingURL=prim.js.map