/**
 * Star - 星型
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../../common';
import * as sq from '../../algorithm/sequence';
import * as vc from '../../datatype/vector';
import * as circle from '../primitive2/circle';


export function verts(n_gonal: number, r1: number, r2: number, rad: number = 0, z1: number = 0, z2: number = 0): vc.V3[] {
    const d = ut.deg180 / n_gonal;
    const o = vc.v3_zero;
    const v1 = circle.verts(n_gonal, r1, rad).map(v => vc.v2_to_v3(v, z1));
    const v2 = circle.verts(n_gonal, r2, rad + d).map(v => vc.v2_to_v3(v, z2));
    return v1.concat(v2).concat([o]);
}

export function faces(n_gonal: number): number[][] {
    const faces: number[][] = [];
    const io = n_gonal * 2;
    sq.arithmetic(n_gonal).forEach(i => {
        faces.push([io, i, i + n_gonal]);
        faces.push([io, (i+1) % n_gonal, i + n_gonal]);
    });
    return faces;
}