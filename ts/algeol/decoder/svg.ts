/**
 * Scalable Vector Graphics (.svg) format - SVGフォーマットへの変換
 * 
 * Copyright (c) 2016 senritsuki
 */

//import * as al from "../algeo";
import * as seq from "../algorithm/sequence";
import * as vc from "../datatype/vector";
import * as cv from "../datatype/curve";


/** (内部要素, svg幅, svg高さ, viewbox幅, viewbox高さ) -> <svg> */
export function svg(inner: string, width: number, height: number, viewbox_width: number, viewbox_height: number): string {
    const viewbox = [-viewbox_width / 2, -viewbox_height / 2, viewbox_width, viewbox_height].join(' ');
    return `<svg width="${width}" height="${height}" viewbox="${viewbox}">\n${inner}\n</svg>\n`;
}

/** (直線) -> <line> */
export function curve_line(line: cv.Curve2, stroke: string, strokeWidth: number): string {
    const c1 = line.start();
    const c2 = line.end();
    return `<line stroke="${stroke}" stroke-width="${strokeWidth}" x1="${c1.x}" y1="${c1.y}" x2="${c2.x}" y2="${c2.y}" />`;
}

/** (連続直線) -> <path> */
export function curveArray_path(lines: cv.CurveArray2, fill: string, stroke: string, strokeWidth: number, z: boolean): string {
    const strs: string[] = [];
    const c0 = lines.start();
    strs.push(`M ${c0.x} ${c0.y}`);
    seq.arithmetic(lines.curveNum(), 1)
        .map(i => lines.coord(i))
        .forEach(v => strs.push(`L ${v.x} ${v.y}`));
    return `<path fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" d="${strs.join(' ') + (z ? ' z' : '')}" />`;
}

/** (3次元ベクトル(x=cx, y=cy, z=r)) -> <circle> */
export function v_circle(v: vc.V3): string {
    return `<circle cx="${v.x}" cy="${v.y}" r="${v.z}" />`;
}
