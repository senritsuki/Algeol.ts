"use strict";
/** プリミティブオブジェクト */
Object.defineProperty(exports, "__esModule", { value: true });
var al = require("./geo");
var ut = require("../algorithm/utility");
var sq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var v2_polar = vc.polar_to_v2;
var geometry = function (verts, faces) { return new al.Geometry(verts, faces); };
var fn;
(function (fn) {
    /** Polygon - 多角形 */
    var polygon;
    (function (polygon) {
        /**
         * 円に内接するn角形
         * @param   n_gonal     多角形の頂点数
         * @param   r           多角形の外接円の半径
         * @param   t           多角形の1つ目の頂点の偏角
         */
        function verts_i(n_gonal, r, t) {
            if (t === void 0) { t = 0; }
            return sq.arith(n_gonal, t, ut.deg360 / n_gonal)
                .map(function (rad) { return v2_polar(r, rad); });
        }
        polygon.verts_i = verts_i;
        /**
         * 円に外接するn角形
         * @param   n_gonal     多角形の頂点数
         * @param   r           多角形の内接円の半径
         * @param   t           多角形の1つ目の頂点の偏角
         */
        function verts_c(n_gonal, r, t) {
            if (t === void 0) { t = 0; }
            var theta = ut.deg360 / (n_gonal * 2);
            var r2 = r / ut.cos(theta);
            var p2 = t + theta;
            return verts_i(n_gonal, r2, p2);
        }
        polygon.verts_c = verts_c;
    })(polygon = fn.polygon || (fn.polygon = {}));
    function arc(n, r, t1, t2) {
        var step = n >= 2 ? (t2 - t1) / (n - 1) : 0;
        return sq.arith(n, t1, step).map(function (t) { return v2_polar(r, t); });
    }
    fn.arc = arc;
})(fn = exports.fn || (exports.fn = {}));
function pie(n, r, t1, t2) {
    return [vc.v2_zero].concat(fn.arc(n, r, t1, t2));
}
exports.pie = pie;
function doughnut(n, r1, r2, t1, t2) {
    var arc1 = fn.arc(n, r1, t1, t2);
    var arc2 = fn.arc(n, r2, t2, t1);
    return arc1.concat(arc2);
}
exports.doughnut = doughnut;
function extrude(verts, z) {
    var len = verts.length;
    var new_verts_1 = verts.map(function (v) { return vc.v2_to_v3(v, 0); });
    var new_verts_2 = verts.map(function (v) { return vc.v2_to_v3(v, z); });
    var new_verts = new_verts_1.concat(new_verts_2);
    var new_face_1 = sq.arith(len);
    var new_face_2 = sq.arith(len, len);
    var new_side_faces = sq.arith(len).map(function (n) { return [n, (n + 1) % len, len + (n + 1) % len, len + n]; });
    var new_faces = [];
    new_faces.push(new_face_1);
    new_faces.push(new_face_2);
    new_side_faces.forEach(function (f) { return new_faces.push(f); });
    return geometry(new_verts, new_faces);
}
exports.extrude = extrude;
/** プリミティブオブジェクト生成用関数群 */
(function (fn) {
    var deg120_c = ut.cos(120 * ut.pi / 180);
    var deg120_s = ut.sin(120 * ut.pi / 180);
    var deg240_c = ut.cos(240 * ut.pi / 180);
    var deg240_s = ut.sin(240 * ut.pi / 180);
    var tetrahedron_rad = ut.acos(-1 / 3); // 正4面体の半径:高さ = 3:4
    var tetrahedron_c = ut.cos(tetrahedron_rad);
    var tetrahedron_s = ut.sin(tetrahedron_rad);
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
    /** Cube - 正6面体・立方体 */
    var cube;
    (function (cube) {
        /** 原点中心の半径rの球に外接する立方体の頂点8つ
            (+-1, +-1, +-1)の組み合わせで8点とする */
        function verts(r) {
            return verts_xyz(r, r, r);
        }
        cube.verts = verts;
        /** 直方体の頂点8つ
            頂点の順序は立方体と同じであり、同じface配列を流用可能 */
        function verts_xyz(x, y, z) {
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
        cube.verts_xyz = verts_xyz;
        /** 立方体の面6つ
            面は全て合同の正方形である */
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
            var c = r / ut.r3;
            var s = c / ut.phi;
            var l = c * ut.phi;
            return fn.trirect.verts(l, s).concat(fn.cube.verts(c));
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
    })(dodecahedron = fn.dodecahedron || (fn.dodecahedron = {}));
    /** Icosahedron - 正20面体 */
    var icosahedron;
    (function (icosahedron) {
        /** 原点中心の半径rの球に内接する正20面体の頂点12個
            球に内接する長方形3枚の頂点を流用する */
        function verts(r) {
            var s = r / ut.sqrt(2 + ut.phi); // 0^2 + 1^2 + ut.phi^2
            var l = s * ut.phi;
            return fn.trirect.verts(l, s);
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
    })(icosahedron = fn.icosahedron || (fn.icosahedron = {}));
    /** Circle - 円 */
    var circle;
    (function (circle) {
        /** 円に内接するn角形 */
        function verts_i(n_gonal, r, t, z) {
            if (t === void 0) { t = 0; }
            if (z === void 0) { z = 0; }
            return fn.polygon.verts_i(n_gonal, r, t)
                .map(function (v) { return vc.v2_to_v3(v, z); });
        }
        circle.verts_i = verts_i;
        /** 円に外接するn角形 */
        function verts_c(n_gonal, r, t, z) {
            if (t === void 0) { t = 0; }
            if (z === void 0) { z = 0; }
            var theta = ut.deg360 / (n_gonal * 2);
            var r2 = r / ut.cos(theta);
            var p2 = t + theta;
            return verts_i(n_gonal, r2, p2, z);
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
