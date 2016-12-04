var vc = require("./math/vector");
var mx = require("./math/matrix");
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
    return new SpaceImpl(vl[0], ar_basis3(vl.slice(1)));
}
exports.ar_space = ar_space;
exports.default_space = new SpaceDefault();
var ObjImpl = (function () {
    function ObjImpl(_name, _verts, _geo) {
        this._name = _name;
        this._verts = _verts;
        this._geo = _geo;
    }
    ObjImpl.prototype._apply = function (m) {
        this._verts = this._verts.map(function (v) { return vc.v4_v3(m.map(vc.v3_v4(v, 1))); });
    };
    ObjImpl.prototype.duplicateOne = function (m) {
        var o = this.clone();
        o._apply(m);
        return o;
    };
    ObjImpl.prototype.duplicateList = function (ms) {
        var _this = this;
        return ms.map(function (m) { return _this.duplicateOne(m); });
    };
    ObjImpl.prototype.clone = function () {
        return new ObjImpl(this._name, this._verts, this._geo);
    };
    ObjImpl.prototype.geo = function () {
        return this._geo(this._name, this._verts);
    };
    return ObjImpl;
})();
function obj(name, verts, geo) {
    return new ObjImpl(name, verts, geo);
}
exports.obj = obj;
var GeoImpl = (function () {
    function GeoImpl(_name, _verts, _faces) {
        this._name = _name;
        this._verts = _verts;
        this._faces = _faces;
    }
    GeoImpl.prototype.name = function () { return this._name; };
    GeoImpl.prototype.verts = function () { return this._verts; };
    GeoImpl.prototype.faces = function () { return this._faces; };
    return GeoImpl;
})();
function geo(name, verts, faces) {
    return new GeoImpl(name, verts, faces);
}
exports.geo = geo;
function geos_wavefrontObj(geos) {
    return geos.map(function (geo) { return geo_wavefrontObj(geo); }).reduce(function (a, b) { return a.concat(b); });
}
exports.geos_wavefrontObj = geos_wavefrontObj;
function geo_wavefrontObj(geo, offset) {
    if (offset === void 0) { offset = 0; }
    var strs = [];
    strs.push(['g', geo.name()].join(' '));
    geo.verts().forEach(function (v) { return strs.push(['v', v.x(), v.z(), -v.y()].join(' ')); });
    geo.faces().forEach(function (f) { return strs.push(['f'].concat(f.map(function (i) { return '' + (i + 1 + offset); })).join(' ')); });
    return strs;
}
exports.geo_wavefrontObj = geo_wavefrontObj;
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