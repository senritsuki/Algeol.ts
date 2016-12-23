/** Scalable Vector Graphics .svg */

//import * as al from "../algeo";
import * as vc from "../math/vector";
import * as ut from "../math/utility";
import * as cv from "../math/curve2";


/** (内部要素, svg幅, svg高さ, viewbox幅, viewbox高さ) -> <svg> */
export function svg(inner: string, width: number, height: number, viewbox_width: number, viewbox_height: number): string {
	const viewbox = [-viewbox_width / 2, -viewbox_height / 2, viewbox_width, viewbox_height].join(' ');
	return `<svg width="${width}" height="${height}" viewbox="${viewbox}">\n${inner}\n</svg>\n`;
}

/** (直線) -> <line> */
export function curve_line(line: cv.Curve, stroke: string, strokeWidth: number): string {
	const c1 = line.start();
	const c2 = line.end();
	return `<line stroke="${stroke}" stroke-width="${strokeWidth}" x1="${c1.x()}" y1="${c1.y()}" x2="${c2.x()}" y2="${c2.y()}" />`;
}

/** (連続直線) -> <path> */
export function curveArray_path(lines: cv.CurveArray): string {
	const strs: string[] = [];
	const c0 = lines.start();
	strs.push(`M ${c0.x()} ${c0.y()}`);
	ut.seq.arith(lines.curveNum(), 1)
		.map(i => lines.coord(i))
		.forEach(v => strs.push(`L ${v.x()} ${v.y()}`));
	return `<path d="${strs.join(' ')}" />`;
}

/** (3次元ベクトル(x=cx, y=cy, z=r)) -> <circle> */
export function v_circle(v: vc.V3): string {
	return `<circle cx="${v.x()}" cy="${v.y()}" r="${v.z()}" />`;
}
