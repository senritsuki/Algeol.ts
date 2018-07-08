/**
 * Cube - 正6面体・立方体
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../algorithm/vector';
import * as cuboid from './cuboid';

/** 原点中心の半径rの球に外接する立方体の頂点8つ
    (+-1, +-1, +-1)の組み合わせで8点とする */
export function verts(r: number): vc.V3[] {
    return cuboid.verts(r, r, r);
}
/** 立方体の面6つ
    面は全て合同の正方形である */
export const faces = cuboid.faces;

export const faces_top = cuboid.faces_top;
export const faces_bottom = cuboid.faces_bottom;
export const faces_side = cuboid.faces_side;
