"use strict";
/** Wavefront .obj, .mtl */
Object.defineProperty(exports, "__esModule", { value: true });
var _vert_to_str = function (v) { return ['v', v.x(), v.y(), v.z()].join(' '); };
var _face_to_str = function (f, offset) { return ['f'].concat(f.map(function (i) { return '' + (i + offset); })).join(' '); };
/**
 * OpenGL座標系を用いる (default)
 * <ul>
 * <li> [1, 2, 3] -> 'v 1 2 3'
 * </ul>
 */
function useOpenGLCoordinateSystem() {
    _vert_to_str = function (v) { return ['v', v.x(), v.y(), v.z()].join(' '); };
}
exports.useOpenGLCoordinateSystem = useOpenGLCoordinateSystem;
/**
 * Blender座標系を用いる
 * <ul>
 * <li> [1, 2, 3] -> 'v 1 3 -2'
 * </ul>
 */
function useBlenderCoordinateSystem() {
    _vert_to_str = function (v) { return ['v', v.x(), v.z(), -v.y()].join(' '); };
}
exports.useBlenderCoordinateSystem = useBlenderCoordinateSystem;
var priv;
(function (priv) {
    function vf_to_str(verts, faces, offset) {
        if (offset === void 0) { offset = 1; }
        var strs = [
            verts.map(function (v) { return _vert_to_str(v); }).join('\n'),
            faces.map(function (f) { return _face_to_str(f, offset); }).join('\n'),
        ];
        return strs.join('\n') + '\n';
    }
    priv.vf_to_str = vf_to_str;
    var GO = (function () {
        function GO(geo, offset) {
            this.geo = geo;
            this.offset = offset;
        }
        return GO;
    }());
    priv.GO = GO;
    function array_to_vfo(array, offset) {
        if (offset === void 0) { offset = 1; }
        var vo = [];
        array.forEach(function (geo) {
            vo.push(new GO(geo, offset));
            offset += geo.verts().length;
        });
        return vo;
    }
    priv.array_to_vfo = array_to_vfo;
    priv.to_mtlstr_sub_1 = function (s, rgb) {
        return rgb != null ? s + " " + rgb[0] + " " + rgb[1] + " " + rgb[2] + "\n" : '';
    };
    priv.to_mtlstr_sub_2 = function (s, n) {
        return n != null ? s + " " + n + "\n" : '';
    };
})(priv || (priv = {}));
/** algeol.Geo を.obj形式に文字列化 */
function geoUnit_to_objstr(unit, offset) {
    if (offset === void 0) { offset = 1; }
    return priv.vf_to_str(unit.verts(), unit.faces(), offset);
}
exports.geoUnit_to_objstr = geoUnit_to_objstr;
/** algeol.Geo[] を.obj形式に文字列化 */
function geoUnitArray_to_objstr(unitArray, offset) {
    if (offset === void 0) { offset = 1; }
    return priv.array_to_vfo(unitArray, offset)
        .map(function (go) { return geoUnit_to_objstr(go.geo, go.offset); })
        .join('\n');
}
exports.geoUnitArray_to_objstr = geoUnitArray_to_objstr;
/** algeol.GeoGroup を.obj形式に文字列化 */
function geo_to_objstr(geo, offset) {
    if (offset === void 0) { offset = 1; }
    var color = geo.getColor();
    var s1 = "g " + geo.name() + "\n";
    var s2 = color != null ? "usemtl " + color.name() + "\n" : '';
    return s1 + s2 + geoUnit_to_objstr(geo, offset);
}
exports.geo_to_objstr = geo_to_objstr;
/** algeol.GeoGroup[] を.obj形式に文字列化 */
function geoArray_to_objstr(geoArray, offset) {
    if (offset === void 0) { offset = 1; }
    return priv.array_to_vfo(geoArray, offset)
        .map(function (go) { return geo_to_objstr(go.geo, go.offset); })
        .join('\n');
}
exports.geoArray_to_objstr = geoArray_to_objstr;
/** algeol.GeoDict を.obj形式に文字列化 */
function geoDict_to_objstr(dict, _offset) {
    if (_offset === void 0) { _offset = 1; }
    return geoArray_to_objstr(dict.geogroups());
}
exports.geoDict_to_objstr = geoDict_to_objstr;
/** algeol.GeoGroup を.mtl形式に文字列化 */
function geo_to_mtlstr(geo) {
    return namedColor_to_mtlstr(geo.getColor());
}
exports.geo_to_mtlstr = geo_to_mtlstr;
/** algeol.GeoGroup[] を.mtl形式に文字列化 */
function geoArray_to_mtlstr(geoArray) {
    return geoArray
        .map(function (geo) { return namedColor_to_mtlstr(geo.getColor()); })
        .join('\n');
}
exports.geoArray_to_mtlstr = geoArray_to_mtlstr;
/** algeol.GeoDict を.mtl形式に文字列化 */
function geoDict_to_mtlstr(geoDict, _offset) {
    if (_offset === void 0) { _offset = 1; }
    return geoArray_to_mtlstr(geoDict.geogroups());
}
exports.geoDict_to_mtlstr = geoDict_to_mtlstr;
function objstr_mtllib(mtlFileName) {
    return "mtllib " + mtlFileName + "\n\n";
}
exports.objstr_mtllib = objstr_mtllib;
function to_mtlstr(name, rgb_ambient, rgb_diffuse, rgb_specular, dissolve) {
    var mtl = "newmtl " + name + "\n";
    mtl += priv.to_mtlstr_sub_1('Ka', rgb_ambient);
    mtl += priv.to_mtlstr_sub_1('Kd', rgb_diffuse);
    mtl += priv.to_mtlstr_sub_1('Ks', rgb_specular);
    mtl += priv.to_mtlstr_sub_2('d', dissolve);
    mtl += '';
    return mtl;
}
exports.to_mtlstr = to_mtlstr;
function namedColor_to_mtlstr(namedColor) {
    if (namedColor == null) {
        return '';
    }
    return to_mtlstr(namedColor.name(), null, namedColor.color().rgb_0_1(), null, null);
}
exports.namedColor_to_mtlstr = namedColor_to_mtlstr;
