"use strict";
/** 複合オブジェクト */
Object.defineProperty(exports, "__esModule", { value: true });
var al = require("./geo");
var seq = require("../algorithm/sequence");
function verts_flat(polygons, n_gonal) {
    var sq = seq.arith(n_gonal);
    return polygons
        .map(function (polygon) { return sq.map(function (i) { return polygon[i]; }); })
        .reduce(function (a, b) { return a.concat(b); }, []);
}
function faces_prismSide(array_i, array_j) {
    var faces = [];
    array_i.forEach(function (i) {
        array_j.forEach(function (j) {
            faces.push([i[0] + j[0], i[0] + j[1], i[1] + j[1], i[1] + j[0]]); // 側面四角形
        });
    });
    return faces;
}
function faces_antiprismSide(array_i, array_j) {
    var faces = [];
    array_i.forEach(function (i) {
        array_j.forEach(function (j) {
            faces.push([i[0] + j[0], i[0] + j[1], i[1] + j[0]]); // 側面三角形 下（△▽の△）
            faces.push([i[0] + j[1], i[1] + j[1], i[1] + j[0]]); // 側面三角形 上（△▽の▽）
        });
    });
    return faces;
}
function common_prismArray(polygons, faces_side) {
    var count = polygons.length;
    var n_gonal = polygons[0].length;
    var seq_i2 = seq.arith(count - 1).map(function (i) { return [i * n_gonal, (i + 1) * n_gonal]; });
    var seq_j = seq.arith(n_gonal);
    var seq_j2 = seq_j.map(function (j) { return [j, (j + 1) % n_gonal]; });
    var verts = verts_flat(polygons, n_gonal);
    var faces = faces_side(seq_i2, seq_j2);
    faces.push(seq_j); // 底面
    faces.push(seq_j.map(function (j) { return (count - 1) * n_gonal + j; })); // 上面
    return al.geoUnit(verts, faces);
}
/** 連続角柱 */
function prismArray(polygons) {
    return common_prismArray(polygons, faces_prismSide);
}
exports.prismArray = prismArray;
/** 連続反角柱 */
function antiprismArray(polygons) {
    return common_prismArray(polygons, faces_antiprismSide);
}
exports.antiprismArray = antiprismArray;
function common_prismArray_pyramid(polygons, v1, faces_side) {
    var count = polygons.length;
    var n_gonal = polygons[0].length;
    var seq_i2 = seq.arith(count - 1).map(function (i) { return [i * n_gonal, (i + 1) * n_gonal]; });
    var seq_j = seq.arith(n_gonal);
    var seq_j2 = seq_j.map(function (j) { return [j, (j + 1) % n_gonal]; });
    var verts = verts_flat(polygons, n_gonal);
    verts.push(v1);
    var v1i = verts.length - 1;
    var i1 = (count - 1) * n_gonal;
    var faces = faces_side(seq_i2, seq_j2);
    seq_j2.forEach(function (j2) { return faces.push([i1 + j2[0], i1 + j2[1], v1i]); }); // 角錐 上
    faces.push(seq_j); // 底面
    return al.geoUnit(verts, faces);
}
/** 連続角柱 + 上に角錐 */
function prismArray_pyramid(polygons, v1) {
    return common_prismArray_pyramid(polygons, v1, faces_prismSide);
}
exports.prismArray_pyramid = prismArray_pyramid;
/** 連続反角柱 + 上に角錐 */
function antiprismArray_pyramid(polygons, v1) {
    return common_prismArray_pyramid(polygons, v1, faces_antiprismSide);
}
exports.antiprismArray_pyramid = antiprismArray_pyramid;
function common_prismArray_bipyramid(polygons, v1, v2, faces_side) {
    var count = polygons.length;
    var n_gonal = polygons[0].length;
    var seq_i2 = seq.arith(count - 1).map(function (i) { return [i * n_gonal, (i + 1) * n_gonal]; });
    var seq_j2 = seq.arith(n_gonal).map(function (j) { return [j, (j + 1) % n_gonal]; });
    var verts = verts_flat(polygons, n_gonal);
    verts.push(v1);
    verts.push(v2);
    var v1i = verts.length - 2;
    var v2i = verts.length - 1;
    var i1 = 0;
    var i2 = (count - 1) * n_gonal;
    var faces = faces_side(seq_i2, seq_j2);
    seq_j2.forEach(function (j2) { return faces.push([i1 + j2[0], i1 + j2[1], v1i]); }); // 双角錐 下
    seq_j2.forEach(function (j2) { return faces.push([i2 + j2[0], i2 + j2[1], v2i]); }); // 双角錐 上
    return al.geoUnit(verts, faces);
}
/** 連続角柱 + 上下に角錐 */
function prismArray_bipyramid(polygons, v1, v2) {
    return common_prismArray_bipyramid(polygons, v1, v2, faces_prismSide);
}
exports.prismArray_bipyramid = prismArray_bipyramid;
/** 連続反角柱 + 上下に角錐 */
function antiprismArray_bipyramid(polygons, v1, v2) {
    return common_prismArray_bipyramid(polygons, v1, v2, faces_antiprismSide);
}
exports.antiprismArray_bipyramid = antiprismArray_bipyramid;
function common_prismRing(polygons, faces_side) {
    var count = polygons.length;
    var n_gonal = polygons[0].length;
    var seq_i2 = seq.arith(count).map(function (i) { return [i * n_gonal, ((i + 1) % count) * n_gonal]; });
    var seq_j2 = seq.arith(n_gonal).map(function (j) { return [j, (j + 1) % n_gonal]; });
    var verts = verts_flat(polygons, n_gonal);
    var faces = faces_side(seq_i2, seq_j2);
    return al.geoUnit(verts, faces);
}
/** 角柱の輪 */
function prismRing(polygons) {
    return common_prismRing(polygons, faces_prismSide);
}
exports.prismRing = prismRing;
/** 反角柱の輪 */
function antiprismRing(polygons) {
    return common_prismRing(polygons, faces_antiprismSide);
}
exports.antiprismRing = antiprismRing;
/** 押し出し */
function extrude(polygon, v1, v2) {
    var p1 = polygon.map(function (v) { return v.add(v1); });
    var p2 = polygon.map(function (v) { return v.add(v2); });
    return prismArray([p1, p2]);
}
exports.extrude = extrude;
