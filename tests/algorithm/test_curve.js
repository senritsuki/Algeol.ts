"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("../test_common");
//import * as cv from "../../algeol/math/curve";
function test() {
    return t.printModule('algeol/math/curve', [
        { group: 'curve', results: t.tests([], t.evalNumArray) },
    ]);
}
exports.test = test;
if (module != null && !module.parent)
    test();
