"use strict";
/** Geometry */
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("../algorithm/utility");
var mx = require("../algorithm/matrix");
var priv;
(function (priv) {
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
    priv.GeoImpl = GeoImpl;
    var GeoGroupImpl = (function () {
        function GeoGroupImpl(_name, _geos, _color) {
            if (_color === void 0) { _color = null; }
            this._name = _name;
            this._geos = _geos;
            this._color = _color;
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
        GeoGroupImpl.prototype.units = function () {
            return this._geos;
        };
        GeoGroupImpl.prototype.clone = function (lambda) {
            return new GeoGroupImpl(this._name, this._geos.map(function (g) { return g.clone(lambda); }));
        };
        GeoGroupImpl.prototype.getColor = function () {
            return this._color;
        };
        GeoGroupImpl.prototype.setColor = function (color) {
            this._color = color;
        };
        return GeoGroupImpl;
    }());
    priv.GeoGroupImpl = GeoGroupImpl;
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
                    _this._dict[name] = new GeoGroupImpl(name, _this._dict[name].units().concat(geogroup.units()));
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
    priv.GeoDictImpl = GeoDictImpl;
    priv.map_mm4 = function (mm) { return mm.map(function (m) { return function (v) { return m.map_v3(v, 1); }; }); };
})(priv || (priv = {}));
/** (頂点(3次元ベクトル)の配列, 面(頂点インデックス配列)の配列) -> ジオメトリ */
function geoUnit(verts, faces) {
    return new priv.GeoImpl(verts, faces);
}
exports.geoUnit = geoUnit;
/** (グループ名, ジオメトリの配列) -> ジオメトリグループ */
function geo(name, units) {
    return new priv.GeoGroupImpl(name, units);
}
exports.geo = geo;
/** (グループ名, ジオメトリの配列, ジオメトリの色) -> ジオメトリグループ */
function coloredGeo(name, units, color) {
    return new priv.GeoGroupImpl(name, units, color);
}
exports.coloredGeo = coloredGeo;
/** (ジオメトリグループの配列) -> ジオメトリグループ辞書 */
function geoDict(geogroups) {
    return new priv.GeoDictImpl(geogroups);
}
exports.geoDict = geoDict;
/** (ジオメトリグループ辞書の配列) -> ジオメトリグループ辞書 */
function mergeGeoDict(geodicts) {
    return priv.GeoDictImpl.Merge(geodicts);
}
exports.mergeGeoDict = mergeGeoDict;
function applyColors(geos, colors) {
    var iMax = ut.min(geos.length, colors.length);
    for (var i = 0; i < iMax; i++) {
        geos[i].setColor(colors[i]);
    }
}
exports.applyColors = applyColors;
/** 写像配列を用いた3次元ベクトル配列複製 */
function duplicateVerts(verts, maps) {
    return maps.map(function (m) { return verts.map(m); });
}
exports.duplicateVerts = duplicateVerts;
/** アフィン写像配列を用いた3次元ベクトル配列複製 */
function duplicateVertsAffine(verts, m4) {
    return duplicateVerts(verts, priv.map_mm4(m4));
}
exports.duplicateVertsAffine = duplicateVertsAffine;
/** 写像配列を用いたジオメトリ複製 */
function duplicateGeoUnit(g, maps) {
    var verts = g.verts();
    var faces = g.faces();
    return maps.map(function (m) { return geoUnit(verts.map(m), faces); });
}
exports.duplicateGeoUnit = duplicateGeoUnit;
/** 写像配列を用いたジオメトリグループ複製 */
function duplicateGeo(gg, maps) {
    var gg2 = gg.units()
        .map(function (g) { return duplicateGeoUnit(g, maps); })
        .reduce(function (a, b) { return a.concat(b); }, []);
    return geo(gg.name(), gg2);
}
exports.duplicateGeo = duplicateGeo;
/** 写像配列を用いたジオメトリ辞書複製 */
function duplicateGeoDict(gd, maps) {
    var gg2 = gd.geogroups()
        .map(function (gg) { return duplicateGeo(gg, maps); })
        .reduce(function (a, b) { return a.concat(b); }, []);
    return geoDict(gg2);
}
exports.duplicateGeoDict = duplicateGeoDict;
exports.affines_to_maps = function (m4) { return priv.map_mm4(m4); };
/** 任意のデータ配列を用いた合成写像の生成 */
function compositeMap(data, lambdas) {
    return data.map(function (d) { return lambdas.reduce(function (m, lambda) { return lambda(d).mul(m); }, mx.unit_m4); });
}
exports.compositeMap = compositeMap;
