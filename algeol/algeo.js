/** Algorithm and Geometry - ジオメトリと複製アルゴリズム */
var ut = require("./math/util");
var mx = require("./math/matrix");
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
    GeoImpl.prototype.duplicate = function (lambda) {
        return lambda(this);
    };
    return GeoImpl;
})();
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
    GeoGroupImpl.prototype.duplicate = function (lambda) {
        return new GeoGroupImpl(this._name, this._geos.map(lambda).reduce(function (a, b) { return a.concat(b); }, []));
    };
    return GeoGroupImpl;
})();
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
    GeoDictImpl.prototype.duplicate = function (lambda) {
        return new GeoDictImpl(this.geogroups().map(function (geogroup) { return geogroup.duplicate(lambda); }));
    };
    return GeoDictImpl;
})();
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
/** アフィン写像によるジオメトリ複製 */
function duplicateGeoWithAffine(g, m4) {
    var verts = g.verts();
    var faces = g.faces();
    return m4.map(function (m) { return geo(verts.map(function (v) { return m.map_v3(v, 1); }), faces); });
}
exports.duplicateGeoWithAffine = duplicateGeoWithAffine;
/** 3次元→3次元のラムダ関数によるジオメトリ複製 */
function duplicateGeoWithLambda(g, map) {
    var faces = g.faces();
    return ut.transpose(g.verts().map(map)).map(function (verts) { return geo(verts, faces); });
}
exports.duplicateGeoWithLambda = duplicateGeoWithLambda;
/** データ配列を併用したアフィン写像の合成 */
function compositeAffineWithDataArray(data, lambdas) {
    return data.map(function (d) { return lambdas.reduce(function (m, lambda) { return m.mul(lambda(d)); }, mx.unit_m4); });
}
exports.compositeAffineWithDataArray = compositeAffineWithDataArray;
//# sourceMappingURL=algeo.js.map