"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vc = require("./vector");
var mx = require("./matrix");
var ProjectionImpl = (function () {
    function ProjectionImpl(_mx, _lambda) {
        this._mx = _mx;
        this._lambda = _lambda;
    }
    ProjectionImpl.prototype.projection = function (dist) {
        return this._lambda(this._mx.map_v3(dist, 1));
    };
    return ProjectionImpl;
}());
/** Parallel Projection - 平行投影 */
function parallel(m, scale) {
    return new ProjectionImpl(m, function (v) { return v.hadamart([scale, scale, 1]); });
}
exports.parallel = parallel;
/** Perspective Projection - 透視投影 */
function perspective(m, scale, tan, near) {
    if (near === void 0) { near = 1; }
    var c = scale * tan;
    return new ProjectionImpl(m, function (v) { return c >= near ? v.hadamart(vc.v3(c / v.z(), c / v.z(), 1)) : v; });
}
exports.perspective = perspective;
/** x軸方向のプロジェクタをxy平面、奥行きzに変換 */
function viewport_x() {
    return mx.rows_to_m3([
        [0, 0, 1],
        [-1, 0, 0],
        [0, -1, 0],
    ]);
}
exports.viewport_x = viewport_x;
