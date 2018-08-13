import * as ut from '../../common';
import * as vc from '../../datatype/vector';
import * as arc from './arc';

/**
 * パイ（円弧＋原点）
 * @param n             円弧を近似する辺の数
 * @param r             円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
export function pie_verts(n: number, r: number, rad1: number, rad2: number): vc.V2[] {
    return arc.ellipse_arc_verts(n, vc.v2(r, r), rad1, rad2);
}
export function ellipse_pie_verts(n: number, r: vc.V2, rad1: number, rad2: number): vc.V2[] {
    return [vc.v2_zero].concat(arc.ellipse_arc_verts(n, r, rad1, rad2));
}
/** 半径1のパイ */
export function pie_b2(r: number, rad1: number, rad2: number): (v: vc.V2) => boolean {
    return ellipse_pie_b2(vc.v2(r, r), rad1, rad2);
}
export function ellipse_pie_b2(r: vc.V2, rad1: number, rad2: number): (v: vc.V2) => boolean {
    return v => {
        v = v.el_div(r);
        const r_r = vc.v2_to_polar(v);
        if (r_r[0] > 1) return false;
        const rad = ut.normalizeRad(r_r[1]);
        rad1 = ut.normalizeRad(rad1);
        rad2 = ut.normalizeRad(rad2);
        return ut.isIn(rad1, rad2, rad);
    }
}
