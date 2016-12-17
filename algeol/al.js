var ut = require("./math/util");
var vc = require("./math/vector");
var mx = require("./math/matrix");
var seqlim = require("./seqlim");
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
    GeoImpl.prototype.vertsNum = function () {
        return this._verts.length;
    };
    return GeoImpl;
})();
var GeoGroupImpl = (function () {
    function GeoGroupImpl(_name, _geos) {
        this._name = _name;
        this._geos = _geos;
    }
    GeoGroupImpl.prototype.name = function () {
        return this._name;
    };
    GeoGroupImpl.prototype.geos = function () {
        return this._geos;
    };
    GeoGroupImpl.prototype.vertsNum = function () {
        return this.geos().reduce(function (n, geo) { return n + geo.vertsNum(); }, 0);
    };
    return GeoGroupImpl;
})();
function geo(verts, faces) {
    return new GeoImpl(verts, faces);
}
exports.geo = geo;
function geoGroup(name, geos) {
    return new GeoGroupImpl(name, geos);
}
exports.geoGroup = geoGroup;
var ObjBaseImpl = (function () {
    function ObjBaseImpl(_o, _x, _y, _z) {
        if (_o === void 0) { _o = vc.zero_v3; }
        if (_x === void 0) { _x = vc.unitX_v3; }
        if (_y === void 0) { _y = vc.unitY_v3; }
        if (_z === void 0) { _z = vc.unitZ_v3; }
        this._o = _o;
        this._x = _x;
        this._y = _y;
        this._z = _z;
    }
    ObjBaseImpl.FromArrayOXYZ = function (v) { return new ObjBaseImpl(v[0], v[1], v[2], v[3]); };
    ObjBaseImpl.prototype.arrayOXYZ = function () { return [this._o, this._x, this._y, this._z]; };
    ObjBaseImpl.prototype.o = function () { return this._o; };
    ObjBaseImpl.prototype.x = function () { return this._x; };
    ObjBaseImpl.prototype.y = function () { return this._y; };
    ObjBaseImpl.prototype.z = function () { return this._z; };
    ObjBaseImpl.prototype.m4 = function () { return mx.v4cols_m4([this._x, this._y, this._z, this._o].map(function (v) { return vc.v3_v4(v, 1); })); };
    return ObjBaseImpl;
})();
exports.oxyz_default = new ObjBaseImpl();
var ObjOXYZ = (function () {
    function ObjOXYZ(_geo, _oxyz) {
        if (_oxyz === void 0) { _oxyz = exports.oxyz_default; }
        this._geo = _geo;
        this._oxyz = _oxyz;
    }
    ObjOXYZ.prototype.duplicate = function (seqlim) {
        var _this = this;
        var ar_oxyz = this._oxyz.arrayOXYZ().map(seqlim);
        var la_oxyz = function (i) { return ObjBaseImpl.FromArrayOXYZ(ut.seq.arith(4).map(function (j) { return ar_oxyz[j][i]; })); };
        var ar_i = ut.seq.arith(ar_oxyz[0].length);
        return ar_i.map(function (i) { return new ObjOXYZ(_this._geo, la_oxyz(i)); });
    };
    ObjOXYZ.prototype.geo = function () {
        return this._geo(this._oxyz);
    };
    return ObjOXYZ;
})();
var Basis3Impl = (function () {
    function Basis3Impl(_x, _y, _z) {
        this._x = _x;
        this._y = _y;
        this._z = _z;
    }
    Basis3Impl.prototype.array = function () { return [this._x, this._y, this._z]; };
    Basis3Impl.prototype.x = function () { return this._x; };
    Basis3Impl.prototype.y = function () { return this._y; };
    Basis3Impl.prototype.z = function () { return this._z; };
    Basis3Impl.prototype.m4 = function () { return mx.m3_m4(mx.v3cols_m3(this.array())); };
    return Basis3Impl;
})();
var Basis3Default = (function () {
    function Basis3Default() {
    }
    Basis3Default.prototype.array = function () { return [this.x(), this.y(), this.z()]; };
    Basis3Default.prototype.x = function () { return vc.unitX_v3; };
    Basis3Default.prototype.y = function () { return vc.unitY_v3; };
    Basis3Default.prototype.z = function () { return vc.unitZ_v3; };
    Basis3Default.prototype.m4 = function () { return mx.unit_m4; };
    return Basis3Default;
})();
function basis3(x, y, z) {
    return new Basis3Impl(x, y, z);
}
exports.basis3 = basis3;
function ar_basis3(vl) {
    return new Basis3Impl(vl[0], vl[1], vl[2]);
}
exports.ar_basis3 = ar_basis3;
exports.default_basis3 = new Basis3Default();
var SpaceImpl = (function () {
    function SpaceImpl(_c, _d) {
        this._c = _c;
        this._d = _d;
    }
    SpaceImpl.prototype.array = function () { return [this._c].concat(this._d.array()); };
    SpaceImpl.prototype.c = function () { return this._c; };
    SpaceImpl.prototype.d = function () { return this._d; };
    SpaceImpl.prototype.m4 = function () { return mx.trans_v3_m4(this._c).mul(this._d.m4()); };
    return SpaceImpl;
})();
var SpaceDefault = (function () {
    function SpaceDefault() {
    }
    SpaceDefault.prototype.array = function () { return SpaceDefault._array; };
    SpaceDefault.prototype.c = function () { return SpaceDefault._c; };
    SpaceDefault.prototype.d = function () { return SpaceDefault._d; };
    SpaceDefault.prototype.m4 = function () { return mx.unit_m4; };
    SpaceDefault._c = vc.zero_v3;
    SpaceDefault._d = exports.default_basis3;
    SpaceDefault._array = [vc.zero_v3].concat(exports.default_basis3.array());
    return SpaceDefault;
})();
function space(c, d) {
    return new SpaceImpl(c, d);
}
exports.space = space;
function ar_space(vl) {
    var c = vl[0];
    var d = vl.slice(1).map(function (v) { return v.sub(c); });
    return new SpaceImpl(c, ar_basis3(d));
}
exports.ar_space = ar_space;
exports.default_space = new SpaceDefault();
var _ObjImpl = (function () {
    function _ObjImpl(_name, _verts, _geo) {
        this._name = _name;
        this._verts = _verts;
        this._geo = _geo;
    }
    _ObjImpl.prototype._apply = function (m) {
        this._verts = this._verts.map(function (v) { return vc.v4_v3(m.map_v4(vc.v3_v4(v, 1))); });
    };
    _ObjImpl.prototype.duplicateOne = function (m) {
        var o = this.clone();
        o._apply(m);
        return o;
    };
    _ObjImpl.prototype.duplicateList = function (ms) {
        var _this = this;
        return ms.map(function (m) { return _this.duplicateOne(m); });
    };
    _ObjImpl.prototype.clone = function () {
        return new _ObjImpl(this._name, this._verts, this._geo);
    };
    _ObjImpl.prototype.geo = function () {
        return this._geo(this._name, this._verts);
    };
    return _ObjImpl;
})();
function _obj(name, verts, geo) {
    return new _ObjImpl(name, verts, geo);
}
exports._obj = _obj;
var LimObjImpl = (function () {
    function LimObjImpl(_obj, _lims) {
        this._obj = _obj;
        this._lims = _lims;
    }
    LimObjImpl.prototype.obj = function () {
        return this._obj;
    };
    LimObjImpl.prototype.lims = function () {
        return this._lims;
    };
    LimObjImpl.prototype.geo = function () {
        return this._obj.duplicateList(seqlim.merge(this._lims).lim()).map(function (o) { return o.geo(); });
    };
    return LimObjImpl;
})();
function limobj(obj, lims) {
    return new LimObjImpl(obj, lims);
}
exports.limobj = limobj;
/*
class Spiral implements Curve {
    constructor(
        _o: vc._Vector3,
        _dirStart: vc._Vector3,
        _dirEnd: vc._Vector3) { }

    coord(t: number): vc._Vector3 { return null; }
    space(t: number, d: number): Space { return null; }
    seqCoord(start: number, step: number, count: number): vc._Vector3[] { return null; }
    seqSpace(start: number, step: number, count: number): Space[] { return null; }
}
*/
//# sourceMappingURL=al.js.map