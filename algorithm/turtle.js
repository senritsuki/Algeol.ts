"use strict";
/** Turtle graphics - タートルグラフィックス */
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("./utility");
var vc = require("./vector");
var cv2 = require("./curve2");
var cv3 = require("./curve3");
var Turtle2Impl = (function () {
    function Turtle2Impl(_coord, _degree) {
        this._coord = _coord;
        this._degree = _degree;
    }
    Turtle2Impl.prototype.coord = function () {
        return this._coord;
    };
    Turtle2Impl.prototype.dir = function () {
        return vc.polar_v2(1, ut.deg_rad(this._degree));
    };
    Turtle2Impl.prototype.moveDraw = function (len) {
        var dist = this.move(len);
        var line = cv2.line(this.coord(), dist.coord());
        return { turtle: dist, line: line };
    };
    Turtle2Impl.prototype.move = function (len) {
        return new Turtle2Impl(this._coord.add(this.dir().scalar(len)), this._degree);
    };
    Turtle2Impl.prototype.turn = function (degree) {
        return new Turtle2Impl(this._coord, this._degree + degree);
    };
    return Turtle2Impl;
}());
var Turtle3Impl = (function () {
    function Turtle3Impl(_coord, _degreeH, _degreeV) {
        this._coord = _coord;
        this._degreeH = _degreeH;
        this._degreeV = _degreeV;
    }
    Turtle3Impl.prototype.coord = function () {
        return this._coord;
    };
    Turtle3Impl.prototype.dir = function () {
        return vc.sphere_v3(1, ut.deg_rad(this._degreeH), ut.deg_rad(this._degreeV));
    };
    Turtle3Impl.prototype.moveDraw = function (len) {
        var dist = this.move(len);
        var line = cv3.line(this.coord(), dist.coord());
        return { turtle: dist, line: line };
    };
    Turtle3Impl.prototype.move = function (len) {
        return new Turtle3Impl(this._coord.add(this.dir().scalar(len)), this._degreeH, this._degreeV);
    };
    Turtle3Impl.prototype.turnH = function (degree) {
        return new Turtle3Impl(this._coord, this._degreeH + degree, this._degreeV);
    };
    Turtle3Impl.prototype.turnV = function (degree) {
        return new Turtle3Impl(this._coord, this._degreeH, this._degreeV + degree);
    };
    return Turtle3Impl;
}());
function turtle2(coord, degree) {
    if (coord === void 0) { coord = vc.zero_v2; }
    if (degree === void 0) { degree = 0; }
    return new Turtle2Impl(coord, degree);
}
exports.turtle2 = turtle2;
function turtle3(coord, degreeH, degreeV) {
    if (coord === void 0) { coord = vc.zero_v3; }
    if (degreeH === void 0) { degreeH = 0; }
    if (degreeV === void 0) { degreeV = 0; }
    return new Turtle3Impl(coord, degreeH, degreeV);
}
exports.turtle3 = turtle3;
