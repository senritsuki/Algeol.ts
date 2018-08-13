import * as ut from '../../common';
import * as sq from '../../algorithm/sequence';
import * as vc from '../../datatype/vector';
import * as ellipse from './ellipse';
import * as arc from './arc';

/** 90度のパイやドーナツの角柱化は容易だが、リングの角柱化は意外と難しい。ドーナツを一周させるか */

export function ellipse_doughnut_verts(n: number, r1: vc.V2, r2: vc.V2): Array<[vc.V2, vc.V2]> {
    const v1 = ellipse.verts(n, r1, 0);
    const v2 = ellipse.verts(n, r2, 0);
    const f = (i: number): [vc.V2, vc.V2] => [v1[i], v2[i]];
    return sq.arithmetic(n).map(i => f(i));
}
export function doughnut_verts(n: number, r1: number, r2: number): Array<[vc.V2, vc.V2]> {
    return ellipse_doughnut_verts(n, vc.v2(r1, r1), vc.v2(r2, r2));
}

export function ellipse_doughnut_b2(r1: vc.V2, r2: vc.V2): (v: vc.V2) => boolean {
    const b1 = ellipse.b2(r1);
    const b2 = ellipse.b2(r2);
    return v => {
        return ut.xor(b1(v), b2(v));
    }
}
export function doughnut_b2(r1: number, r2: number): (v: vc.V2) => boolean {
    return ellipse_doughnut_b2(vc.v2(r1, r1), vc.v2(r2, r2));
}



/**
 * 穴あきパイ
 * @param n             円弧を近似する辺の数
 * @param r1            内側の円の半径
 * @param r2            外側の円の半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
export function doughnut_pie_verts(n: number, r1: number, r2: number, rad1: number, rad2: number): vc.V2[] {
    return ellipse_doughnut_pie_verts(n, vc.v2(r1, r1), vc.v2(r2, r2), rad1, rad2);
}
/**
 * 楕円穴あきパイ（円ドーナツの楕円化における厚みの歪み対策）
 * @param n             円弧を近似する辺の数
 * @param r1            内側の円のx, y半径
 * @param r2            外側の円のx, y半径
 * @param rad1          円弧の開始角度
 * @param rad2          円弧の終了角度
 */
export function ellipse_doughnut_pie_verts(n: number, r1: vc.V2, r2: vc.V2, rad1: number, rad2: number): vc.V2[] {
    const arc1 = arc.ellipse_arc_verts(n, r1, rad1, rad2);
    const arc2 = arc.ellipse_arc_verts(n, r2, rad2, rad1);
    return arc1.concat(arc2);
}
/** 半分のひし形ドーナツ */
export function rhombus_doughnut_half_verts(rx1: number, ry1: number, rx2: number, ry2: number): vc.V2[] {
    return [
        vc.v2(rx1, 0),
        vc.v2(0, ry1),
        vc.v2(-rx1, 0),
        vc.v2(-rx2, 0),
        vc.v2(0, ry2),
        vc.v2(rx2, 0),
    ];
}
