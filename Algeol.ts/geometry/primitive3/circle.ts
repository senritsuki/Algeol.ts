/**
 * Circle - 円
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../algorithm/vector';
import * as circle from '../primitive2/circle';

/** 円に内接するn角形 */
export function verts_i(n_gonal: number, r: number, t: number = 0, z: number = 0): vc.V3[] {
    return circle.verts(n_gonal, r, t).map(v => vc.v2_to_v3(v, z));
}
/** 円に外接するn角形 */
export function verts_c(n_gonal: number, r: number, t: number = 0, z: number = 0): vc.V3[] {
    return circle.verts_c(n_gonal, r, t).map(v => vc.v2_to_v3(v, z));
}
