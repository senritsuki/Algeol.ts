"use strict";
/** Wavefront .obj */
Object.defineProperty(exports, "__esModule", { value: true });
/** 頂点vを文字列化する方法
    デフォルトでは3次元ベクトルを x z -y と並べていますが、変えたい場合は上書きしてください */
exports._vert_str = function (v) {
    return ['v', v.x(), v.z(), -v.y()].join(' ');
};
/** 面fを文字列化する方法 */
exports._face_str = function (f, offset) {
    return ['f'].concat(f.map(function (i) { return '' + (i + offset); })).join(' ');
};
function vf_str(verts, faces, offset) {
    if (offset === void 0) { offset = 1; }
    var strs = [
        verts.map(function (v) { return exports._vert_str(v); }).join('\n'),
        faces.map(function (f) { return exports._face_str(f, offset); }).join('\n'),
        '',
    ];
    return strs.join('\n') + '\n';
}
var GO = (function () {
    function GO(geo, offset) {
        this.geo = geo;
        this.offset = offset;
    }
    return GO;
}());
function array_vfo(array, offset) {
    if (offset === void 0) { offset = 1; }
    var vo = [];
    array.forEach(function (geo) {
        vo.push(new GO(geo, offset));
        offset += geo.verts().length;
    });
    return vo;
}
/** ジオメトリを文字列化 */
function geo_str(geo, offset) {
    if (offset === void 0) { offset = 1; }
    return vf_str(geo.verts(), geo.faces(), offset);
}
exports.geo_str = geo_str;
/** ジオメトリ配列を文字列化 */
function geoArray_str(geoArray, offset) {
    if (offset === void 0) { offset = 1; }
    return array_vfo(geoArray, offset).map(function (go) { return geo_str(go.geo, go.offset); }).join('\n');
}
exports.geoArray_str = geoArray_str;
/** ジオメトリグループを文字列化 */
function geoGroup_str(geoGroup, offset) {
    if (offset === void 0) { offset = 1; }
    return "g " + geoGroup.name() + "\n" + geo_str(geoGroup, offset);
}
exports.geoGroup_str = geoGroup_str;
/** ジオメトリグループ配列を文字列化 */
function geoGroupArray_str(geoGroupArray, offset) {
    if (offset === void 0) { offset = 1; }
    return array_vfo(geoGroupArray, offset).map(function (go) { return geoGroup_str(go.geo, go.offset); }).join('\n');
}
exports.geoGroupArray_str = geoGroupArray_str;
/** ジオメトリ辞書を文字列化 */
function geoDict_str(geoDict, _offset) {
    if (_offset === void 0) { _offset = 1; }
    return geoGroupArray_str(geoDict.geogroups());
}
exports.geoDict_str = geoDict_str;
