"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("../test_common");
var ut = require("../../algorithm/utility");
function test() {
    return t.printModule('algeol/math/utility', [
        { group: 'constants', results: t.tests([
                t.dataNum('r2', ut.r2, Math.sqrt(2)),
                t.dataNum('r3', ut.r3, Math.sqrt(3)),
                t.dataNum('r5', ut.r5, Math.sqrt(5)),
                t.dataNum('pi', ut.pi, Math.PI),
                t.dataNum('pi2', ut.pi2, Math.PI * 2),
                t.dataNum('phi', ut.phi, (1 + Math.sqrt(5)) / 2),
            ], t.evalNum) },
        { group: 'number', results: t.tests([
                t.dataNum('deg_to_rad(0)', ut.deg_to_rad(0), 0),
                t.dataNum('deg_to_rad(180)', ut.deg_to_rad(180), Math.PI),
                t.dataNum('deg_to_rad(360)', ut.deg_to_rad(360), Math.PI * 2),
                t.dataNum('rad_to_deg(0)', ut.rad_to_deg(0), 0),
                t.dataNum('rad_to_deg(PI)', ut.rad_to_deg(Math.PI), 180),
                t.dataNum('rad_to_deg(2PI)', ut.rad_to_deg(Math.PI * 2), 360),
                t.dataNum('factorial(0)', ut.factorial(0), 1),
                t.dataNum('factorial(1)', ut.factorial(1), 1),
                t.dataNum('factorial(2)', ut.factorial(2), 2),
                t.dataNum('factorial(3)', ut.factorial(3), 6),
                t.dataNum('factorial(4)', ut.factorial(4), 24),
                t.dataNum('factorial(5)', ut.factorial(5), 120),
                t.dataNum('combination(0)', ut.combination(5, 0), 1),
                t.dataNum('combination(1)', ut.combination(5, 1), 5),
                t.dataNum('combination(2)', ut.combination(5, 2), 10),
                t.dataNum('combination(3)', ut.combination(5, 3), 10),
                t.dataNum('combination(4)', ut.combination(5, 4), 5),
                t.dataNum('combination(5)', ut.combination(5, 5), 1),
            ], t.evalNum) },
        { group: 'matrix', results: t.tests([
                t.dataNumArray2('transpose([[1,2], [3,4], [5,6]])', ut.transpose([[1, 2], [3, 4], [5, 6]]), [[1, 3, 5], [2, 4, 6]]),
            ], t.evalNumArray2) },
    ]);
}
exports.test = test;
if (module != null && !module.parent)
    test();
