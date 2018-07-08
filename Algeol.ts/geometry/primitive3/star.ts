/**
 * Star - 星型
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../algorithm/vector';
import * as circle from '../primitive2/circle';


export function verts(n_gonal: number, r1: number, r2: number, z1: number = 0, z2: number = 0): vc.V3[] {
    return circle.verts(n_gonal, r, rad).map(v => vc.v2_to_v3(v, z));
}
