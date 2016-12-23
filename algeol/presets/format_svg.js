/** Scalable Vector Graphics .svg */
var ut = require("../math/utility");
/** (内部要素, svg幅, svg高さ, viewbox幅, viewbox高さ) -> <svg> */
function svg(inner, width, height, viewbox_width, viewbox_height) {
    var viewbox = [-viewbox_width / 2, -viewbox_height / 2, viewbox_width, viewbox_height].join(' ');
    return "<svg width=\"" + width + "\" height=\"" + height + "\" viewbox=\"" + viewbox + "\">\n" + inner + "\n</svg>\n";
}
exports.svg = svg;
/** (直線) -> <line> */
function curve_line(line, stroke, strokeWidth) {
    var c1 = line.start();
    var c2 = line.end();
    return "<line stroke=\"" + stroke + "\" stroke-width=\"" + strokeWidth + "\" x1=\"" + c1.x() + "\" y1=\"" + c1.y() + "\" x2=\"" + c2.x() + "\" y2=\"" + c2.y() + "\" />";
}
exports.curve_line = curve_line;
/** (連続直線) -> <path> */
function curveArray_path(lines) {
    var strs = [];
    var c0 = lines.start();
    strs.push("M " + c0.x() + " " + c0.y());
    ut.seq.arith(lines.curveNum(), 1)
        .map(function (i) { return lines.coord(i); })
        .forEach(function (v) { return strs.push("L " + v.x() + " " + v.y()); });
    return "<path d=\"" + strs.join(' ') + "\" />";
}
exports.curveArray_path = curveArray_path;
/** (3次元ベクトル(x=cx, y=cy, z=r)) -> <circle> */
function v_circle(v) {
    return "<circle cx=\"" + v.x() + "\" cy=\"" + v.y() + "\" r=\"" + v.z() + "\" />";
}
exports.v_circle = v_circle;
//# sourceMappingURL=format_svg.js.map