"use strict";
/** Wavefront .obj, .mtl */
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("../algorithm/utility");
exports.format_florts = function (nn) { return nn.map(function (n) { return ut.format_03f(n); }).join(' '); };
exports.vert_to_str = function (v) { return 'v ' + v._v.join(' '); };
exports.face_to_str = function (f) { return 'f ' + f.join(' '); };
/**
 * OpenGL座標系を用いる (default)
 * [1, 2, 3] -> 'v 1 2 3'
 */
function useOpenGLCoordinateSystem() {
    exports.vert_to_str = function (v) { return ['v', v.x, v.y, v.z].join(' '); };
}
exports.useOpenGLCoordinateSystem = useOpenGLCoordinateSystem;
/**
 * Blender座標系を用いる
 * [1, 2, 3] -> 'v 1 3 -2'
 */
function useBlenderCoordinateSystem() {
    exports.vert_to_str = function (v) { return 'v ' + exports.format_florts([v.x, v.z, -v.y]); };
}
exports.useBlenderCoordinateSystem = useBlenderCoordinateSystem;
function geos_to_strings(name, geos) {
    var objfile = name + '.obj';
    var objstrs = [];
    var index = 1; // .objのインデックスは0ではなく1スタート
    geos.forEach(function (geo) {
        objstrs = objstrs.concat(geo.verts.map(function (v) { return exports.vert_to_str(v); }));
        objstrs.push('');
        geo.faces.forEach(function (face) {
            objstrs.push(exports.face_to_str(face.map(function (i) { return i + index; })));
        });
        objstrs.push('');
        index += geo.verts.length;
    });
    return { objstrs: objstrs, objfile: objfile };
}
exports.geos_to_strings = geos_to_strings;
function objs_to_strings(name, objs) {
    var objfile = name + '.obj';
    var mtlfile = name + '.mtl';
    var objstrs = [];
    var index = 1; // .objのインデックスは0ではなく1スタート
    objstrs.push("mtllib " + mtlfile);
    objstrs.push('');
    objs.forEach(function (obj) {
        objstrs.push(obj.name != null ? "## " + obj.name : '##');
        objstrs = objstrs.concat(obj.verts.map(function (v) { return exports.vert_to_str(v); }));
        objstrs.push('');
        obj.faces.forEach(function (face) {
            objstrs.push(face.name != null ? "g " + face.name : 'g');
            objstrs.push(face.material != null ? "usemtl " + face.material.name : '#usemtl');
            objstrs = objstrs.concat(face.clone_offset(index).faces.map(function (f) { return exports.face_to_str(f); }));
            objstrs.push('');
        });
        index += obj.verts.length;
    });
    var mtlstrs = [];
    var mtlset = {};
    objs.forEach(function (obj) {
        obj.faces.forEach(function (face) {
            if (face.material == null || mtlset[face.material.name] == true) {
                return;
            }
            mtlset[face.material.name] = true;
            mtlstrs.push("newmtl " + face.material.name);
            mtlstrs.push(face.material.diffuse != null ? 'Kd ' + face.material.diffuse.join(' ') : '#Kd');
            mtlstrs.push('');
        });
    });
    return { objstrs: objstrs, mtlstrs: mtlstrs, objfile: objfile, mtlfile: mtlfile };
}
exports.objs_to_strings = objs_to_strings;
