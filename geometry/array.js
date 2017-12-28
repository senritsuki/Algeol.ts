"use strict";
/** 複合オブジェクト */
Object.defineProperty(exports, "__esModule", { value: true });
var al = require("./geo");
var seq = require("../algorithm/sequence");
var geometry = function (verts, faces) { return new al.Geo(verts, faces); };
/** 二次元配列の一次元化 */
function flatten(polygons) {
    return polygons
        .reduce(function (a, b) { return a.concat(b); });
}
exports.flatten = flatten;
function faces_side_common(polygons, op) {
    var count = polygons.length;
    var n_gonal = polygons[0].length;
    // 6角形3枚の場合、[0, 6], [6, 12]
    var array_i = seq.arith(count - 1).map(function (i) { return [i * n_gonal, (i + 1) * n_gonal]; });
    // 6角形3枚の場合、[0, 1], [1, 2], ..., [5, 0]
    var array_j = seq.arith(n_gonal).map(function (j) { return [j, (j + 1) % n_gonal]; });
    var faces = [];
    array_i.forEach(function (i) {
        array_j.forEach(function (j) {
            op(faces, i, j);
        });
    });
    return faces;
}
function faces_side_prismArray(polygons) {
    return faces_side_common(polygons, function (faces, i, j) {
        // 側面四角形
        faces.push([i[0] + j[0], i[0] + j[1], i[1] + j[1], i[1] + j[0]]);
    });
}
function faces_side_antiprismArray(polygons) {
    return faces_side_common(polygons, function (faces, i, j) {
        // 側面三角形 下（△▽の△）
        faces.push([i[0] + j[0], i[0] + j[1], i[1] + j[0]]);
        // 側面三角形 上（△▽の▽）
        faces.push([i[0] + j[1], i[1] + j[1], i[1] + j[0]]);
    });
}
function common_prismArray(polygons, faces_side) {
    var verts = flatten(polygons);
    var faces = faces_side(polygons);
    var ix = seq.arith(polygons[0].length);
    faces.push(ix.map(function (i) { return i; })); // 底面
    faces.push(ix.map(function (i) { return (polygons.length - 1) * ix.length + i; })); // 上面
    return geometry(verts, faces);
}
/** 連続角柱 */
function prismArray(polygons) {
    return common_prismArray(polygons, faces_side_prismArray);
}
exports.prismArray = prismArray;
/** 連続反角柱 */
function antiprismArray(polygons) {
    return common_prismArray(polygons, faces_side_antiprismArray);
}
exports.antiprismArray = antiprismArray;
function common_prismArray_pyramid(polygons, v1, faces_side) {
    var count = polygons.length;
    var n_gonal = polygons[0].length;
    var seq_j = seq.arith(n_gonal);
    var seq_j2 = seq_j.map(function (j) { return [j, (j + 1) % n_gonal]; });
    var verts = flatten(polygons);
    verts.push(v1);
    var v1i = verts.length - 1;
    var i1 = (count - 1) * n_gonal;
    var faces = faces_side(polygons);
    seq_j2.forEach(function (j2) { return faces.push([i1 + j2[0], i1 + j2[1], v1i]); }); // 角錐 上
    faces.push(seq_j); // 底面
    return geometry(verts, faces);
}
/** 連続角柱 + 上に角錐 */
function prismArray_pyramid(polygons, v1) {
    return common_prismArray_pyramid(polygons, v1, faces_side_prismArray);
}
exports.prismArray_pyramid = prismArray_pyramid;
/** 連続反角柱 + 上に角錐 */
function antiprismArray_pyramid(polygons, v1) {
    return common_prismArray_pyramid(polygons, v1, faces_side_antiprismArray);
}
exports.antiprismArray_pyramid = antiprismArray_pyramid;
function common_prismArray_bipyramid(polygons, v1, v2, faces_side) {
    var count = polygons.length;
    var n_gonal = polygons[0].length;
    var seq_j2 = seq.arith(n_gonal).map(function (j) { return [j, (j + 1) % n_gonal]; });
    var verts = flatten(polygons);
    verts.push(v1);
    verts.push(v2);
    var v1i = verts.length - 2;
    var v2i = verts.length - 1;
    var i1 = 0;
    var i2 = (count - 1) * n_gonal;
    var faces = faces_side(polygons);
    seq_j2.forEach(function (j2) { return faces.push([i1 + j2[0], i1 + j2[1], v1i]); }); // 双角錐 下
    seq_j2.forEach(function (j2) { return faces.push([i2 + j2[0], i2 + j2[1], v2i]); }); // 双角錐 上
    return geometry(verts, faces);
}
/** 連続角柱 + 上下に角錐 */
function prismArray_bipyramid(polygons, v1, v2) {
    return common_prismArray_bipyramid(polygons, v1, v2, faces_side_prismArray);
}
exports.prismArray_bipyramid = prismArray_bipyramid;
/** 連続反角柱 + 上下に角錐 */
function antiprismArray_bipyramid(polygons, v1, v2) {
    return common_prismArray_bipyramid(polygons, v1, v2, faces_side_antiprismArray);
}
exports.antiprismArray_bipyramid = antiprismArray_bipyramid;
function common_prismRing(polygons, faces_side) {
    var verts = flatten(polygons);
    var faces = faces_side(polygons);
    return geometry(verts, faces);
}
/** 角柱の輪 */
function prismRing(polygons) {
    return common_prismRing(polygons, faces_side_prismArray);
}
exports.prismRing = prismRing;
/** 反角柱の輪 */
function antiprismRing(polygons) {
    return common_prismRing(polygons, faces_side_antiprismArray);
}
exports.antiprismRing = antiprismRing;
/** 押し出し */
function extrude(polygon, v1, v2) {
    var p1 = polygon.map(function (v) { return v.add(v1); });
    var p2 = polygon.map(function (v) { return v.add(v2); });
    return prismArray([p1, p2]);
}
exports.extrude = extrude;
