declare const require: any;
const fs = require('fs');

import * as ls from "../../algeol/math/l_system";
import * as cv from "../../algeol/math/curve2";
import * as svg from "../../algeol/presets/format_svg";


function writeText(name: string, start: ls.V[], rec: number): void {
	const strs: string[] = [];
	for (let i = 0; i <= rec; i++) {
		const values = ls.l_system(start, i);
		const s = values.map(v => v.v()).join('');
		strs.push(s);
	}
	const path = `test_l_system/${name}.txt`;
	fs.writeFile(path, strs.join('\n') + '\n');
	console.log('save: ' + path);
}
function writeSvg(name: string, start: ls.V[], rec: number, turtle: (vl: ls.V[], rec: number) => cv.Curve[]): void {
	for (let i = 0; i <= rec; i++) {
		const values = ls.l_system(start, i);
		const lines = turtle(values, i);
		const svglines = lines.map(l => svg.curve_line(l, '#000000', 1));
		const svgstr = svg.svg(svglines.join('\n'), 1920, 1920, 1920, 1920);
		const path = `test_l_system/${name}-${i}.svg`;
		fs.writeFile(path, svgstr);
		console.log('save: ' + path);
	}
}

function test() {
	writeText('SierpinskiArrowheadCurve',
		ls.presets.SierpinskiArrowheadCurve.start, 6);
	writeSvg('SierpinskiArrowheadCurve',
		ls.presets.SierpinskiArrowheadCurve.start, 6,
		(vl, rec) => ls.presets.SierpinskiArrowheadCurve.turtle(vl, 10));
	return;
	writeText('Algae',
		ls.presets.Algae.start, 4);
	writeText('FibonacciSequence',
		ls.presets.FibonacciSequence.start, 4);
	writeText('CantorSet',
		ls.presets.CantorSet.start, 4);
	writeText('KochCurve60',
		ls.presets.KochCurve60.start, 4);
	writeSvg('KochCurve60',
		ls.presets.KochCurve60.start, 4,
		(vl, rec) => ls.presets.KochCurve60.turtle(vl, 10));
	writeText('KochCurve90',
		ls.presets.KochCurve90.start, 4);
	writeSvg('KochCurve90',
		ls.presets.KochCurve90.start, 4,
		(vl, rec) => ls.presets.KochCurve90.turtle(vl, 10));
	writeText('KochIsland',
		ls.presets.KochIsland.start, 4);
	writeSvg('KochIsland',
		ls.presets.KochIsland.start, 4,
		(vl, rec) => ls.presets.KochIsland.turtle(vl, 10));
	writeText('PeanoCurve',
		ls.presets.PeanoCurve.start, 4);
	writeSvg('PeanoCurve',
		ls.presets.PeanoCurve.start, 4,
		(vl, rec) => ls.presets.PeanoCurve.turtle(vl, 10));
	writeText('PeanoGosperCurve',
		ls.presets.PeanoGosperCurve.start, 4);
	writeSvg('PeanoGosperCurve',
		ls.presets.PeanoGosperCurve.start, 4,
		(vl, rec) => ls.presets.PeanoGosperCurve.turtle(vl, 10));
	writeText('SierpinskiArrowheadCurve',
		ls.presets.SierpinskiArrowheadCurve.start, 4);
	writeSvg('SierpinskiArrowheadCurve',
		ls.presets.SierpinskiArrowheadCurve.start, 4,
		(vl, rec) => ls.presets.SierpinskiArrowheadCurve.turtle(vl, 10));
	writeText('SierpinskiTriangle',
		ls.presets.SierpinskiTriangle.start, 4);
	writeSvg('SierpinskiTriangle',
		ls.presets.SierpinskiTriangle.start, 4,
		(vl, rec) => ls.presets.SierpinskiTriangle.turtle(vl, 10));
	writeText('SquareCurve',
		ls.presets.SquareCurve.start, 4);
	writeSvg('SquareCurve',
		ls.presets.SquareCurve.start, 4,
		(vl, rec) => ls.presets.SquareCurve.turtle(vl, 10));
	writeText('DragonCurve',
		ls.presets.DragonCurve.start, 12);
	writeSvg('DragonCurve',
		ls.presets.DragonCurve.start, 12,
		(vl, rec) => ls.presets.DragonCurve.turtle(vl, 10));
}
test();

