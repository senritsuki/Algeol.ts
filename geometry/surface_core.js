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
function apply(sf, m) {
    return sf.map(function (v) { return m.map(v); });
}
exports.apply = apply;
function translate(sf, v_add) {
    return apply(sf, mx.affine3_translate(v_add));
}
exports.translate = translate;
function rotate_x(sf, rad) {
    return apply(sf, mx.affine3_rotate_x(rad));
}
exports.rotate_x = rotate_x;
function rotate_y(sf, rad) {
    return apply(sf, mx.affine3_rotate_y(rad));
}
exports.rotate_y = rotate_y;
function rotate_z(sf, rad) {
    return apply(sf, mx.affine3_rotate_z(rad));
}
exports.rotate_z = rotate_z;
function scale(sf, v) {
    return apply(sf, mx.affine3_scale(v));
}
exports.scale = scale;
var MapBase = /** @class */ (function () {
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
/** マテリアル。名前と拡散光 */
var Material = /** @class */ (function () {
    function Material(
    /** マテリアル名 */
    name, 
    /** 拡散光色 */
    diffuse) {
        if (diffuse === void 0) { diffuse = null; }
        this.name = name;
        this.diffuse = diffuse;
    }
    return Material;
}());
exports.Material = Material;
/** 1つ以上の面、名前、マテリアル */
var SurfacesMaterial = /** @class */ (function () {
    function SurfacesMaterial(
    /** 面リスト */
    faces, 
    /** 面リストの名前 */
    name, 
    /** 面リストに対応するマテリアル */
    material) {
        if (material === void 0) { material = null; }
        this.faces = faces;
        this.name = name;
        this.material = material;
    }
    SurfacesMaterial.prototype.clone_offset = function (index_offset) {
        var new_faces = this.faces.map(function (f) { return shift_offset(f, index_offset); });
        return new SurfacesMaterial(new_faces, this.name, this.material);
    };
    return SurfacesMaterial;
}());
exports.SurfacesMaterial = SurfacesMaterial;
/** 頂点リスト、1つ以上の面 */
var Surfaces = /** @class */ (function (_super) {
    __extends(Surfaces, _super);
    function Surfaces(verts, faces) {
        var _this = _super.call(this, verts) || this;
        _this.faces = faces;
        return _this;
    }
    Surfaces.prototype.clone = function () {
        return new Surfaces(this.verts, this.faces);
    };
    return Surfaces;
}(MapBase));
exports.Surfaces = Surfaces;
/**
 * モデル名、頂点リスト、面情報リスト
 * SurfaceModel 1--1 name
 *              1--* verts
 *              1--* faces 1--1 name
 *                         1--1 material
 *                         1--* faces
 */
var SurfaceModel = /** @class */ (function (_super) {
    __extends(SurfaceModel, _super);
    function SurfaceModel(name, verts, faces) {
        var _this = _super.call(this, verts) || this;
        _this.name = name;
        _this.faces = faces;
        return _this;
    }
    SurfaceModel.prototype.clone = function () {
        return new SurfaceModel(this.name, this.verts, this.faces);
    };
    return SurfaceModel;
}(MapBase));
exports.SurfaceModel = SurfaceModel;
function merge_surfaces(sf, material, name) {
    if (name === void 0) { name = null; }
    if (sf instanceof Array) {
        return _geos_to_obj(sf, name, function (_) { return material; });
    }
    else {
        return new SurfaceModel(name, sf.verts, [new SurfacesMaterial(sf.faces, name, material)]);
    }
}
exports.merge_surfaces = merge_surfaces;
function merge_surfaces_materials(sf, materials, name) {
    if (name === void 0) { name = null; }
    return _geos_to_obj(sf, name, function (i) { return materials[i]; });
}
exports.merge_surfaces_materials = merge_surfaces_materials;
function _geos_to_obj(geos, name, f_material) {
    var verts = [];
    var faces = [];
    var index = 0;
    geos.forEach(function (geo, i) {
        verts = verts.concat(geo.verts);
        var f = geo.faces.map(function (f) { return shift_offset(f, index); });
        var m = f_material(i);
        var m_name = m != null ? m.name : null;
        var fg = new SurfacesMaterial(f, m_name, m);
        faces.push(fg);
        index += geo.verts.length;
    });
    return new SurfaceModel(name, verts, faces);
}
function concat_surfaces(sf) {
    var verts = [];
    var faces = [];
    var index = 0;
    sf.forEach(function (geo) {
        verts = verts.concat(geo.verts);
        faces = faces.concat(geo.faces.map(function (f) { return f.map(function (i) { return i + index; }); }));
        index += geo.verts.length;
    });
    return new Surfaces(verts, faces);
}
exports.concat_surfaces = concat_surfaces;
function concat_surface_models(objs, name) {
    if (name === void 0) { name = null; }
    var verts = [];
    var faces = [];
    var index = 0;
    objs.forEach(function (obj) {
        verts = verts.concat(obj.verts);
        faces = faces.concat(obj.faces.map(function (f) { return f.clone_offset(index); }));
        index += obj.verts.length;
    });
    return new SurfaceModel(name, verts, faces);
}
exports.concat_surface_models = concat_surface_models;
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
