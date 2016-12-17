var al = require("../al");
var ut = require("../math/util");
var vc = require("../math/vector");
var fn;
(function (fn) {
    var deg120_c = ut.cos(120 * ut.pi / 180);
    var deg120_s = ut.sin(120 * ut.pi / 180);
    var deg240_c = ut.cos(240 * ut.pi / 180);
    var deg240_s = ut.sin(240 * ut.pi / 180);
    var tetrahedron_rad = ut.acos(-1 / 3); // 半径:高さ = 3:4
    var tetrahedron_c = ut.cos(tetrahedron_rad);
    var tetrahedron_s = ut.sin(tetrahedron_rad);
    var tetrahedron;
    (function (tetrahedron) {
        function verts(x, y, z) {
            return [
                vc.v3(0, 0, z),
                vc.v3(x * tetrahedron_s, 0, z * tetrahedron_c),
                vc.v3(x * tetrahedron_s * deg120_c, y * tetrahedron_s * deg120_s, z * tetrahedron_c),
                vc.v3(x * tetrahedron_s * deg240_c, y * tetrahedron_s * deg240_s, z * tetrahedron_c),
            ];
        }
        tetrahedron.verts = verts;
        function faces() {
            return [
                [0, 1, 2],
                [0, 2, 3],
                [0, 3, 1],
                [3, 2, 1],
            ];
        }
        tetrahedron.faces = faces;
    })(tetrahedron = fn.tetrahedron || (fn.tetrahedron = {}));
    var octahedron;
    (function (octahedron) {
        function verts(x, y, z) {
            return [
                vc.v3(0, 0, z),
                vc.v3(x, 0, 0),
                vc.v3(0, y, 0),
                vc.v3(-x, 0, 0),
                vc.v3(0, -y, 0),
                vc.v3(0, 0, -z),
            ];
        }
        octahedron.verts = verts;
        function faces() {
            return [
                [1, 2, 0],
                [2, 3, 0],
                [3, 4, 0],
                [4, 1, 0],
                [1, 4, 5],
                [4, 3, 5],
                [3, 2, 5],
                [2, 1, 5],
            ];
        }
        octahedron.faces = faces;
    })(octahedron = fn.octahedron || (fn.octahedron = {}));
    var cube;
    (function (cube) {
        function verts(x, y, z) {
            return [
                vc.v3(x, y, z),
                vc.v3(-x, y, z),
                vc.v3(-x, -y, z),
                vc.v3(x, -y, z),
                vc.v3(x, y, -z),
                vc.v3(-x, y, -z),
                vc.v3(-x, -y, -z),
                vc.v3(x, -y, -z),
            ];
        }
        cube.verts = verts;
        function faces() {
            return [
                [0, 1, 2, 3],
                [7, 6, 5, 4],
                [4, 5, 1, 0],
                [5, 6, 2, 1],
                [6, 7, 3, 2],
                [7, 4, 0, 3],
            ];
        }
        cube.faces = faces;
    })(cube = fn.cube || (fn.cube = {}));
    var trirect;
    (function (trirect) {
        function verts(s, l) {
            return [
                vc.v3(l, s, 0),
                vc.v3(-l, s, 0),
                vc.v3(-l, -s, 0),
                vc.v3(l, -s, 0),
                vc.v3(0, l, s),
                vc.v3(0, -l, s),
                vc.v3(0, -l, -s),
                vc.v3(0, l, -s),
                vc.v3(s, 0, l),
                vc.v3(s, 0, -l),
                vc.v3(-s, 0, -l),
                vc.v3(-s, 0, l),
            ];
        }
        trirect.verts = verts;
    })(trirect = fn.trirect || (fn.trirect = {}));
    var dodecahedron;
    (function (dodecahedron) {
        function verts(r) {
            var c = r / ut.r3;
            var s = c / ut.phi;
            var l = c * ut.phi;
            return fn.trirect.verts(s, l).concat(fn.cube.verts(c, c, c));
        }
        dodecahedron.verts = verts;
        function faces() {
            var xy = ut.seq.arith(4, 0);
            var yz = ut.seq.arith(4, 4);
            var zx = ut.seq.arith(4, 8);
            var ct = ut.seq.arith(4, 12);
            var cb = ut.seq.arith(4, 16);
            return [
                [xy[0], ct[0], zx[0], ct[3], xy[3]],
                [xy[3], cb[3], zx[1], cb[0], xy[0]],
                [xy[2], ct[2], zx[3], ct[1], xy[1]],
                [xy[1], cb[1], zx[2], cb[2], xy[2]],
                [yz[2], cb[3], xy[3], ct[3], yz[1]],
                [yz[1], ct[2], xy[2], cb[2], yz[2]],
                [yz[0], ct[0], xy[0], cb[0], yz[3]],
                [yz[3], cb[1], xy[1], ct[1], yz[0]],
                [zx[3], ct[2], yz[1], ct[3], zx[0]],
                [zx[0], ct[0], yz[0], ct[1], zx[3]],
                [zx[1], cb[3], yz[2], cb[2], zx[2]],
                [zx[2], cb[1], yz[3], cb[0], zx[1]],
            ];
        }
        dodecahedron.faces = faces;
    })(dodecahedron = fn.dodecahedron || (fn.dodecahedron = {}));
    var icosahedron;
    (function (icosahedron) {
        function verts(r) {
            var s = r / ut.sqrt(2 + ut.phi); // 0^2 + 1^2 + ut.phi^2
            var l = s * ut.phi;
            return fn.trirect.verts(s, l);
        }
        icosahedron.verts = verts;
        function faces() {
            var xy = ut.seq.arith(4, 0);
            var yz = ut.seq.arith(4, 4);
            var zx = ut.seq.arith(4, 8);
            return [
                [xy[0], zx[0], xy[3]],
                [xy[3], zx[1], xy[0]],
                [xy[2], zx[3], xy[1]],
                [xy[1], zx[2], xy[2]],
                [yz[2], xy[3], yz[1]],
                [yz[1], xy[2], yz[2]],
                [yz[0], xy[0], yz[3]],
                [yz[3], xy[1], yz[0]],
                [zx[3], yz[1], zx[0]],
                [zx[0], yz[0], zx[3]],
                [zx[1], yz[2], zx[2]],
                [zx[2], yz[3], zx[1]],
                [zx[0], yz[1], xy[3]],
                [zx[0], xy[0], yz[0]],
                [zx[1], xy[3], yz[2]],
                [zx[1], yz[3], xy[0]],
                [zx[3], xy[2], yz[1]],
                [zx[3], yz[0], xy[1]],
                [zx[2], yz[2], xy[2]],
                [zx[2], xy[1], yz[3]],
            ];
        }
        icosahedron.faces = faces;
    })(icosahedron = fn.icosahedron || (fn.icosahedron = {}));
    var crystal;
    (function (crystal) {
        function verts(v, x, y, zt, zb) {
            var verts_h = ut.seq.arith(v, 0, ut.pi2 / v).map(function (rad) {
                return vc.v3(x * ut.cos(rad), y * ut.sin(rad), 0);
            });
            var verts_v = [
                vc.v3(0, 0, zt),
                vc.v3(0, 0, zb),
            ];
            return verts_h.concat(verts_v);
        }
        crystal.verts = verts;
        function faces(v) {
            var t = v;
            var b = v + 1;
            var faces_t = ut.seq.arith(v).map(function (i) { return [i, (i + 1) % v, t]; });
            var faces_b = ut.seq.arith(v).map(function (i) { return [(i + 1) % v, i, b]; });
            return faces_t.concat(faces_b);
        }
        crystal.faces = faces;
    })(crystal = fn.crystal || (fn.crystal = {}));
    var cone;
    (function (cone) {
        function verts(v, x, y, z) {
            return fn.crystal.verts(v, x, y, z, 0);
        }
        cone.verts = verts;
        function faces(v) {
            return fn.crystal.faces(v);
        }
        cone.faces = faces;
    })(cone = fn.cone || (fn.cone = {}));
    var prism;
    (function (prism) {
        function verts(v, x, y, zt, zb) {
            var verts_t = ut.seq.arith(v, 0, ut.pi2 / v).map(function (rad) {
                return vc.v3(x * ut.cos(rad), y * ut.sin(rad), zt);
            });
            var verts_b = ut.seq.arith(v, 0, ut.pi2 / v).map(function (rad) {
                return vc.v3(x * ut.cos(rad), y * ut.sin(rad), zb);
            });
            var verts_v = [
                vc.v3(0, 0, zt),
                vc.v3(0, 0, zb),
            ];
            return verts_t.concat(verts_b).concat(verts_v);
        }
        prism.verts = verts;
        function faces(v) {
            var t = 2 * v;
            var b = 2 * v + 1;
            var faces_t = ut.seq.arith(v).map(function (i) { return [i, (i + 1) % v, t]; });
            var faces_b = ut.seq.arith(v).map(function (i) { return [v + (i + 1) % v, v + i, b]; });
            var faces_side = ut.seq.arith(v).map(function (i) { return [i, (i + 1) % v, v + (i + 1) % v, v + i]; });
            return faces_t.concat(faces_b).concat(faces_side);
        }
        prism.faces = faces;
    })(prism = fn.prism || (fn.prism = {}));
})(fn = exports.fn || (exports.fn = {}));
/** Polygon - 多角形 */
function polygon(verts, faces) {
    return al._obj('polygon', verts, function (name, verts) {
        return al.geo(verts, faces);
    });
}
exports.polygon = polygon;
function obj(name, sp, geoVerts, geoFaces) {
    return al._obj(name, sp.array(), function (name, verts) {
        //verts.forEach(v => console.log(v));
        //console.log(al.ar_space(verts).m4());
        var m4 = al.ar_space(verts).m4();
        return al.geo(geoVerts.map(function (v) { return m4.map_v3(v, 1); }), geoFaces);
    });
}
/** Tetrahedron - 正4面体 */
function tetrahedron(sp) {
    if (sp === void 0) { sp = al.default_space; }
    return obj('tetrahedron', sp, fn.tetrahedron.verts(1, 1, 1), fn.tetrahedron.faces());
}
exports.tetrahedron = tetrahedron;
/** Octahedron 正8面体 */
function octahedron(sp) {
    if (sp === void 0) { sp = al.default_space; }
    return obj('octahedron', sp, fn.octahedron.verts(1, 1, 1), fn.octahedron.faces());
}
exports.octahedron = octahedron;
/** Cube 正6面体・正方形 */
function cube(sp) {
    if (sp === void 0) { sp = al.default_space; }
    return obj('cube', sp, fn.cube.verts(1, 1, 1), fn.cube.faces());
}
exports.cube = cube;
/** Dodecahedron 正12面体 */
function dodecahedron(sp) {
    if (sp === void 0) { sp = al.default_space; }
    return obj('dodecahedron', sp, fn.dodecahedron.verts(1), fn.dodecahedron.faces());
}
exports.dodecahedron = dodecahedron;
/** Icosahedron 正20面体 */
function icosahedron(sp) {
    if (sp === void 0) { sp = al.default_space; }
    return obj('icosahedron', sp, fn.icosahedron.verts(1), fn.icosahedron.faces());
}
exports.icosahedron = icosahedron;
//# sourceMappingURL=prim_old.js.map