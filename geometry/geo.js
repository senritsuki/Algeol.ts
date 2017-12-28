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
var vc = require("../algorithm/vector");
var mx = require("../algorithm/matrix");
function shift_offset(face, index_offset) {
    return face.map(function (n) { return n + index_offset; });
}
function apply(geo, m) {
    return geo.map(function (v) { return m.map(v); });
}
exports.apply = apply;
function translate(geo, v_add) {
    return apply(geo, mx.trans_m4(v_add));
}
exports.translate = translate;
function rotate_x(geo, rad) {
    return apply(geo, mx.rot_x_m4(rad));
}
exports.rotate_x = rotate_x;
function rotate_y(geo, rad) {
    return apply(geo, mx.rot_y_m4(rad));
}
exports.rotate_y = rotate_y;
function rotate_z(geo, rad) {
    return apply(geo, mx.rot_z_m4(rad));
}
exports.rotate_z = rotate_z;
function scale(geo, v) {
    return apply(geo, mx.scale_m4(v));
}
exports.scale = scale;
var MapBase = (function () {
    function MapBase(verts) {
        this.verts = verts;
    }
    MapBase.prototype.clone_update = function (v) {
        var t = this.clone();
        t.verts = v;
        return t;
    };
    MapBase.prototype.map = function (f) {
        return this.clone_update(this.verts.map(function (v) { return vc.v4map_v3(v, 1, f); }));
    };
    MapBase.prototype.map3 = function (f) {
        return this.clone_update(this.verts.map(function (v) { return f(v); }));
    };
    return MapBase;
}());
exports.MapBase = MapBase;
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
}(MapBase));
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
}(MapBase));
exports.Obj = Obj;
function geo_to_obj(geo, material, name) {
    if (name === void 0) { name = null; }
    return new Obj(name, geo.verts, [new FaceGroup(name, geo.faces, material)]);
}
exports.geo_to_obj = geo_to_obj;
function geos_to_obj(geos, material, name) {
    if (name === void 0) { name = null; }
    return _geos_to_obj(geos, name, function (_) { return material; });
}
exports.geos_to_obj = geos_to_obj;
function geos_mats_to_obj(geos, materials, name) {
    if (name === void 0) { name = null; }
    return _geos_to_obj(geos, name, function (i) { return materials[i]; });
}
exports.geos_mats_to_obj = geos_mats_to_obj;
function _geos_to_obj(geos, name, f_material) {
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
function merge_geos(geos) {
    var verts = [];
    var faces = [];
    var index = 0;
    geos.forEach(function (geo) {
        verts = verts.concat(geo.verts);
        faces = faces.concat(geo.faces.map(function (f) { return f.map(function (i) { return i + index; }); }));
        index += geo.verts.length;
    });
    return new Geo(verts, faces);
}
exports.merge_geos = merge_geos;
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
function m4s_to_v3maps(mm) {
    return mm.map(function (m) { return function (v) { return m.map_v3(v, 1); }; });
}
exports.m4s_to_v3maps = m4s_to_v3maps;
/** 4次元行列リストを写像配列に変換 */
function m4s_to_v4maps(mm) {
    return mm.map(function (m) { return function (v) { return m.map(v); }; });
}
exports.m4s_to_v4maps = m4s_to_v4maps;
/** 写像配列を用いたジオメトリ・オブジェクト配列複製 */
function duplicate_f(obj, v4maps) {
    return v4maps.map(function (f) { return obj.map(function (v) { return f(v); }); });
}
exports.duplicate_f = duplicate_f;
/** 写像配列を用いた3次元ベクトル配列複製 */
function duplicate_v3(verts, w, v4maps) {
    return v4maps.map(function (m) { return verts.map(function (v) { return vc.v4map_v3(v, w, m); }); });
}
exports.duplicate_v3 = duplicate_v3;
/** 任意のデータ配列を用いた合成写像の生成 */
function compose_m4(data, lambdas) {
    return data.map(function (d) { return lambdas.reduce(function (m, lambda) { return lambda(d).mul(m); }, mx.unit_m4); });
}
exports.compose_m4 = compose_m4;
/** 任意のデータ配列を用いた合成写像の生成 */
function compose_v3map(data, lambdas) {
    return m4s_to_v3maps(compose_m4(data, lambdas));
}
exports.compose_v3map = compose_v3map;
/** 任意のデータ配列を用いた合成写像の生成 */
function compose_v4map(data, lambdas) {
    return m4s_to_v4maps(compose_m4(data, lambdas));
}
exports.compose_v4map = compose_v4map;
