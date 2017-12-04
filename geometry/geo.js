"use strict";
/** Geometry */
exports.__esModule = true;
var mx = require("../algorithm/matrix");
var Geo = (function () {
    function Geo(verts, faces) {
        this.verts = verts;
        this.faces = faces;
    }
    return Geo;
}());
exports.Geo = Geo;
var Material = (function () {
    function Material(name, diffuse) {
        if (diffuse === void 0) { diffuse = null; }
        this.name = name;
        this.diffuse = diffuse;
    }
    return Material;
}());
exports.Material = Material;
var FaceGroup = (function () {
    function FaceGroup(name, faces, material) {
        if (material === void 0) { material = null; }
        this.name = name;
        this.faces = faces;
        this.material = material;
    }
    FaceGroup.prototype.clone_offset = function (index_offset) {
        var new_faces = this.faces.map(function (nn) { return nn.map(function (n) { return n + index_offset; }); });
        return new FaceGroup(this.name, new_faces, this.material);
    };
    return FaceGroup;
}());
exports.FaceGroup = FaceGroup;
var Obj = (function () {
    function Obj(name, verts, faces) {
        this.name = name;
        this.verts = verts;
        this.faces = faces;
    }
    return Obj;
}());
exports.Obj = Obj;
function geo_to_obj(geo, name, material) {
    if (name === void 0) { name = null; }
    if (material === void 0) { material = null; }
    return new Obj(name, geo.verts, [new FaceGroup(name, geo.faces, material)]);
}
exports.geo_to_obj = geo_to_obj;
function merge(geos, name) {
    if (name === void 0) { name = null; }
    var merged_verts = [];
    var merged_faces = [];
    var index = 0;
    geos.forEach(function (geo) {
        merged_verts = merged_verts.concat(geo.verts);
        merged_faces = merged_faces.concat(geo.faces.map(function (f) { return f.clone_offset(index); }));
        index += geo.verts.length;
    });
    return new Obj(name, merged_verts, merged_faces);
}
exports.merge = merge;
var map_mm4 = function (mm) { return mm.map(function (m) { return function (v) { return m.map_v3(v, 1); }; }); };
/** 写像配列を用いた3次元ベクトル配列複製 */
function duplicateVerts(verts, maps) {
    return maps.map(function (m) { return verts.map(m); });
}
exports.duplicateVerts = duplicateVerts;
/** アフィン写像配列を用いた3次元ベクトル配列複製 */
function duplicateVertsAffine(verts, m4) {
    return duplicateVerts(verts, map_mm4(m4));
}
exports.duplicateVertsAffine = duplicateVertsAffine;
exports.affines_to_maps = function (m4) { return map_mm4(m4); };
/** 任意のデータ配列を用いた合成写像の生成 */
function compositeMap(data, lambdas) {
    return data.map(function (d) { return lambdas.reduce(function (m, lambda) { return lambda(d).mul(m); }, mx.unit_m4); });
}
exports.compositeMap = compositeMap;
