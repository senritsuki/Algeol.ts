/** Wavefront .obj */
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
})();
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
function geoarray_str(geoarray, offset) {
    if (offset === void 0) { offset = 1; }
    return array_vfo(geoarray, offset).map(function (go) { return geo_str(go.geo, go.offset); }).join('\n');
}
exports.geoarray_str = geoarray_str;
/** ジオメトリグループを文字列化 */
function geogroup_str(geogroup, offset) {
    if (offset === void 0) { offset = 1; }
    return ("name " + geogroup.name() + "\n") + geo_str(geogroup, offset);
}
exports.geogroup_str = geogroup_str;
/** ジオメトリグループ配列を文字列化 */
function geogrouparray_str(geogrouparray, offset) {
    if (offset === void 0) { offset = 1; }
    return array_vfo(geogrouparray, offset).map(function (go) { return geogroup_str(go.geo, go.offset); }).join('\n');
}
exports.geogrouparray_str = geogrouparray_str;
//# sourceMappingURL=format_wavefrontobj.js.map