// Geometry Duplicater and Affine Map Compositer
var ut = require("./math/util");
var mx = require("./math/matrix");
var al = require("./al");
function duplicate_with_affine(geo, m4) {
    var verts = geo.verts();
    var faces = geo.faces();
    return m4.map(function (m) { return al.geo(verts.map(function (v) { return m.map_v3(v, 1); }), faces); });
}
exports.duplicate_with_affine = duplicate_with_affine;
function duplicate_with_lambda(geo, map) {
    var faces = geo.faces();
    return ut.transpose(geo.verts().map(map)).map(function (verts) { return al.geo(verts, faces); });
}
exports.duplicate_with_lambda = duplicate_with_lambda;
function composite_affine(data, lambdas) {
    return data.map(function (d) { return lambdas.reduce(function (m, lambda) { return m.mul(lambda(d)); }, mx.unit_m4); });
}
exports.composite_affine = composite_affine;
var MatricesComposerImpl = (function () {
    function MatricesComposerImpl(_data) {
        this._data = _data;
    }
    MatricesComposerImpl.prototype.data = function () {
        return this._data;
    };
    MatricesComposerImpl.prototype.compose = function (lambdas) {
        return this._data.map(function (d) { return lambdas.reduce(function (m, lambda) { return m.mul(lambda(d)); }, mx.unit_m4); });
    };
    return MatricesComposerImpl;
})();
//# sourceMappingURL=duplicater.js.map