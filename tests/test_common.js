"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E = 0; //1e-6;
exports.data = function (s, v, v2) { return ({ s: s, v: v, v2: v2 }); };
exports.dataNum = function (s, v, v2) { return exports.data(s, v, v2); };
exports.dataNumArray = function (s, v, v2) { return exports.data(s, v, v2); };
exports.dataNumArray2 = function (s, v, v2) { return exports.data(s, v, v2); };
exports.dataStr = function (s, v, v2) { return exports.data(s, v, v2); };
exports.evalNum = function (v, v2, e) { return Math.abs(v2 - v) <= e; };
exports.evalNumArray = function (v, v2, e) { return v.length === v2.length ? v.map(function (v, i) { return exports.evalNum(v, v2[i], e); }).reduce(function (a, b) { return a && b; }, true) : false; };
exports.evalNumArray2 = function (v, v2, e) { return v.length === v2.length ? v.map(function (v, i) { return exports.evalNumArray(v, v2[i], e); }).reduce(function (a, b) { return a && b; }, true) : false; };
exports.evalStr = function (v, v2) { return v === v2; };
exports.okng0 = { ok: 0, ng: 0 };
exports.countOkNg = function (okng, r) { return ({ ok: okng.ok + (r.b === true ? 1 : 0), ng: okng.ng + (r.b === false ? 1 : 0) }); };
exports.mergeOkNg = function (a, b) { return ({ ok: a.ok + b.ok, ng: a.ng + b.ng }); };
function tests(tds, evalFn, e) {
    if (e === void 0) { e = exports.E; }
    return tds.map(function (td) {
        var b = evalFn(td.v, td.v2, e);
        var s = td.s + " -> " + td.v + " == " + td.v2;
        return { s: s, b: b };
    });
}
exports.tests = tests;
function printModule(name, groups) {
    var okng = { ok: 0, ng: 0 };
    console.log();
    console.log(name);
    console.log('================================');
    groups.forEach(function (group) {
        var okng2 = group.results.reduce(function (okng, r) { return exports.countOkNg(okng, r); }, exports.okng0);
        console.log("## " + group.group);
        group.results.forEach(function (d) { return console.log("- " + d.b + ": " + d.s); });
        console.log("- " + (okng2.ng === 0) + ": " + okng2.ok + " / " + (okng2.ok + okng2.ng));
        okng = exports.mergeOkNg(okng, okng2);
    });
    console.log('## total');
    console.log("- " + (okng.ng === 0) + ": " + okng.ok + " / " + (okng.ok + okng.ng));
    console.log();
    return okng;
}
exports.printModule = printModule;
