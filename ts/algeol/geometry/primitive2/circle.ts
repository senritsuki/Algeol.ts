/**
 * Circle - 円
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../../common';
import * as vc from '../../datatype/vector';
import * as ellipse from './ellipse';

/**
 * 円に内接するn角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の外接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 */
export function verts(n_gonal: number, r: number, rad: number): vc.V2[] {
    return ellipse.verts(n_gonal, vc.v2(r, r), rad);
}
/**
 * 円に外接するn角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の内接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 */
export function verts_c(n_gonal: number, r: number, rad: number): vc.V2[] {
    const theta = ut.deg360 / (n_gonal * 2);
    const r2 = r / Math.cos(theta);
    const p2 = rad + theta;
    return verts(n_gonal, r2, p2);
}

export function b2(r: number): (v: vc.V2) => boolean {
    return ellipse.b2(vc.v2(r, r));
}
