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
var BaseTransformation = /** @class */ (function () {
    function BaseTransformation(value, map, rev) {
        this.value = value;
        this.map = map;
        this.rev = rev;
    }
    BaseTransformation.prototype.do = function () {
        return this.map(this.value);
    };
    BaseTransformation.prototype.doRev = function () {
        return this.map(this.rev(this.value));
    };
    return BaseTransformation;
}());
var BaseAffineTransformation2 = /** @class */ (function (_super) {
    __extends(BaseAffineTransformation2, _super);
    function BaseAffineTransformation2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BaseAffineTransformation2;
}(BaseTransformation));
var BaseAffineTransformation3 = /** @class */ (function (_super) {
    __extends(BaseAffineTransformation3, _super);
    function BaseAffineTransformation3() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BaseAffineTransformation3;
}(BaseTransformation));
var Translate2 = /** @class */ (function (_super) {
    __extends(Translate2, _super);
    function Translate2(v) {
        return _super.call(this, vc.to_v2_if(v), mx.affine2_translate, function (v) { return v.scalar(-1); }) || this;
    }
    return Translate2;
}(BaseAffineTransformation2));
var Translate3 = /** @class */ (function (_super) {
    __extends(Translate3, _super);
    function Translate3(v) {
        return _super.call(this, vc.to_v3_if(v), mx.affine3_translate, function (v) { return v.scalar(-1); }) || this;
    }
    return Translate3;
}(BaseAffineTransformation3));
var Rotate2 = /** @class */ (function (_super) {
    __extends(Rotate2, _super);
    function Rotate2(rad) {
        return _super.call(this, rad, mx.affine2_rotate, function (rad) { return -rad; }) || this;
    }
    return Rotate2;
}(BaseAffineTransformation2));
var Rotate3 = /** @class */ (function (_super) {
    __extends(Rotate3, _super);
    function Rotate3(rad, map) {
        return _super.call(this, rad, map, function (rad) { return -rad; }) || this;
    }
    return Rotate3;
}(BaseAffineTransformation3));
var Rotate3X = /** @class */ (function (_super) {
    __extends(Rotate3X, _super);
    function Rotate3X(rad) {
        return _super.call(this, rad, mx.affine3_rotate_x) || this;
    }
    return Rotate3X;
}(Rotate3));
var Rotate3Y = /** @class */ (function (_super) {
    __extends(Rotate3Y, _super);
    function Rotate3Y(rad) {
        return _super.call(this, rad, mx.affine3_rotate_y) || this;
    }
    return Rotate3Y;
}(Rotate3));
var Rotate3Z = /** @class */ (function (_super) {
    __extends(Rotate3Z, _super);
    function Rotate3Z(rad) {
        return _super.call(this, rad, mx.affine3_rotate_z) || this;
    }
    return Rotate3Z;
}(Rotate3));
var Scale2 = /** @class */ (function (_super) {
    __extends(Scale2, _super);
    function Scale2(v) {
        return _super.call(this, vc.to_v2_if(v), mx.affine2_scale, function (v) { return vc.v2(1, 1).el_div(v); }) || this;
    }
    return Scale2;
}(BaseAffineTransformation2));
var Scale3 = /** @class */ (function (_super) {
    __extends(Scale3, _super);
    function Scale3(v) {
        return _super.call(this, vc.to_v3_if(v), mx.affine3_scale, function (v) { return vc.v3(1, 1, 1).el_div(v); }) || this;
    }
    return Scale3;
}(BaseAffineTransformation3));
function bind(p, affine_maps) {
    var p_new = p.clone();
    p_new.affine_maps = affine_maps;
    return p_new;
}
exports.bind = bind;
var BasePrimitive3 = /** @class */ (function () {
    function BasePrimitive3(bf, sf, affine_maps) {
        if (affine_maps === void 0) { affine_maps = []; }
        this.bf = bf;
        this.sf = sf;
        this.affine_maps = affine_maps;
    }
    BasePrimitive3.prototype.merge_affine_maps = function () {
        return mx.compose(this.affine_maps.map(function (t) { return t.do(); }));
    };
    BasePrimitive3.prototype.merge_affine_maps_rev = function () {
        return mx.compose_rev(this.affine_maps.map(function (t) { return t.doRev(); }));
    };
    BasePrimitive3.prototype.clone = function () {
        return new BasePrimitive3(this.bf, this.sf, this.affine_maps);
    };
    BasePrimitive3.prototype.to_boolean = function () {
        var map = this.merge_affine_maps_rev();
        var bf = this.bf;
        return function (v) { return bf(map.map_v3(v, 1)); };
    };
    BasePrimitive3.prototype.to_surfaces = function () {
        return sf.apply(this.sf(), this.merge_affine_maps());
    };
    return BasePrimitive3;
}());
var BasePrimitive2 = /** @class */ (function () {
    function BasePrimitive2(bool, verts, affine_maps) {
        if (affine_maps === void 0) { affine_maps = []; }
        this.bool = bool;
        this.verts = verts;
        this.affine_maps = affine_maps;
    }
    BasePrimitive2.prototype.merge_affine_maps = function () {
        return mx.compose(this.affine_maps.map(function (t) { return t.do(); }));
    };
    BasePrimitive2.prototype.merge_affine_maps_rev = function () {
        return mx.compose_rev(this.affine_maps.map(function (t) { return t.doRev(); }));
    };
    BasePrimitive2.prototype.clone = function () {
        return new BasePrimitive2(this.bool, this.verts, this.affine_maps);
    };
    BasePrimitive2.prototype.to_boolean = function () {
        var map = this.merge_affine_maps_rev();
        var bf = this.bool;
        return function (v) { return bf(map.map_v2(v, 1)); };
    };
    BasePrimitive2.prototype.to_surfaces = function () {
        var verts = this.verts.map(function (v) { return vc.v2_to_v3(v, 0); });
        var face_1 = this.verts.map(function (_, i) { return i; });
        var faces = [face_1]; // 面は1枚のみ
        return new sf.Surfaces(verts, faces);
    };
    return BasePrimitive2;
}());
var BasePrimitiveGroup = /** @class */ (function () {
    function BasePrimitiveGroup(dict, affine_maps) {
        if (affine_maps === void 0) { affine_maps = []; }
        this.dict = dict;
        this.affine_maps = affine_maps;
    }
    BasePrimitiveGroup.prototype.merge_affine_maps = function () {
        return mx.compose(this.affine_maps.map(function (t) { return t.do(); }));
    };
    BasePrimitiveGroup.prototype.merge_affine_maps_rev = function () {
        return mx.compose_rev(this.affine_maps.map(function (t) { return t.doRev(); }));
    };
    BasePrimitiveGroup.prototype.clone = function () {
        return new BasePrimitiveGroup(this.dict, this.affine_maps);
    };
    BasePrimitiveGroup.prototype.to_surfaces = function () {
        var list = [];
        for (var key in this.dict) {
            var pm = this.dict[key];
            var sfs = pm.primitives.map(function (p) { return p.to_surfaces(); });
            var sfm = sf.merge_surfaces(sfs, pm.material);
            list.push(sfm);
        }
        return sf.concat_surface_models(list);
    };
    return BasePrimitiveGroup;
}());
function primitive2(bf, verts) {
    return new BasePrimitive2(bf, verts);
}
exports.primitive2 = primitive2;
function primitive3(bf, sf) {
    return new BasePrimitive3(bf, sf);
}
exports.primitive3 = primitive3;
function primitive_group(dict) {
    return new BasePrimitiveGroup(dict);
}
exports.primitive_group = primitive_group;
var af2;
(function (af2) {
    function translate(v) {
        return new Translate2(v);
    }
    af2.translate = translate;
    function rotate(rad) {
        return new Rotate2(rad);
    }
    af2.rotate = rotate;
    function scale(v) {
        return new Scale2(v);
    }
    af2.scale = scale;
})(af2 = exports.af2 || (exports.af2 = {}));
var af3;
(function (af3) {
    function translate(v) {
        return new Translate3(v);
    }
    af3.translate = translate;
    function rotate_x(rad) {
        return new Rotate3X(rad);
    }
    af3.rotate_x = rotate_x;
    function rotate_y(rad) {
        return new Rotate3Y(rad);
    }
    af3.rotate_y = rotate_y;
    function rotate_z(rad) {
        return new Rotate3Z(rad);
    }
    af3.rotate_z = rotate_z;
    function scale(v) {
        return new Scale3(v);
    }
    af3.scale = scale;
})(af3 = exports.af3 || (exports.af3 = {}));
