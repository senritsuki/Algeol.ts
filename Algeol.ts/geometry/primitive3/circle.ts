/**
 * Circle - 円
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../algorithm/vector';
import * as circle from '../primitive2/circle';

/**
 * xy平面上で原点中心の円に内接する正n角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の外接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 * @param   z           多角形のz座標
 */
export function verts_i(n_gonal: number, r: number, rad: number = 0, z: number = 0): vc.V3[] {
    return circle.verts(n_gonal, r, rad).map(v => vc.v2_to_v3(v, z));
}

/**
 * xy平面上で原点中心の円に外接するn角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の外接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 * @param   z           多角形のz座標
 */
export function verts_c(n_gonal: number, r: number, rad: number = 0, z: number = 0): vc.V3[] {
    return circle.verts_c(n_gonal, r, rad).map(v => vc.v2_to_v3(v, z));
}
