"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var al = require("../geometry/surface_core");
var ut = require("../algorithm/utility");
var seq = require("../algorithm/sequence");
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
var cv = require("../algorithm/curve");
var prim = require("../geometry/primitive_surface");
var multi = require("../geometry/surface_lib");
/** ? */
var RPZ = /** @class */ (function () {
    function RPZ(r, p, z) {
        this.r = r;
        this.p = p;
        this.z = z;
    }
    return RPZ;
}());
exports.RPZ = RPZ;
function rpz(r, p, z) {
    return new RPZ(r, p, z);
}
exports.rpz = rpz;
function rpzl(d, r1, r2, zz) {
    return zz.map(function (z, i) { return rpz(i % 2 == 0 ? r1 : r2, ut.deg180 * i / d, z); });
}
exports.rpzl = rpzl;
/**
 * アーチ
 * w    幅
 * h    高さ
 * rate ?
 * div  ?
 */
function vxzArch(w, h, rate, div) {
    if (rate === void 0) { rate = 1.0; }
    if (div === void 0) { div = 6; }
    // 原点中心楕円, 0: w,0,0, 0.25: 0,0,h, 0.5: -w,0,0
    var arc = cv.circle(vc.v3(0, 0, 0), vc.v3(w, 0, 0), vc.v3(0, 0, h));
    // rate=0 の場合, 0 ... 0.5 の div+1 点
    return seq.arith(div + 1, (1 - rate) / 2, (rate / 2) / div).map(function (i) { return arc.coord(i); });
}
exports.vxzArch = vxzArch;
function vxzArchWall(w, h, h2, rate, div) {
    if (rate === void 0) { rate = 1.0; }
    if (div === void 0) { div = 6; }
    var verts = vxzArch(w, h, rate, div);
    verts.push(vc.v3(-w, 0, h2));
    verts.push(vc.v3(w, 0, h2));
    return verts;
}
exports.vxzArchWall = vxzArchWall;
function vxzArchBar(w1, w2, h1, h2, rate, div) {
    if (rate === void 0) { rate = 1.0; }
    if (div === void 0) { div = 24; }
    var arc1 = vxzArch(w1, h1, rate, div);
    var arc2 = vxzArch(w2, h2, rate, div);
    arc2.reverse();
    return arc1.concat(arc2);
}
exports.vxzArchBar = vxzArchBar;
function gArchBar(v1, v2, h) {
    var d1 = 1 / 32;
    var d2 = 1 / 16;
    var dir = v2.sub(v1);
    var mid = v1.add(v2).scalar(0.5);
    var w = dir.length() / 2;
    var archBar = extrudeY(vxzArchBar(w - d1, w + d1, h - d1, h + d1), d2);
    return archBar.map3(function (v) { return mx.affine3_scale(mid).mul(mx.rot_yz_x_m4(dir)).map_v3(v, 1); });
}
exports.gArchBar = gArchBar;
function gArchWall(v1, v2, h, h2) {
    var d2 = 1 / 32;
    var dir = v2.sub(v1);
    var mid = v1.add(v2).scalar(0.5);
    var w = dir.length() / 2;
    var archWall = extrudeY(vxzArchWall(w, h, h2), d2);
    return archWall.map3(function (v) { return mx.affine3_scale(mid).mul(mx.rot_yz_x_m4(dir)).map_v3(v, 1); });
}
exports.gArchWall = gArchWall;
function extrudeY(vv, d) {
    return multi.extrude3(vv, vc.v3(0, -d, 0), vc.v3(0, d, 0));
}
exports.extrudeY = extrudeY;
function extrudeZZ(vv, d1, d2) {
    return multi.extrude3(vv, vc.v3(0, 0, d1), vc.v3(0, 0, d2));
}
exports.extrudeZZ = extrudeZZ;
function antiprism(d, rz) {
    if (d === void 0) { d = 4; }
    if (rz === void 0) { rz = []; }
    return multi.antiprismArray(seq.arith(rz.length).map(function (i) {
        return prim.fn.circle.verts_i(d, rz[i].r, ut.deg180 * i / d, rz[i].z);
    }));
}
exports.antiprism = antiprism;
exports.lvTrans = function (trans) { return function (v) { return mx.affine3_scale(trans).map_v3(v, 1); }; };
exports.lvICube = function (v) { return mx.m3_rot_y(-(ut.deg90 - Math.atan2(1, ut.r2))).mul(mx.m3_rot_z(-ut.deg45)).map(v); };
exports.g1oHalfCube = prim.cube(0.5).map3(function (v) { return mx.scale_m3([1, 1, 0.5]).map(v); });
exports.g1oICube = prim.cube(0.5 / ut.r3).map3(exports.lvICube);
exports.g1zpICube = exports.g1oICube.map3(exports.lvTrans(vc.v3(0, 0, 0.5)));
exports.g1xpznCCube = exports.g1oHalfCube.map3(exports.lvTrans(vc.v3(0.5, 0, -0.25)));
exports.g0columnFloor = antiprism(4, rpzl(4, 0.25, 0.25, [-0.75, -0.25, 0.25]));
exports.g0cube = exports.g1zpICube.map3(function (v) { return mx.scale_m4([0.5, 0.5, 0.5]).map_v3(v, 1); });
exports.g0crys4 = prim.tetrahedron(0.5).map3(function (v) { return mx.scale_m4([0.5, 0.5, 1]).mul(mx.affine3_trans([0, 0, 0.5])).map_v3(v, 1); });
var merge_geos = function (name, geos) { return al.merge_surfaces(geos, null, name); };
var merge_objs = function (objs) { return objs; };
// 塔
var node;
(function (node) {
    var nr25 = Math.sqrt(2.5); // 1.58
    var nColumnH = 5;
    var nRoofH = 10;
    var nFloorD = 0.25;
    var nUnderFloorD = 2;
    var nArchHeight = 1.0;
    var nArchWallHeight = 1.5;
    var nInner = 0.95;
    var vInner = vc.v3(nInner, nInner, 1);
    var nRingR = 0.125;
    var nRingD = nFloorD / 2;
    node.vxyFloor4 = al.duplicate_v3([
        vc.v3(1.5, 0.5, 0),
        vc.v3(nr25 / ut.r2, nr25 / ut.r2, 0),
        vc.v3(0.5, 1.5, 0),
    ], 1, al.compose_v4map(seq.arith(4), [function (d) { return mx.affine3_rot_z(ut.deg90 * d); }])).reduce(function (a, b) { return a.concat(b); }, []);
    node.vxyFloor6 = al.duplicate_v3([
        vc.v3(1.5, -0.5, 0),
        vc.v3(1.5, 0.5, 0),
    ], 1, al.compose_v4map(seq.arith(6), [function (d) { return mx.affine3_rot_z(ut.deg60 * d); }])).reduce(function (a, b) { return a.concat(b); }, []);
    node.g4Floor = extrudeZZ(node.vxyFloor4, -nFloorD, 0);
    node.g6Floor = extrudeZZ(node.vxyFloor6, -nFloorD, 0);
    var rot_z_atan2_m4 = function (v) { return mx.affine3_rot_z(Math.atan2(v.y, v.x)); };
    var vRing = prim.fn.circle.verts_i(6, nRingR);
    var gRing = extrudeZZ(vRing, -nRingD, nRingD);
    var mapRingFloor = function (v) { return mx.affine3_trans([0, 0, -nRingD]).mul(mx.scale_m4([1, 1, 1.5])).map_v3(v, 1); };
    var mapRingArch = function (v) { return mx.affine3_trans([0, 0, nColumnH - nArchWallHeight]).mul(mx.scale_m4([1, 1, 0.25])).map_v3(v, 1); };
    node.g4Rings = al.duplicate_f(gRing, al.compose_v4map(seq.arith(node.vxyFloor4.length), [function (_) { return mx.affine3_trans([nr25 * nInner, 0, 0]); }, function (i) { return rot_z_atan2_m4(node.vxyFloor4[i]); }]));
    node.g6Rings = al.duplicate_f(gRing, al.compose_v4map(seq.arith(node.vxyFloor6.length), [function (_) { return mx.affine3_trans([nr25 * nInner, 0, 0]); }, function (i) { return rot_z_atan2_m4(node.vxyFloor6[i]); }]));
    node.g4FloorRings = node.g4Rings.map(function (g) { return g.map3(function (v) { return mapRingFloor(v); }); });
    node.g6FloorRings = node.g6Rings.map(function (g) { return g.map3(function (v) { return mapRingFloor(v); }); });
    node.g4ArchRings = node.g4Rings.map(function (g) { return g.map3(function (v) { return mapRingArch(v); }); });
    node.g6ArchRings = node.g6Rings.map(function (g) { return g.map3(function (v) { return mapRingArch(v); }); });
    node.g4RoofRings = node.g4FloorRings.map(function (g) { return g.map3(function (v) { return v.add(vc.v3(0, 0, nColumnH)); }); });
    node.g6RoofRings = node.g6FloorRings.map(function (g) { return g.map3(function (v) { return v.add(vc.v3(0, 0, nColumnH)); }); });
    node.g4BottomRings = node.g4FloorRings.map(function (g) { return g.map3(function (v) { return v.sub(vc.v3(0, 0, nUnderFloorD)); }); });
    node.g6BottomRings = node.g6FloorRings.map(function (g) { return g.map3(function (v) { return v.sub(vc.v3(0, 0, nUnderFloorD)); }); });
    var gColumn = antiprism(4, rpzl(4, 1 / 16, 1 / 32, seq.arith(7, 0, (nColumnH - 0.25) / 6)));
    node.g4Columns = al.duplicate_f(gColumn, al.compose_v4map(seq.arith(node.vxyFloor4.length), [function (_) { return mx.affine3_trans([nr25 * nInner, 0, 0]); }, function (i) { return rot_z_atan2_m4(node.vxyFloor4[i]); }]));
    node.g6Columns = al.duplicate_f(gColumn, al.compose_v4map(seq.arith(node.vxyFloor6.length), [function (_) { return mx.affine3_trans([nr25 * nInner, 0, 0]); }, function (i) { return rot_z_atan2_m4(node.vxyFloor6[i]); }]));
    var gColumnUnder = antiprism(4, rpzl(4, 1 / 16, 1 / 32, seq.arith(7, -nUnderFloorD, (nUnderFloorD - 0.25) / 6)));
    node.g4ColumnUnders = al.duplicate_f(gColumnUnder, al.compose_v4map(seq.arith(node.vxyFloor4.length), [function (_) { return mx.affine3_trans([nr25 * nInner, 0, 0]); }, function (i) { return rot_z_atan2_m4(node.vxyFloor4[i]); }]));
    node.g6ColumnUnders = al.duplicate_f(gColumnUnder, al.compose_v4map(seq.arith(node.vxyFloor6.length), [function (_) { return mx.affine3_trans([nr25 * nInner, 0, 0]); }, function (i) { return rot_z_atan2_m4(node.vxyFloor6[i]); }]));
    var vArchOffset = vc.v3(0, 0, nColumnH - nArchWallHeight);
    var mapVPair = function (vv, d) { return function (i) { return ({ v1: vv[i].add(d), v2: vv[(i + 1) % vv.length].add(d) }); }; };
    //const mapVPair = (vv: vc.V3[], d: vc.V3) => (i: number) => { return { v1: vv[i].add(d), v2: vv[(i + 1) % vv.length].add(d) }; };
    var mapVPair4 = mapVPair(node.vxyFloor4, vArchOffset);
    var mapVPair6 = mapVPair(node.vxyFloor6, vArchOffset);
    node.g4ArchBars = seq.arith(node.vxyFloor4.length)
        .map(function (i) { return mapVPair4(i); })
        .map(function (v) { return gArchBar(v.v1.el_mul(vInner), v.v2.el_mul(vInner), nArchHeight); });
    node.g6ArchBars = seq.arith(node.vxyFloor6.length)
        .map(function (i) { return mapVPair6(i); })
        .map(function (v) { return gArchBar(v.v1.el_mul(vInner), v.v2.el_mul(vInner), nArchHeight); });
    node.g4ArchWalls = seq.arith(node.vxyFloor4.length)
        .map(function (i) { return mapVPair4(i); })
        .map(function (v) { return gArchWall(v.v1.el_mul(vInner), v.v2.el_mul(vInner), nArchHeight, nArchWallHeight); });
    node.g6ArchWalls = seq.arith(node.vxyFloor6.length)
        .map(function (i) { return mapVPair6(i); })
        .map(function (v) { return gArchWall(v.v1.el_mul(vInner), v.v2.el_mul(vInner), nArchHeight, nArchWallHeight); });
    node.g4RoofBase = node.g4Floor.map3(function (v) { return v.add(vc.v3(0, 0, nColumnH)); });
    node.g6RoofBase = node.g6Floor.map3(function (v) { return v.add(vc.v3(0, 0, nColumnH)); });
    var mapsRoofA = al.compose_m4([vc.v2(1, nColumnH), vc.v2(0.625, nColumnH + 0.75), vc.v2(1 / 64, nColumnH + nRoofH * 0.875)], [function (d) { return mx.scale_m4([d.x, d.x, 1]); }, function (d) { return mx.affine3_trans([0, 0, d.y]); }]);
    node.g4RoofAm = multi.prismArray_pyramid(mapsRoofA.map(function (m) { return node.vxyFloor4.map(function (v) { return m.map_v3(v, 1); }); }), vc.v3(0, 0, nColumnH + nRoofH));
    node.g6RoofAm = multi.prismArray_pyramid(mapsRoofA.map(function (m) { return node.vxyFloor6.map(function (v) { return m.map_v3(v, 1); }); }), vc.v3(0, 0, nColumnH + nRoofH));
    var gRoofAs = prim.pyramid(4, 1 / 12, nRoofH / 4);
    node.g4RoofAs = al.duplicate_f(gRoofAs, al.compose_v4map(seq.arith(node.vxyFloor4.length), [function (_) { return mx.affine3_trans([nr25 * nInner, 0, nColumnH]); }, function (i) { return rot_z_atan2_m4(node.vxyFloor4[i]); }]));
    node.g6RoofAs = al.duplicate_f(gRoofAs, al.compose_v4map(seq.arith(node.vxyFloor6.length), [function (_) { return mx.affine3_trans([nr25 * nInner, 0, nColumnH]); }, function (i) { return rot_z_atan2_m4(node.vxyFloor6[i]); }]));
    var mapsRoofB = al.compose_m4(seq.arith(12, 0, ut.deg90 / 12).map(function (rad) { return vc.v2(Math.cos(rad), nColumnH + nr25 * Math.sin(rad)); }), [function (d) { return mx.scale_m4([d.x, d.x, 1]); }, function (d) { return mx.affine3_trans([0, 0, d.y]); }]);
    node.g4RoofB = multi.prismArray_pyramid(mapsRoofB.map(function (m) { return node.vxyFloor4.map(function (v) { return m.map_v3(v, 1); }); }), vc.v3(0, 0, nColumnH + nr25));
    node.g6RoofB = multi.prismArray_pyramid(mapsRoofB.map(function (m) { return node.vxyFloor6.map(function (v) { return m.map_v3(v, 1); }); }), vc.v3(0, 0, nColumnH + nr25));
    var nObjR = nRingR * 1.5;
    var nCrysR = nRingR / 1.5;
    var gCrys = prim.bipyramid(4, nCrysR, ut.phi / (1 + ut.phi), 1 / (1 + ut.phi))
        .map3(function (v) { return mx.affine3_trans([0, 0, 1 / (1 + ut.phi)]).map_v3(v, 1); });
    var gObj1 = exports.g1oICube
        .map3(function (v) { return mx.affine3_trans([0, 0, nObjR / 2]).mul(mx.scale_m4([nObjR, nObjR, nObjR])).map_v3(v, 1); });
    var gObj2 = prim.dodecahedron(0.5)
        .map3(function (v) { return mx.affine3_trans([0, 0, nObjR / 2]).mul(mx.scale_m4([nObjR, nObjR, nObjR])).map_v3(v, 1); });
    var seq4Obj1 = seq.arith(node.vxyFloor4.length).filter(function (i) { return i % 3 != 2; });
    var seq4Obj2 = seq.arith(node.vxyFloor4.length).filter(function (i) { return i % 3 == 2; });
    var seq6Obj1 = seq.arith(node.vxyFloor6.length).filter(function (i) { return i % 2 != 1; });
    var seq6Obj2 = seq.arith(node.vxyFloor6.length).filter(function (i) { return i % 2 == 1; });
    node.g4RoofC1 = al.duplicate_f(gCrys, al.compose_v4map(seq.arith(node.vxyFloor4.length), [function (i) { return mx.scale_m4([1, 1, (2 + i % 3) / 2]); }, function (_) { return mx.affine3_trans([nr25 * nInner, 0, nFloorD / 2]); }, function (i) { return rot_z_atan2_m4(node.vxyFloor4[i]); }]));
    node.g4RoofC2 = al.duplicate_f(gObj1, al.compose_v4map(seq4Obj1, [function (i) { return mx.affine3_trans([nr25 * nInner, 0, (2 + i % 3) / 2 + nFloorD / 2]); }, function (i) { return rot_z_atan2_m4(node.vxyFloor4[i]); }]));
    node.g4RoofC3 = al.duplicate_f(gObj2, al.compose_v4map(seq4Obj2, [function (i) { return mx.affine3_trans([nr25 * nInner, 0, (2 + i % 3) / 2 + nFloorD / 2]); }, function (i) { return rot_z_atan2_m4(node.vxyFloor4[i]); }]));
    node.g6RoofC1 = al.duplicate_f(gCrys, al.compose_v4map(seq.arith(node.vxyFloor6.length), [function (i) { return mx.scale_m4([1, 1, (2 + 2 * (i % 2)) / 2]); }, function (_) { return mx.affine3_trans([nr25 * nInner, 0, nFloorD / 2]); }, function (i) { return rot_z_atan2_m4(node.vxyFloor6[i]); }]));
    node.g6RoofC2 = al.duplicate_f(gObj1, al.compose_v4map(seq6Obj1, [function (i) { return mx.affine3_trans([nr25 * nInner, 0, (2 + 2 * (i % 2)) / 2 + nFloorD / 2]); }, function (i) { return rot_z_atan2_m4(node.vxyFloor6[i]); }]));
    node.g6RoofC3 = al.duplicate_f(gObj2, al.compose_v4map(seq6Obj2, [function (i) { return mx.affine3_trans([nr25 * nInner, 0, (2 + 2 * (i % 2)) / 2 + nFloorD / 2]); }, function (i) { return rot_z_atan2_m4(node.vxyFloor6[i]); }]));
    var mapsBottom = al.compose_m4([vc.v2(1, 0), vc.v2(1, -0.25), vc.v2(0.75, -0.5), vc.v2(0.5, -1.5), vc.v2(0.25, -6), vc.v2(1 / 16, -30)].map(function (v) { return v.sub(vc.v2(0, nUnderFloorD)); }), [function (d) { return mx.scale_m4([d.x, d.x, 1]); }, function (d) { return mx.affine3_trans([0, 0, d.y]); }]);
    node.g4Bottom = multi.prismArray_pyramid(mapsBottom.map(function (m) { return node.vxyFloor4.map(function (v) { return m.map_v3(v, 1); }); }), vc.v3(0, 0, -256));
    node.g6Bottom = multi.prismArray_pyramid(mapsBottom.map(function (m) { return node.vxyFloor6.map(function (v) { return m.map_v3(v, 1); }); }), vc.v3(0, 0, -256));
    node.gdFloor4 = [
        merge_geos('floor', [node.g4Floor]),
        merge_geos('floor', [node.g4Bottom]),
        merge_geos('wall', [node.g4FloorRings, node.g4BottomRings, node.g4ColumnUnders].reduce(function (a, b) { return a.concat(b); })),
    ];
    node.gdFloor6 = [
        merge_geos('floor', [node.g6Floor]),
        merge_geos('floor', [node.g6Bottom]),
        merge_geos('wall', [node.g6FloorRings, node.g6BottomRings, node.g6ColumnUnders].reduce(function (a, b) { return a.concat(b); })),
    ];
    node.gdArch4 = [
        merge_geos('wall', [node.g4Columns, node.g4ArchBars, node.g4ArchWalls, node.g4ArchRings].reduce(function (a, b) { return a.concat(b); })),
    ];
    node.gdArch6 = [
        merge_geos('wall', [node.g6Columns, node.g6ArchBars, node.g6ArchWalls, node.g6ArchRings].reduce(function (a, b) { return a.concat(b); })),
    ];
    node.gdRoof4A = [
        merge_geos('wall', [node.g4RoofBase]),
        merge_geos('wall', node.g4RoofRings),
        merge_geos('roof', [node.g4RoofAm].concat(node.g4RoofAs)),
    ];
    node.gdRoof6A = [
        merge_geos('wall', [node.g6RoofBase]),
        merge_geos('wall', node.g6RoofRings),
        merge_geos('roof', [node.g6RoofAm].concat(node.g6RoofAs)),
    ];
    node.gdRoof4B = [
        merge_geos('wall', [node.g4RoofBase]),
        merge_geos('wall', node.g4RoofRings),
        merge_geos('roof', [node.g4RoofB].concat(node.g4RoofAs)),
    ];
    node.gdRoof6B = [
        merge_geos('wall', [node.g6RoofBase]),
        merge_geos('wall', node.g6RoofRings),
        merge_geos('roof', [node.g6RoofB].concat(node.g6RoofAs)),
    ];
    node.gdRoof4C = [
        merge_geos('wall', node.g4RoofC1),
        merge_geos('roof', node.g4RoofC2.concat(node.g4RoofC3)),
    ];
    node.gdRoof6C = [
        merge_geos('wall', node.g6RoofC1),
        merge_geos('roof', node.g6RoofC2.concat(node.g6RoofC3)),
    ];
    node.gdFullTower4 = merge_objs([
        node.gdFloor4, node.gdArch4, node.gdRoof4A
    ]);
    node.gdFullTower6 = merge_objs([
        node.gdFloor6, node.gdArch6, node.gdRoof6A
    ]);
    node.gdRoundTower4 = merge_objs([
        node.gdFloor4, node.gdArch4, node.gdRoof4B
    ]);
    node.gdRoundTower6 = merge_objs([
        node.gdFloor6, node.gdArch6, node.gdRoof6B
    ]);
    node.gdOpenTower4 = merge_objs([
        node.gdFloor4, node.gdRoof4C
    ]);
    node.gdOpenTower6 = merge_objs([
        node.gdFloor6, node.gdRoof6C
    ]);
})(node = exports.node || (exports.node = {}));
var link;
(function (link) {
    var nLenH = 3;
    var nStairCount = 11;
    var nStairDepth = 1 / 8;
    var nStairStepX = nLenH / nStairCount;
    var nStairStepY = 1;
    var nObjX = nStairStepX / 2;
    var nObjR1 = nStairStepX / 2;
    var nObjR2 = nStairStepX / 4;
    var nObjR3 = nStairStepX / 1.5;
    var nObjZ = nStairDepth / 2;
    var gStairStep = prim.cube(0.5)
        .map3(function (v) { return mx.scale_m4([nStairStepX, nStairStepY, nStairDepth]).mul(mx.affine3_trans([0.5, 0, -0.5])).map_v3(v, 1); });
    var gRing = prim.prism(4, nObjR1, nStairDepth * 2)
        .map3(function (v) { return mx.affine3_trans([nObjX, 0, -nStairDepth * 1.5]).map_v3(v, 1); });
    var gCrys = prim.bipyramid(4, nObjR2, ut.phi / (1 + ut.phi), 1 / (1 + ut.phi))
        .map3(function (v) { return mx.affine3_trans([nObjX, 0, 1 / (1 + ut.phi)]).map_v3(v, 1); });
    var gObj1 = exports.g1oICube
        .map3(function (v) { return mx.affine3_trans([nObjX, 0, nObjR1]).mul(mx.scale_m4([nObjR3, nObjR3, nObjR3])).map_v3(v, 1); });
    var gObj2 = prim.dodecahedron(0.5)
        .map3(function (v) { return mx.affine3_trans([nObjX, 0, nObjR1]).mul(mx.scale_m4([nObjR3, nObjR3, nObjR3])).map_v3(v, 1); });
    var gRingPair = [-0.5, 0.5].map(function (i) { return gRing.map3(function (v) { return v.add(vc.v3(0, i * nStairStepY, 0)); }); });
    var gCrysPair = [-0.5, 0.5].map(function (i) { return gCrys.map3(function (v) { return v.add(vc.v3(0, i * nStairStepY, 0)); }); });
    var gObj1Pair = [-0.5, 0.5].map(function (i) { return gObj1.map3(function (v) { return v.add(vc.v3(0, i * nStairStepY, 0)); }); });
    var gObj2Pair = [-0.5, 0.5].map(function (i) { return gObj2.map3(function (v) { return v.add(vc.v3(0, i * nStairStepY, 0)); }); });
    var seqOverZ = seq.arith(nStairCount).map(function (i) { return (6 - Math.abs((nStairCount - 1) / 2 - i)) * 0.25; });
    var seqUnderZ = seq.arith(nStairCount).map(function (i) { return 2 - nLenH / 2 * Math.sin(Math.acos(1 - (0.5 + i) / (nStairCount / 2))); });
    var gdStairSteps = seq.arith(nStairCount).map(function (i) { return al.concat_surface_groups([
        merge_geos('floor', [gStairStep.map3(function (v) { return mx.affine3_trans([i * nStairStepX, 0, 0]).map_v3(v, 1); })]),
        merge_geos('wall', gRingPair.map(function (g) { return g.map3(function (v) { return mx.affine3_trans([i * nStairStepX, 0, 0]).map_v3(v, 1); }); })),
        merge_geos('wall', i % 2 != 0 ?
            [] :
            gCrysPair.map(function (g) { return g.map3(function (v) { return mx.affine3_trans([i * nStairStepX, 0, nObjZ]).mul(mx.scale_m4([1, 1, seqOverZ[i]])).map_v3(v, 1); }); })),
        merge_geos('roof', i % ((nStairCount - 1) / 2) != 0 ?
            gObj1Pair.map(function (g) { return g.map3(function (v) { return mx.affine3_trans([i * nStairStepX, 0, nObjZ + seqOverZ[i]]).map_v3(v, 1); }); }) :
            gObj2Pair.map(function (g) { return g.map3(function (v) { return mx.affine3_trans([i * nStairStepX, 0, nObjZ + seqOverZ[i]]).map_v3(v, 1); }); })),
        merge_geos('wall', i % 2 != 0 ?
            [] :
            gCrysPair.map(function (g) { return g.map3(function (v) { return mx.affine3_trans([i * nStairStepX, 0, -nObjZ - nStairDepth]).mul(mx.scale_m4([1, 1, -seqUnderZ[i]])).map_v3(v, 1); }); })),
        merge_geos('wall', i % ((nStairCount - 1) / 2) != 0 ?
            gObj1Pair.map(function (g) { return g.map3(function (v) { return mx.affine3_trans([i * nStairStepX, 0, -nObjZ - nStairDepth - seqUnderZ[i] - nObjR3 * 1.5]).map_v3(v, 1); }); }) :
            gObj2Pair.map(function (g) { return g.map3(function (v) { return mx.affine3_trans([i * nStairStepX, 0, -nObjZ - nStairDepth - seqUnderZ[i] - nObjR3 * 1.5]).map_v3(v, 1); }); })),
    ]); });
    function shortenHorizontal(c, r) {
        var v1 = c.coord(0);
        var v2 = c.coord(1);
        var v1z = vc.v3(v1.x, v1.y, 0);
        var v2z = vc.v3(v2.x, v2.y, 0);
        var dirH = v2z.sub(v1z).unit().scalar(r);
        var v1r = v1.add(dirH);
        var v2r = v2.sub(dirH);
        return cv.line(v1r, v2r);
    }
    link.shortenHorizontal = shortenHorizontal;
    function gdLink(c) {
        var cs = shortenHorizontal(c, nLenH / 2);
        var v1 = cs.coord(0);
        var v2 = cs.coord(1);
        var dir = v2.sub(v1);
        var dirH = vc.v3(dir.x, dir.y, 0);
        //const dh = dirH.length();
        //const dv = dir.z;
        var count = gdStairSteps.length;
        var seqZ = seq.arith(count, 1).map(function (i) { return (v1.z * (count + 1 - i) + v2.z * i) / (count + 1); });
        var mRotZ = mx.rot_yz_x_m4(dirH);
        var mTransV1 = mx.affine3_scale(vc.v3(v1.x, v1.y, 0));
        var maps = al.compose_v3map(seq.arith(count), [
            function (i) { return mx.affine3_trans([0, 0, seqZ[i]]); },
            function (_) { return mRotZ; },
            function (_) { return mTransV1; },
        ]);
        return al.concat_surface_groups(seq.arith(count).map(function (i) { return gdStairSteps[i].map3(function (v) { return maps[i](v); }); }));
    }
    link.gdLink = gdLink;
})(link = exports.link || (exports.link = {}));
// 島
function shortenLine(c, r) {
    var v1 = c.coord(0);
    var v2 = c.coord(1);
    var dir = v2.sub(v1).unit().scalar(r);
    var v1r = v1.add(dir);
    var v2r = v2.sub(dir);
    return cv.line(v1r, v2r);
}
exports.shortenLine = shortenLine;
function gdLinkHorizontal(c, geoXp) {
    var v1 = c.coord(0);
    var v2 = c.coord(1);
    var dir = v2.sub(v1);
    var dirH = vc.v3(dir.x, dir.y, 0);
    var dh = dirH.length();
    //const dv = dir.z;
    var m = mx.compose([
        mx.scale_m4([dh, 1, 1]),
        mx.rot_yz_x_m4(dirH),
        mx.affine3_scale(v1),
    ]);
    return geoXp.map3(function (v) { return m.map_v3(v, 1); });
}
exports.gdLinkHorizontal = gdLinkHorizontal;
function gdLinkR15TypeA(c) {
    return gdLinkHorizontal(shortenLine(c, 1.5), exports.g1xpznCCube);
}
exports.gdLinkR15TypeA = gdLinkR15TypeA;
function gdNode(v, geo) {
    return geo.map3(exports.lvTrans(v));
}
exports.gdNode = gdNode;
function gdNodeR15TypeA4(v) {
    return gdNode(v, node.g4Floor);
}
exports.gdNodeR15TypeA4 = gdNodeR15TypeA4;
function gdNodeR15TypeA6(v) {
    return gdNode(v, node.g6Floor);
}
exports.gdNodeR15TypeA6 = gdNodeR15TypeA6;
function geoColumn(r, h, dim, countColumn, hBase, rBaseT, rColumn, vCircle) {
    if (dim === void 0) { dim = 4; }
    if (countColumn === void 0) { countColumn = 4; }
    if (hBase === void 0) { hBase = 0.25; }
    if (rBaseT === void 0) { rBaseT = 0.9; }
    if (rColumn === void 0) { rColumn = 0.75; }
    if (vCircle === void 0) { vCircle = function (dim, r, z, p) {
        return prim.fn.circle.verts_i(dim, r, p * ut.deg180, z);
    }; }
    var vCircle2 = function (r, z, p) { return vCircle(dim, r, z, p); };
    var polygons = [];
    polygons.push(vCircle2(r, 0, 0));
    polygons.push(vCircle2(r * rBaseT, hBase, 0));
    seq.arith(countColumn + 1).forEach(function (i) { return polygons.push(vCircle2(r * rColumn, hBase + (h - hBase * 2) * i / countColumn, i % 2)); });
    polygons.push(vCircle2(r * rBaseT, h - hBase, 0));
    polygons.push(vCircle2(r, h, 0));
    return multi.prismArray(polygons);
}
exports.geoColumn = geoColumn;
function dupl(geo, c, ii) {
    return al.duplicate_f(geo, al.compose_v4map(ii.map(function (i) { return c.ray(i); }), [
        function (d) { return mx.rot_yz_x_m4(d.d.el_mul(vc.v3(1, 1, 0))); },
        function (d) { return mx.affine3_scale(d.c); },
    ]));
}
exports.dupl = dupl;
function hexaObj() {
    al.duplicate_f(prim.bipyramid(4, 0.25, 0.5, 0.5), al.compose_v4map(seq.arith(4), [
        function (_) { return mx.affine3_rot_x(ut.deg90); },
        function (_) { return mx.affine3_trans([3, 0, 0]); },
        function (d) { return mx.affine3_rot_z(ut.deg90 * d); },
    ]));
}
exports.hexaObj = hexaObj;
