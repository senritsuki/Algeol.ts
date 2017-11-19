"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("../test_common");
var ut = require("../../algorithm/utility");
var vc = require("../../algorithm/vector");
function test() {
    var v2 = vc.v2(1, 2);
    var v3 = vc.v3(1, 2, 3);
    var v4 = vc.v4(1, 2, 3, 4);
    return t.printModule('algeol/math/vector', [
        { group: 'generate', results: t.tests([
                t.dataNumArray('vc.v2(1, 2)', vc.v2(1, 2).array(), [1, 2]),
                t.dataNumArray('vc.v3(1, 2, 3)', vc.v3(1, 2, 3).array(), [1, 2, 3]),
                t.dataNumArray('vc.v4(1, 2, 3, 4)', vc.v4(1, 2, 3, 4).array(), [1, 2, 3, 4]),
                t.dataNumArray('vc.polar_to_v2(2, 0)', vc.polar_to_v2(2, 0).array(), [2, 0]),
                t.dataNumArray('vc.polar_to_v2(2, PI/2)', vc.polar_to_v2(2, ut.pi / 2).array(), [0, 2]),
                t.dataNumArray('vc.polar_to_v2(2, PI)', vc.polar_to_v2(2, ut.pi).array(), [-2, 0]),
                t.dataNumArray('vc.polar_to_v3(2, 0, 3)', vc.polar_to_v3(2, 0, 3).array(), [2, 0, 3]),
                t.dataNumArray('vc.polar_to_v3(2, PI/2, 4)', vc.polar_to_v3(2, ut.pi / 2, 4).array(), [0, 2, 4]),
                t.dataNumArray('vc.polar_to_v3(2, PI, 5)', vc.polar_to_v3(2, ut.pi, 5).array(), [-2, 0, 5]),
                t.dataNumArray('vc.sphere_to_v3(2, 0, 0)', vc.sphere_to_v3(2, 0, 0).array(), [2, 0, 0]),
                t.dataNumArray('vc.sphere_to_v3(2, PI/2, 0)', vc.sphere_to_v3(2, ut.pi / 2, 0).array(), [0, 2, 0]),
                t.dataNumArray('vc.sphere_to_v3(2, PI, 0)', vc.sphere_to_v3(2, ut.pi, 0).array(), [-2, 0, 0]),
                t.dataNumArray('vc.sphere_to_v3(2, 0, PI/3)', vc.sphere_to_v3(2, 0, ut.pi / 3).array(), [1, 0, ut.r3]),
                t.dataNumArray('vc.sphere_to_v3(2, PI/2, PI/3)', vc.sphere_to_v3(2, ut.pi / 2, ut.pi / 3).array(), [0, 1, ut.r3]),
                t.dataNumArray('vc.sphere_to_v3(2, PI, PI/3)', vc.sphere_to_v3(2, ut.pi, ut.pi / 3).array(), [-1, 0, ut.r3]),
            ], t.evalNumArray, 1e-6) },
        { group: 'arithmetic', results: t.tests([
                t.dataNumArray('v2.add(v2)', v2.add(v2).array(), [2, 4]),
                t.dataNumArray('v3.add(v3)', v3.add(v3).array(), [2, 4, 6]),
                t.dataNumArray('v4.add(v4)', v4.add(v4).array(), [2, 4, 6, 8]),
                t.dataNumArray('v2.sub(v2)', v2.sub(v2).array(), [0, 0]),
                t.dataNumArray('v3.sub(v3)', v3.sub(v3).array(), [0, 0, 0]),
                t.dataNumArray('v4.sub(v4)', v4.sub(v4).array(), [0, 0, 0, 0]),
                t.dataNumArray('v2.hadamart(v2)', v2.hadamart(v2).array(), [1, 4]),
                t.dataNumArray('v3.hadamart(v3)', v3.hadamart(v3).array(), [1, 4, 9]),
                t.dataNumArray('v4.hadamart(v4)', v4.hadamart(v4).array(), [1, 4, 9, 16]),
                t.dataNumArray('v2.scalar(2)', v2.scalar(2).array(), [2, 4]),
                t.dataNumArray('v3.scalar(2)', v3.scalar(2).array(), [2, 4, 6]),
                t.dataNumArray('v4.scalar(2)', v4.scalar(2).array(), [2, 4, 6, 8]),
            ], t.evalNumArray, 1e-6) },
        { group: 'inner (dot) product, cross product 2-dim', results: t.tests([
                t.dataNum('v2.ip(v2)', v2.ip(v2), 1 + 4),
                t.dataNum('v3.ip(v3)', v3.ip(v3), 1 + 4 + 9),
                t.dataNum('v4.ip(v4)', v4.ip(v4), 1 + 4 + 9 + 16),
                t.dataNum('v2.cp(v2)', v2.cp(v2), 1 * 2 - 2 * 1),
            ], t.evalNum) },
        { group: 'cross product 3-dim', results: t.tests([
                t.dataNumArray('v3.cp(v3)', v3.cp(v3).array(), [2 * 3 - 3 * 2, 3 * 1 - 1 * 3, 1 * 2 - 2 * 1]),
            ], t.evalNumArray, 1e-6) },
    ]);
}
exports.test = test;
if (module != null && !module.parent)
    test();
