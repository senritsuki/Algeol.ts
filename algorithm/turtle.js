"use strict";
/** Turtle graphics - タートルグラフィックス */
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
var ut = require("./utility");
var vc = require("./vector");
var cv = require("./curve");
var priv;
(function (priv) {
    var TLTupleImpl = (function () {
        function TLTupleImpl(turtle, line) {
            this.turtle = turtle;
            this.line = line;
        }
        return TLTupleImpl;
    }());
    priv.TLTupleImpl = TLTupleImpl;
    var TurtleImpl = (function () {
        function TurtleImpl(_coord) {
            this._coord = _coord;
        }
        TurtleImpl.prototype.coord = function () {
            return this._coord;
        };
        return TurtleImpl;
    }());
    priv.TurtleImpl = TurtleImpl;
    var TurtleDImpl = (function (_super) {
        __extends(TurtleDImpl, _super);
        function TurtleDImpl(_coord, _degree) {
            var _this = _super.call(this, _coord) || this;
            _this._degree = _degree;
            return _this;
        }
        TurtleDImpl.prototype.move = function (len) {
            var src = this._coord;
            var dir = vc.polar_to_v2(len, ut.deg_to_rad(this._degree));
            var dst = this._coord.add(dir);
            var newTurtle = new TurtleDImpl(dst, this._degree);
            var line = cv.line(src, dst);
            return new TLTupleImpl(newTurtle, line);
        };
        TurtleDImpl.prototype.degree = function () {
            return this._degree;
        };
        TurtleDImpl.prototype.setDegree = function (degree) {
            return new TurtleDImpl(this._coord, degree);
        };
        TurtleDImpl.prototype.addDegree = function (degree) {
            return new TurtleDImpl(this._coord, this._degree + degree);
        };
        return TurtleDImpl;
    }(TurtleImpl));
    priv.TurtleDImpl = TurtleDImpl;
    var TurtleVImpl = (function (_super) {
        __extends(TurtleVImpl, _super);
        function TurtleVImpl(_coord, _dir) {
            var _this = _super.call(this, _coord) || this;
            _this._dir = _dir;
            return _this;
        }
        TurtleVImpl.prototype.move = function (len) {
            var src = this._coord;
            var dir = this._dir.scalar(len);
            var dst = this._coord.add(dir);
            var newTurtle = new TurtleVImpl(dst, this._dir);
            var line = cv.line(src, dst);
            return new TLTupleImpl(newTurtle, line);
        };
        TurtleVImpl.prototype.dir = function () {
            return this._dir;
        };
        TurtleVImpl.prototype.setDir = function (dir) {
            return new TurtleVImpl(this._coord, dir);
        };
        TurtleVImpl.prototype.addDir = function (dir) {
            return new TurtleVImpl(this._coord, this._dir.add(dir));
        };
        return TurtleVImpl;
    }(TurtleImpl));
    priv.TurtleVImpl = TurtleVImpl;
})(priv || (priv = {}));
exports.turtle_with_deg = function (coord, degree) { return new priv.TurtleDImpl(coord, degree); };
exports.turtle_with_dir = function (coord, dir) { return new priv.TurtleVImpl(coord, dir); };
exports.turtle_with_dir2 = function (coord, dir) { return exports.turtle_with_dir(coord, dir); };
exports.turtle_with_dir3 = function (coord, dir) { return exports.turtle_with_dir(coord, dir); };
exports.turtle_with_dir4 = function (coord, dir) { return exports.turtle_with_dir(coord, dir); };
