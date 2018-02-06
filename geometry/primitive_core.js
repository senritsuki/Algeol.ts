"use strict";
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
var sf = require("./surface_core");
var BasePrimitive = /** @class */ (function () {
    function BasePrimitive(b3, sf, translations) {
        if (translations === void 0) { translations = []; }
        this.b3 = b3;
        this.sf = sf;
        this.translations = translations;
    }
    BasePrimitive.prototype.apply = function (translation) {
        this.translations = this.translations.concat(translation);
    };
    BasePrimitive.prototype.to_boolean = function () {
        var map = this.merge_translation_rev();
        var b3 = this.b3;
        return function (v) { return b3(map.map_v3(v, 1)); };
    };
    BasePrimitive.prototype.to_surfaces = function () {
        return sf.apply(this.sf(), this.merge_translation());
    };
    BasePrimitive.prototype.merge_translation = function () {
        return mx.compose(this.translations.map(function (t) { return t.do(); }));
    };
    BasePrimitive.prototype.merge_translation_rev = function () {
        return mx.compose_rev(this.translations.map(function (t) { return t.doRev(); }));
    };
    return BasePrimitive;
}());
exports.BasePrimitive = BasePrimitive;
var Plane = /** @class */ (function () {
    function Plane(b2, sf) {
        this.b2 = b2;
        this.sf = sf;
    }
    return Plane;
}());
exports.Plane = Plane;
var BaseTranslation2 = /** @class */ (function () {
    function BaseTranslation2(value, map, rev) {
        this.value = value;
        this.map = map;
        this.rev = rev;
    }
    BaseTranslation2.prototype.do = function () {
        return this.map(this.value);
    };
    BaseTranslation2.prototype.doRev = function () {
        return this.map(this.rev(this.value));
    };
    return BaseTranslation2;
}());
exports.BaseTranslation2 = BaseTranslation2;
var BaseTranslation3 = /** @class */ (function () {
    function BaseTranslation3(value, map, rev) {
        this.value = value;
        this.map = map;
        this.rev = rev;
    }
    BaseTranslation3.prototype.do = function () {
        return this.map(this.value);
    };
    BaseTranslation3.prototype.doRev = function () {
        return this.map(this.rev(this.value));
    };
    return BaseTranslation3;
}());
exports.BaseTranslation3 = BaseTranslation3;
var Translate2 = /** @class */ (function (_super) {
    __extends(Translate2, _super);
    function Translate2(v) {
        return _super.call(this, vc.to_v2_if(v), mx.affine2_trans, function (v) { return v.scalar(-1); }) || this;
    }
    return Translate2;
}(BaseTranslation2));
exports.Translate2 = Translate2;
var Translate3 = /** @class */ (function (_super) {
    __extends(Translate3, _super);
    function Translate3(v) {
        return _super.call(this, vc.to_v3_if(v), mx.affine3_trans, function (v) { return v.scalar(-1); }) || this;
    }
    return Translate3;
}(BaseTranslation3));
exports.Translate3 = Translate3;
var Rotate = /** @class */ (function (_super) {
    __extends(Rotate, _super);
    function Rotate(rad, map) {
        return _super.call(this, rad, map, function (rad) { return -rad; }) || this;
    }
    return Rotate;
}(BaseTranslation3));
exports.Rotate = Rotate;
var RotateX = /** @class */ (function (_super) {
    __extends(RotateX, _super);
    function RotateX(rad) {
        return _super.call(this, rad, mx.affine3_rot_x) || this;
    }
    return RotateX;
}(Rotate));
exports.RotateX = RotateX;
var RotateY = /** @class */ (function (_super) {
    __extends(RotateY, _super);
    function RotateY(rad) {
        return _super.call(this, rad, mx.affine3_rot_y) || this;
    }
    return RotateY;
}(Rotate));
exports.RotateY = RotateY;
var RotateZ = /** @class */ (function (_super) {
    __extends(RotateZ, _super);
    function RotateZ(rad) {
        return _super.call(this, rad, mx.affine3_rot_z) || this;
    }
    return RotateZ;
}(Rotate));
exports.RotateZ = RotateZ;
var Scale = /** @class */ (function (_super) {
    __extends(Scale, _super);
    function Scale(v) {
        return _super.call(this, vc.to_v3_if(v), mx.scale_m4, function (v) { return vc.v3(1, 1, 1).el_div(v); }) || this;
    }
    return Scale;
}(BaseTranslation3));
exports.Scale = Scale;
