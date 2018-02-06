"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cv = require("../algorithm/curve");
/** 線分 */
function build_b3_segment(p1, p2, r) {
    return function (v) { return cv.distance_sp(p1, p2, v) <= r; };
}
exports.build_b3_segment = build_b3_segment;
