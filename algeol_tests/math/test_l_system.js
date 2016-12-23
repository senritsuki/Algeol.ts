var fs = require('fs');
var ls = require("../../algeol/math/l_system");
var svg = require("../../algeol/presets/format_svg");
function writeText(name, start, rec) {
    var strs = [];
    for (var i = 0; i <= rec; i++) {
        var values = ls.l_system(start, i);
        var s = values.map(function (v) { return v.v(); }).join('');
        strs.push(s);
    }
    var path = "test_l_system/" + name + ".txt";
    fs.writeFile(path, strs.join('\n') + '\n');
    console.log('save: ' + path);
}
function writeSvg(name, start, rec, turtle) {
    for (var i = 0; i <= rec; i++) {
        var values = ls.l_system(start, i);
        var lines = turtle(values, i);
        var svglines = lines.map(function (l) { return svg.curve_line(l, '#000000', 1); });
        var svgstr = svg.svg(svglines.join('\n'), 1920, 1920, 1920, 1920);
        var path = "test_l_system/" + name + "-" + i + ".svg";
        fs.writeFile(path, svgstr);
        console.log('save: ' + path);
    }
}
function test() {
    writeText('Algae', ls.presets.Algae.start, 4);
    writeText('FibonacciSequence', ls.presets.FibonacciSequence.start, 4);
    writeText('CantorSet', ls.presets.CantorSet.start, 4);
    writeText('KochCurve60', ls.presets.KochCurve60.start, 4);
    writeSvg('KochCurve60', ls.presets.KochCurve60.start, 4, function (vl, rec) { return ls.presets.KochCurve60.turtle(vl, 10); });
    writeText('KochCurve90', ls.presets.KochCurve90.start, 4);
    writeSvg('KochCurve90', ls.presets.KochCurve90.start, 4, function (vl, rec) { return ls.presets.KochCurve90.turtle(vl, 10); });
    writeText('KochIsland', ls.presets.KochIsland.start, 4);
    writeSvg('KochIsland', ls.presets.KochIsland.start, 4, function (vl, rec) { return ls.presets.KochIsland.turtle(vl, 10); });
    writeText('PeanoCurve', ls.presets.PeanoCurve.start, 4);
    writeSvg('PeanoCurve', ls.presets.PeanoCurve.start, 4, function (vl, rec) { return ls.presets.PeanoCurve.turtle(vl, 10); });
    writeText('PeanoGosperCurve', ls.presets.PeanoGosperCurve.start, 4);
    writeSvg('PeanoGosperCurve', ls.presets.PeanoGosperCurve.start, 4, function (vl, rec) { return ls.presets.PeanoGosperCurve.turtle(vl, 10); });
    writeText('SierpinskiArrowheadCurve', ls.presets.SierpinskiArrowheadCurve.start, 4);
    writeSvg('SierpinskiArrowheadCurve', ls.presets.SierpinskiArrowheadCurve.start, 4, function (vl, rec) { return ls.presets.SierpinskiArrowheadCurve.turtle(vl, 10); });
    writeText('SierpinskiTriangle', ls.presets.SierpinskiTriangle.start, 4);
    writeSvg('SierpinskiTriangle', ls.presets.SierpinskiTriangle.start, 4, function (vl, rec) { return ls.presets.SierpinskiTriangle.turtle(vl, 10); });
    writeText('SquareCurve', ls.presets.SquareCurve.start, 4);
    writeSvg('SquareCurve', ls.presets.SquareCurve.start, 4, function (vl, rec) { return ls.presets.SquareCurve.turtle(vl, 10); });
    writeText('DragonCurve', ls.presets.DragonCurve.start, 12);
    writeSvg('DragonCurve', ls.presets.DragonCurve.start, 12, function (vl, rec) { return ls.presets.DragonCurve.turtle(vl, 10); });
}
test();
//# sourceMappingURL=test_l_system.js.map