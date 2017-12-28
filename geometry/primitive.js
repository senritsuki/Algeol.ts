"use strict";
/** プリミティブオブジェクト */
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("../algorithm/utility");
var sq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var al = require("./geo");
var prim2 = require("./primitive2");
var geometry = function (verts, faces) { return new al.Geo(verts, faces); };
/** プリミティブオブジェクト生成用関数群 */
var fn;
(function (fn) {
    var deg120_c = Math.cos(120 * ut.pi / 180);
    var deg120_s = Math.sin(120 * ut.pi / 180);
    var deg240_c = Math.cos(240 * ut.pi / 180);
    var deg240_s = Math.sin(240 * ut.pi / 180);
    var tetrahedron_rad = Math.acos(-1 / 3); // 正4面体の半径:高さ = 3:4
    var tetrahedron_c = Math.cos(tetrahedron_rad);
    var tetrahedron_s = Math.sin(tetrahedron_rad);
    // +xを右、+yを奥、+zを上、と考える（Blender）
    /** Tetrahedron - 正4面体 */
    var tetrahedron;
    (function (tetrahedron) {
        /** 原点中心の半径rの球に内接する正4面体の頂点4つ
            1つをz軸上の頭頂点、残り3つをxy平面に平行な底面とする */
        function verts(r) {
            return [
                vc.v3(0, 0, r),
                vc.v3(r * tetrahedron_s, 0, r * tetrahedron_c),
                vc.v3(r * tetrahedron_s * deg120_c, r * tetrahedron_s * deg120_s, r * tetrahedron_c),
                vc.v3(r * tetrahedron_s * deg240_c, r * tetrahedron_s * deg240_s, r * tetrahedron_c),
            ];
        }
        tetrahedron.verts = verts;
        /** 正4面体の面4つ
            面は全て合同の正三角形である */
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
    /** Octahedron - 正8面体 */
    var octahedron;
    (function (octahedron) {
        /** 原点中心の半径rの球に内接する正8面体の頂点6つ
            x軸上、y軸上、z軸上それぞれに2点ずつとる */
        function verts(r) {
            return [
                vc.v3(0, 0, r),
                vc.v3(r, 0, 0),
                vc.v3(0, r, 0),
                vc.v3(-r, 0, 0),
                vc.v3(0, -r, 0),
                vc.v3(0, 0, -r),
            ];
        }
        octahedron.verts = verts;
        /** 正8面体の三角形の面8つ
            面は全て合同の正三角形である */
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
    /** Cuboid - 直方体 */
    var cuboid;
    (function (cuboid) {
        /** 直方体の頂点8つ
            頂点の順序は立方体と同じであり、同じface配列を流用可能 */
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
        cuboid.verts = verts;
        /** 直方体の面6つ */
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
        cuboid.faces = faces;
    })(cuboid = fn.cuboid || (fn.cuboid = {}));
    /** Cube - 正6面体・立方体 */
    var cube;
    (function (cube) {
        /** 原点中心の半径rの球に外接する立方体の頂点8つ
            (+-1, +-1, +-1)の組み合わせで8点とする */
        function verts(r) {
            return cuboid.verts(r, r, r);
        }
        cube.verts = verts;
        /** 立方体の面6つ
            面は全て合同の正方形である */
        function faces() {
            return cuboid.faces();
        }
        cube.faces = faces;
    })(cube = fn.cube || (fn.cube = {}));
    /** 原点を含みxy平面・yz平面・zx平面に平行で合同な長方形3枚 */
    var trirect;
    (function (trirect) {
        /** 原点を含みxy平面・yz平面・zx平面に平行で合同な長方形3枚の頂点12個
            xy平面、yz平面、zx平面の順で、さらに第1象限、第2象限、第3象限、第4象限の順 */
        function verts(a, b) {
            return [
                vc.v3(a, b, 0),
                vc.v3(-a, b, 0),
                vc.v3(-a, -b, 0),
                vc.v3(a, -b, 0),
                vc.v3(0, a, b),
                vc.v3(0, -a, b),
                vc.v3(0, -a, -b),
                vc.v3(0, a, -b),
                vc.v3(b, 0, a),
                vc.v3(b, 0, -a),
                vc.v3(-b, 0, -a),
                vc.v3(-b, 0, a),
            ];
        }
        trirect.verts = verts;
    })(trirect = fn.trirect || (fn.trirect = {}));
    /** Dodecahedron - 正12面体 */
    var dodecahedron;
    (function (dodecahedron) {
        /** 原点中心の半径rの球に内接する正12面体の頂点20個
            球に内接する長方形3枚と立方体の頂点を流用する */
        function verts(r) {
            var cube = r / ut.r3;
            var short = cube / ut.phi;
            var long = cube * ut.phi;
            return fn.trirect.verts(long, short).concat(fn.cube.verts(cube));
        }
        dodecahedron.verts = verts;
        /** 正12面体の面12個
            面は全て合同の正五角形である */
        function faces() {
            var xy = sq.arith(4, 0);
            var yz = sq.arith(4, 4);
            var zx = sq.arith(4, 8);
            var ct = sq.arith(4, 12);
            var cb = sq.arith(4, 16);
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
        dodecahedron.rad_rot_y_to_z = ut.deg90 - Math.atan2(ut.phi * ut.phi, 1);
    })(dodecahedron = fn.dodecahedron || (fn.dodecahedron = {}));
    /** Icosahedron - 正20面体 */
    var icosahedron;
    (function (icosahedron) {
        /** 原点中心の半径rの球に内接する正20面体の頂点12個
            球に内接する長方形3枚の頂点を流用する */
        function verts(r) {
            var short = r / Math.sqrt(2 + ut.phi); // 0^2 + 1^2 + ut.phi^2
            var long = short * ut.phi;
            return fn.trirect.verts(long, short);
        }
        icosahedron.verts = verts;
        /** 正20面体の面20個
            面は全て合同の正三角形である */
        function faces() {
            var xy = sq.arith(4, 0);
            var yz = sq.arith(4, 4);
            var zx = sq.arith(4, 8);
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
        icosahedron.rad_rot_y_to_z = ut.deg90 - Math.atan2(ut.phi, 1);
    })(icosahedron = fn.icosahedron || (fn.icosahedron = {}));
    /** Circle - 円 */
    var circle;
    (function (circle) {
        /** 円に内接するn角形 */
        function verts_i(n_gonal, r, t, z) {
            if (t === void 0) { t = 0; }
            if (z === void 0) { z = 0; }
            return prim2.circle_i(n_gonal, r, t).map(function (v) { return vc.v2_to_v3(v, z); });
        }
        circle.verts_i = verts_i;
        /** 円に外接するn角形 */
        function verts_c(n_gonal, r, t, z) {
            if (t === void 0) { t = 0; }
            if (z === void 0) { z = 0; }
            return prim2.circle_c(n_gonal, r, t).map(function (v) { return vc.v2_to_v3(v, z); });
        }
        circle.verts_c = verts_c;
    })(circle = fn.circle || (fn.circle = {}));
    /** Prism - 角柱 */
    var prism;
    (function (prism) {
        /** (底面の頂点数, 底面の外接円の半径, 高さ) -> 角柱の頂点の配列 */
        function verts_i(n_gonal, r, h) {
            var verts = [];
            circle.verts_i(n_gonal, r, 0, h).forEach(function (v) { return verts.push(v); }); // 上面
            circle.verts_i(n_gonal, r, 0, 0).forEach(function (v) { return verts.push(v); }); // 底面
            return verts;
        }
        prism.verts_i = verts_i;
        /** (底面の頂点数, 底面の内接円の半径, 高さ) -> 角柱の頂点の配列 */
        function verts_c(n_gonal, r, h) {
            var verts = [];
            circle.verts_c(n_gonal, r, 0, h).forEach(function (v) { return verts.push(v); }); // 上面
            circle.verts_c(n_gonal, r, 0, 0).forEach(function (v) { return verts.push(v); }); // 底面
            return verts;
        }
        prism.verts_c = verts_c;
        function faces(n_gonal) {
            var faces = [];
            // 側面
            sq.arith(n_gonal)
                .map(function (i) { return [i, (i + 1) % n_gonal]; })
                .map(function (v) { return [v[0], v[0] + n_gonal, v[1] + n_gonal, v[1]]; })
                .forEach(function (v) { return faces.push(v); });
            // 上面と底面
            faces.push(sq.arith(n_gonal));
            faces.push(sq.arith(n_gonal).map(function (i) { return i + n_gonal; }));
            return faces;
        }
        prism.faces = faces;
    })(prism = fn.prism || (fn.prism = {}));
    /** Pyramid - 角錐 */
    var pyramid;
    (function (pyramid) {
        /** (底面の頂点数, 底面の外接円の半径, 高さ) -> 角錐の頂点の配列 */
        function verts_i(n_gonal, r, h) {
            var verts = [];
            verts.push(vc.v3(0, 0, h)); // // 頭頂点
            circle.verts_i(n_gonal, r, 0, 0).forEach(function (v) { return verts.push(v); }); // 底面
            return verts;
        }
        pyramid.verts_i = verts_i;
        /** (底面の頂点数, 底面の内接円の半径, 高さ) -> 角錐の頂点の配列 */
        function verts_c(n_gonal, r, h) {
            var verts = [];
            verts.push(vc.v3(0, 0, h)); // // 頭頂点
            circle.verts_c(n_gonal, r, 0, 0).forEach(function (v) { return verts.push(v); }); // 底面
            return verts;
        }
        pyramid.verts_c = verts_c;
        /** (底面の頂点数) -> 角錐の面の配列 */
        function faces(n_gonal) {
            var faces = [];
            // 側面
            sq.arith(n_gonal)
                .map(function (i) { return [0, i + 1, (i + 1) % n_gonal + 1]; })
                .forEach(function (v) { return faces.push(v); });
            // 底面
            faces.push(sq.arith(n_gonal).map(function (i) { return i + 1; }));
            return faces;
        }
        pyramid.faces = faces;
    })(pyramid = fn.pyramid || (fn.pyramid = {}));
    /** Bipyramid - 双角錐 */
    var bipyramid;
    (function (bipyramid) {
        /** (底面の頂点数, 底面の外接円の半径, 高さ, 深さ) -> 双角錐の頂点の配列 */
        function verts_i(n_gonal, r, h, d) {
            var verts = [];
            verts.push(vc.v3(0, 0, h)); // 頭頂点
            verts.push(vc.v3(0, 0, -d)); // 頭頂点の逆
            circle.verts_i(n_gonal, r, 0, 0).forEach(function (v) { return verts.push(v); }); // 底面
            return verts;
        }
        bipyramid.verts_i = verts_i;
        /** (底面の頂点数, 底面の内接円の半径, 高さ, 深さ) -> 双角錐の頂点の配列 */
        function verts_c(n_gonal, r, h, d) {
            var verts = [];
            verts.push(vc.v3(0, 0, h)); // 頭頂点
            verts.push(vc.v3(0, 0, -d)); // 頭頂点の逆
            circle.verts_c(n_gonal, r, 0, 0).forEach(function (v) { return verts.push(v); }); // 底面
            return verts;
        }
        bipyramid.verts_c = verts_c;
        function faces(n_gonal) {
            var faces = [];
            // 上側面
            sq.arith(n_gonal)
                .map(function (i) { return [0, i + 2, (i + 1) % n_gonal + 2]; })
                .forEach(function (v) { return faces.push(v); });
            // 下側面
            sq.arith(n_gonal)
                .map(function (i) { return [1, (i + 1) % n_gonal + 2, i + 2]; })
                .forEach(function (v) { return faces.push(v); });
            return faces;
        }
        bipyramid.faces = faces;
    })(bipyramid = fn.bipyramid || (fn.bipyramid = {}));
})(fn = exports.fn || (exports.fn = {}));
function plane_xy(verts, z) {
    var verts2 = verts.map(function (v) { return vc.v3(v.x(), v.y(), z); });
    return geometry(verts2, [verts.map(function (_, i) { return i; })]);
}
exports.plane_xy = plane_xy;
/**
 * Tetrahedron - 正4面体
 * @param   r   radius of circumscribed sphere - 外接球の半径
 */
function tetrahedron(r) {
    return geometry(fn.tetrahedron.verts(r), fn.tetrahedron.faces());
}
exports.tetrahedron = tetrahedron;
/**
 * Octahedron - 正8面体
 * @param   r   radius of circumscribed sphere - 外接球の半径
 */
function octahedron(r) {
    return geometry(fn.octahedron.verts(r), fn.octahedron.faces());
}
exports.octahedron = octahedron;
/**
 * Cube - 正6面体・立方体
 * @param   r   radius of inscribed sphere - 内接球の半径
 */
function cube(r) {
    return geometry(fn.cube.verts(r), fn.cube.faces());
}
exports.cube = cube;
/**
 * Cuboid - 直方体
 * @param x
 * @param y
 * @param z
 */
function cuboid(x, y, z) {
    return geometry(fn.cuboid.verts(x, y, z), fn.cuboid.faces());
}
exports.cuboid = cuboid;
/**
 * Dodecahedron - 正12面体
 * @param   r   radius of circumscribed sphere - 外接球の半径
 */
function dodecahedron(r) {
    return geometry(fn.dodecahedron.verts(r), fn.dodecahedron.faces());
}
exports.dodecahedron = dodecahedron;
/**
 * Icosahedron - 正20面体
 * @param   r   radius of circumscribed sphere - 外接球の半径
 */
function icosahedron(r) {
    return geometry(fn.icosahedron.verts(r), fn.icosahedron.faces());
}
exports.icosahedron = icosahedron;
/**
 * Prism - 角柱
 * @param   n_gonal     角柱底面の頂点数
 * @param   r           角柱底面の外接円の半径（xy平面）
 * @param   h           角柱の高さ（+z方向）
 */
function prism(n_gonal, r, h) {
    return geometry(fn.prism.verts_i(n_gonal, r, h), fn.prism.faces(n_gonal));
}
exports.prism = prism;
/**
 * Pyramid - 角錐
 * @param   n_gonal     角錐底面の頂点数
 * @param   r           角錐底面の外接円の半径（xy平面）
 * @param   h           角錐の高さ（+z方向）
 */
function pyramid(n_gonal, r, h) {
    return geometry(fn.pyramid.verts_i(n_gonal, r, h), fn.pyramid.faces(n_gonal));
}
exports.pyramid = pyramid;
/**
 * Bipyramid - 双角錐
 * @param   n_gonal     角錐底面の頂点数
 * @param   r           角錐底面の外接円の半径（xy平面）
 * @param   h           上向き角錐の高さ（+z方向）
 * @param   d           下向き角錐の深さ（-z方向）
 */
function bipyramid(n_gonal, r, h, d) {
    return geometry(fn.bipyramid.verts_i(n_gonal, r, h, d), fn.bipyramid.faces(n_gonal));
}
exports.bipyramid = bipyramid;
/** z軸上に頂点を置いた正12面体 */
function rot_dodecahedron(r) {
    return al.rotate_x(dodecahedron(r), fn.dodecahedron.rad_rot_y_to_z);
}
exports.rot_dodecahedron = rot_dodecahedron;
/** z軸上に頂点を置いた正20面体 */
function rot_icosahedron(r) {
    return al.rotate_x(icosahedron(r), fn.icosahedron.rad_rot_y_to_z);
}
exports.rot_icosahedron = rot_icosahedron;
/** v1とv2を対角の頂点とした直方体 */
function cuboid_vv(v1, v2) {
    v1 = v1 instanceof Array ? vc.array_to_v3(v1) : v1;
    v2 = v2 instanceof Array ? vc.array_to_v3(v2) : v2;
    var center = v1.add(v2).scalar(0.5);
    var d = v2.sub(center);
    return al.translate(cuboid(d.x(), d.y(), d.z()), center);
}
exports.cuboid_vv = cuboid_vv;
function trimesh(index, f) {
    var iMax = index.length;
    var jMax = index[0].length;
    var verts = [];
    for (var i = 0; i < iMax; i++) {
        for (var j = 0; j < jMax; j++) {
            verts.push(f(i, j));
        }
    }
    var faces = [];
    for (var i = 0; i < iMax - 1; i++) {
        var i0 = i * jMax;
        var i1 = (i + 1) * jMax;
        for (var j = 0; j < jMax - 1; j++) {
            var i0j0 = i0 + j;
            var i0j1 = i0 + j + 1;
            var i1j0 = i1 + j;
            var i1j1 = i1 + j + 1;
            faces.push([i0j0, i0j1, i1j0]);
            faces.push([i1j1, i1j0, i0j1]);
        }
    }
    return geometry(verts, faces);
}
exports.trimesh = trimesh;
