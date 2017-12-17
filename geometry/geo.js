"use strict";
/** Geometry */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mx = require("../algorithm/matrix");
function shift_offset(face, index_offset) {
    return face.map(function (n) { return n + index_offset; });
}
var Translatable = (function () {
    function Translatable(verts) {
        this.verts = verts;
    }
    Translatable.prototype.clone_update = function (v) {
        var t = this.clone();
        t.verts = v;
        return t;
    };
    Translatable.prototype.clone_apply = function (f) {
        return this.clone_update(this.verts.map(function (v) { return f(v); }));
    };
    Translatable.prototype.clone_apply_m3 = function (m3) {
        return this.clone_apply(m3.map);
    };
    Translatable.prototype.clone_apply_m4 = function (m4) {
        return this.clone_apply(function (v) { return m4.map_v3(v, 1); });
    };
    Translatable.prototype.clone_translate = function (v) {
        return this.clone_update(this.verts.map(function (v2) { return v2.add(v); }));
    };
    Translatable.prototype.clone_rotate_x = function (rad) {
        return this.clone_apply_m3(mx.rot_x_m3(rad));
    };
    Translatable.prototype.clone_rotate_y = function (rad) {
        return this.clone_apply_m3(mx.rot_y_m3(rad));
    };
    Translatable.prototype.clone_rotate_z = function (rad) {
        return this.clone_apply_m3(mx.rot_z_m3(rad));
    };
    Translatable.prototype.clone_scale = function (v) {
        return this.clone_apply_m3(mx.scale_m3(v));
    };
    return Translatable;
}());
var Geo = (function (_super) {
    __extends(Geo, _super);
    function Geo(verts, faces) {
        var _this = _super.call(this, verts) || this;
        _this.faces = faces;
        return _this;
    }
    Geo.prototype.clone = function () {
        return new Geo(this.verts, this.faces);
    };
    return Geo;
}(Translatable));
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
        var new_faces = this.faces.map(function (f) { return shift_offset(f, index_offset); });
        return new FaceGroup(this.name, new_faces, this.material);
    };
    return FaceGroup;
}());
exports.FaceGroup = FaceGroup;
var Obj = (function (_super) {
    __extends(Obj, _super);
    function Obj(name, verts, faces) {
        var _this = _super.call(this, verts) || this;
        _this.name = name;
        _this.faces = faces;
        return _this;
    }
    Obj.prototype.clone = function () {
        return new Obj(this.name, this.verts, this.faces);
    };
    return Obj;
}(Translatable));
exports.Obj = Obj;
function geo_to_obj(geo, name, material) {
    if (name === void 0) { name = null; }
    if (material === void 0) { material = null; }
    return new Obj(name, geo.verts, [new FaceGroup(name, geo.faces, material)]);
}
exports.geo_to_obj = geo_to_obj;
function merge_geos(geos, material, name) {
    if (name === void 0) { name = null; }
    return _merge_geos(geos, name, function (_) { return material; });
}
exports.merge_geos = merge_geos;
function merge_geos_materials(geos, materials, name) {
    if (materials === void 0) { materials = []; }
    if (name === void 0) { name = null; }
    return _merge_geos(geos, name, function (i) { return materials[i]; });
}
exports.merge_geos_materials = merge_geos_materials;
function _merge_geos(geos, name, f_material) {
    var verts = [];
    var faces = [];
    var index = 0;
    geos.forEach(function (geo, i) {
        verts = verts.concat(geo.verts);
        var f = geo.faces.map(function (f) { return shift_offset(f, index); });
        var m = f_material(i);
        var m_name = m != null ? m.name : null;
        var fg = new FaceGroup(m_name, f, m);
        faces.push(fg);
        index += geo.verts.length;
    });
    return new Obj(name, verts, faces);
}
function merge_objs(objs, name) {
    if (name === void 0) { name = null; }
    var verts = [];
    var faces = [];
    var index = 0;
    objs.forEach(function (obj) {
        verts = verts.concat(obj.verts);
        faces = faces.concat(obj.faces.map(function (f) { return f.clone_offset(index); }));
        index += obj.verts.length;
    });
    return new Obj(name, verts, faces);
}
exports.merge_objs = merge_objs;
/** 4次元行列リストを写像配列に変換 */
function m4s_to_maps(mm) {
    return mm.map(function (m) { return function (v) { return m.map_v3(v, 1); }; });
}
exports.m4s_to_maps = m4s_to_maps;
/** 写像配列を用いたジオメトリ・オブジェクト配列複製 */
function duplicate(obj, maps) {
    return maps.map(function (m) { return obj.clone_apply(m); });
}
exports.duplicate = duplicate;
/** 写像配列を用いた3次元ベクトル配列複製 */
function duplicate_verts(verts, maps) {
    return maps.map(function (m) { return verts.map(m); });
}
exports.duplicate_verts = duplicate_verts;
/** 任意のデータ配列を用いた合成写像の生成 */
function composite_m4(data, lambdas) {
    return data.map(function (d) { return lambdas.reduce(function (m, lambda) { return lambda(d).mul(m); }, mx.unit_m4); });
}
exports.composite_m4 = composite_m4;
/** 任意のデータ配列を用いた合成写像の生成 */
function compose(data, lambdas) {
    return m4s_to_maps(composite_m4(data, lambdas));
}
exports.compose = compose;
