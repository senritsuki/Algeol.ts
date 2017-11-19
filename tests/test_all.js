"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("./test_common");
var ut = require("./algorithm/test_utility");
var vc = require("./algorithm/test_vector");
var mx = require("./algorithm/test_matrix");
var col = require("./algorithm/test_color_converter");
function test() {
    var okng = [
        ut.test(),
        vc.test(),
        mx.test(),
        col.test(),
    ].reduce(function (a, b) { return t.mergeOkNg(a, b); }, t.okng0);
    console.log();
    console.log('total');
    console.log('================================');
    console.log("- " + (okng.ng === 0) + ": " + okng.ok + " / " + (okng.ok + okng.ng));
    console.log();
    return okng;
}
exports.test = test;
if (module != null && !module.parent)
    test();
