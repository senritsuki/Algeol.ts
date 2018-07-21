/**
 * Trapezohedron - ねじれ双角錐
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../../algorithm/utility';
import * as sq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';
import * as circle from './circle';

export function verts(n_gonal: number, r: number, b1: number, b2: number, h1: number, h2: number): vc.V3[] {
    const rad1 = 0;
    const rad2 = ut.deg360 / (n_gonal * 2);
    const verts1 = circle.verts_i(n_gonal, r, rad1, b1); // 底面1
    const verts2 = circle.verts_i(n_gonal, r, rad2, b2); // 底面2
    const verts = verts1.concat(verts2);
    verts.push(vc.v3(0, 0, h1)); // 頭頂点
    verts.push(vc.v3(0, 0, h2)); // 頭頂点の逆
    return verts;
}

export function faces(n_gonal: number): number[][] {
    const n1 = n_gonal * 2;
    const n2 = n_gonal * 2 + 1;
    const faces: number[][] = [];
    const pairs = sq.arithmetic(n_gonal).map(i => [i, (i + 1) % n_gonal]);
    pairs.map(v => [n2, v[1], v[0]+n_gonal, v[0]])
        .forEach(v => faces.push(v));
    pairs.map(v => [n1, v[0]+n_gonal, v[1], v[1]+n_gonal])
        .forEach(v => faces.push(v));
    return faces;
}


