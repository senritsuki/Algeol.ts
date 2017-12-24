"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ut = require("../algorithm/utility");
var seq = require("../algorithm/sequence");
var mx = require("../algorithm/matrix");
var cc = require("../algorithm/color_converter");
var al = require("../geometry/geo");
var prim = require("../geometry/primitive");
var wf = require("../decoder/wavefront");
var save = require("./n003_save");
var num = 24;
var step = 360 / num;
var geo = prim.prism(12, 0.5, 1.0);
var sq = seq.arith(num);
var duplicater = al.compose_v3map(sq, [
    function (_) { return mx.trans_m4([0, 5, 0]); },
    function (n) { return mx.rot_z_m4(ut.deg_to_rad(-n * step)); },
]);
var geos = al.duplicate_f(geo, duplicater);
var lch = ut.compose_2f(cc.lch_to_rgb01, function (nn) { return cc.clamp(nn, 0, 1); });
var materials = sq.map(function (n) { return new al.Material("c1510" + ut.format_02d(n), lch([75, 50, n * step])); });
var obj = al.merge_geos_materials(geos, materials);
var result = wf.objs_to_strings('./_obj/n003_colorcircle', [obj]);
save.save_objmtl(result);
