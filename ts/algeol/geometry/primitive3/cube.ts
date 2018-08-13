/**
 * Cube - 正6面体・立方体
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../datatype/vector';
import * as cuboid from './cuboid';

export class Cube {
    constructor(
        public o: vc.V3,
        public r: number,
    ) {}

    verts(): vc.V3[] {
        return verts_o_r(this.o, this.r);
    }
}

/**
 * 原点中心の半径rの球に外接する立方体の頂点8つ
 * (+-r, +-r, +-r)の組み合わせで8点となる
 */
export function verts(r: number): vc.V3[] {
    return cuboid.verts(r, r, r);
}

export function verts_o_r(o: vc.V3, r: number): vc.V3[] {
    return cuboid.verts_o_r(o, vc.v3(r, r, r));
}

/**
 * 立方体の面6つ
 * 面は全て合同の正方形である
 */
export const faces = cuboid.faces;

export const faces_top = cuboid.faces_top;
export const faces_bottom = cuboid.faces_bottom;
export const faces_side = cuboid.faces_side;

/**
 * 立方体の辺12個
 */
export const edges = cuboid.edges;