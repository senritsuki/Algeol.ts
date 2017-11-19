"use strict";
/** Algorithm and Geometry - ジオメトリと複製アルゴリズム */
Object.defineProperty(exports, "__esModule", { value: true });
var mx = require("../algorithm/matrix");
var GeoImpl = (function () {
    function GeoImpl(_verts, _faces) {
        this._verts = _verts;
        this._faces = _faces;
    }
    GeoImpl.prototype.verts = function () {
        return this._verts;
    };
    GeoImpl.prototype.faces = function () {
        return this._faces;
    };
    GeoImpl.prototype.clone = function (lambda) {
        return new GeoImpl(this._verts.map(lambda), this._faces);
    };
    return GeoImpl;
}());
var GeoGroupImpl = (function () {
    function GeoGroupImpl(_name, _geos) {
        this._name = _name;
        this._geos = _geos;
    }
    GeoGroupImpl.prototype.verts = function () {
        return this._geos
            .map(function (geo) { return geo.verts(); })
            .reduce(function (array, verts) { return array.concat(verts); }, []);
    };
    GeoGroupImpl.prototype.faces = function () {
        var faces = [];
        var offset = 0;
        this._geos.forEach(function (geo) {
            geo.faces()
                .map(function (face) { return face.map(function (i) { return i + offset; }); })
                .forEach(function (face) { return faces.push(face); });
            offset += geo.verts().length;
        });
        return faces;
    };
    GeoGroupImpl.prototype.name = function () {
        return this._name;
    };
    GeoGroupImpl.prototype.geos = function () {
        return this._geos;
    };
    GeoGroupImpl.prototype.clone = function (lambda) {
        return new GeoGroupImpl(this._name, this._geos.map(function (g) { return g.clone(lambda); }));
    };
    return GeoGroupImpl;
}());
var GeoDictImpl = (function () {
    function GeoDictImpl(geogroups) {
        var _this = this;
        this._names = [];
        this._dict = {};
        geogroups.forEach(function (geogroup) {
            var name = geogroup.name();
            if (_this._dict[name] == undefined) {
                _this._dict[name] = geogroup;
                _this._names.push(name);
            }
            else {
                _this._dict[name] = new GeoGroupImpl(name, _this._dict[name].geos().concat(geogroup.geos()));
            }
        });
    }
    GeoDictImpl.Merge = function (geodicts) {
        return new GeoDictImpl(geodicts.reduce(function (geogroups, geodict) { return geogroups.concat(geodict.geogroups()); }, []));
    };
    GeoDictImpl.prototype.verts = function () {
        return this.geogroups()
            .map(function (geo) { return geo.verts(); })
            .reduce(function (array, verts) { return array.concat(verts); }, []);
    };
    GeoDictImpl.prototype.faces = function () {
        var faces = [];
        var offset = 0;
        this.geogroups().forEach(function (geo) {
            geo.faces()
                .map(function (face) { return face.map(function (i) { return i + offset; }); })
                .forEach(function (face) { return faces.push(face); });
            offset += geo.verts().length;
        });
        return faces;
    };
    GeoDictImpl.prototype.dict = function () {
        return this._dict;
    };
    GeoDictImpl.prototype.geogroups = function () {
        var _this = this;
        return this._names.map(function (name) { return _this._dict[name]; });
    };
    GeoDictImpl.prototype.clone = function (lambda) {
        return new GeoDictImpl(this.geogroups().map(function (geogroup) { return geogroup.clone(lambda); }));
    };
    return GeoDictImpl;
}());
/** (頂点(3次元ベクトル)の配列, 面(頂点インデックス配列)の配列) -> ジオメトリ */
function geo(verts, faces) {
    return new GeoImpl(verts, faces);
}
exports.geo = geo;
/** (グループ名, ジオメトリの配列) -> ジオメトリグループ */
function geoGroup(name, geos) {
    return new GeoGroupImpl(name, geos);
}
exports.geoGroup = geoGroup;
/** (ジオメトリグループの配列) -> ジオメトリグループ辞書 */
function geoDict(geogroups) {
    return new GeoDictImpl(geogroups);
}
exports.geoDict = geoDict;
/** (ジオメトリグループ辞書の配列) -> ジオメトリグループ辞書 */
function merge_geoDict(geodicts) {
    return GeoDictImpl.Merge(geodicts);
}
exports.merge_geoDict = merge_geoDict;
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
/** 写像配列を用いたジオメトリ複製 */
function duplicateGeo(g, maps) {
    var verts = g.verts();
    var faces = g.faces();
    return maps.map(function (m) { return geo(verts.map(m), faces); });
}
exports.duplicateGeo = duplicateGeo;
/** アフィン写像配列を用いたジオメトリ複製 */
function duplicateGeoAffine(g, m4) {
    return duplicateGeo(g, map_mm4(m4));
}
exports.duplicateGeoAffine = duplicateGeoAffine;
/** 写像配列を用いたジオメトリグループ複製 */
function duplicateGeoGroup(gg, maps) {
    var gg2 = gg.geos()
        .map(function (g) { return duplicateGeo(g, maps); })
        .reduce(function (a, b) { return a.concat(b); }, []);
    return geoGroup(gg.name(), gg2);
}
exports.duplicateGeoGroup = duplicateGeoGroup;
/** アフィン写像配列を用いたジオメトリグループ複製 */
function duplicateGeoGroupAffine(gg, m4) {
    return duplicateGeoGroup(gg, map_mm4(m4));
}
exports.duplicateGeoGroupAffine = duplicateGeoGroupAffine;
/** 写像配列を用いたジオメトリ辞書複製 */
function duplicateGeoDict(gd, maps) {
    var gg2 = gd.geogroups()
        .map(function (gg) { return duplicateGeoGroup(gg, maps); })
        .reduce(function (a, b) { return a.concat(b); }, []);
    return geoDict(gg2);
}
exports.duplicateGeoDict = duplicateGeoDict;
/** アフィン写像配列を用いたジオメトリ辞書複製 */
function duplicateGeoDictAffine(gd, m4) {
    return duplicateGeoDict(gd, map_mm4(m4));
}
exports.duplicateGeoDictAffine = duplicateGeoDictAffine;
/** 任意のデータ配列を用いた合成写像の生成 */
function compositeMap(data, lambdas) {
    return data.map(function (d) { return lambdas.reduce(function (m, lambda) { return lambda(d).mul(m); }, mx.unit_m4); });
}
exports.compositeMap = compositeMap;
