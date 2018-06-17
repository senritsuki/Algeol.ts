/**
 * Octahedron - 正8面体
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../algorithm/vector';

/** 原点中心の半径rの球に内接する正8面体の頂点6つ
    x軸上、y軸上、z軸上それぞれに2点ずつとる */
export function verts(r: number): vc.V3[] {
    return [
        vc.v3(0, 0, r),  // 上
        vc.v3(r, 0, 0),  // 中 右
        vc.v3(0, r, 0),  // 中 奥
        vc.v3(-r, 0, 0), // 中 左
        vc.v3(0, -r, 0), // 中 前
        vc.v3(0, 0, -r), // 下
    ];
}
/** 正8面体の三角形の面8つ
    面は全て合同の正三角形である */
export function faces(): number[][] {
    return [
        [1, 2, 0], // 上 右奥
        [2, 3, 0], // 上 左奥
        [3, 4, 0], // 上 左前
        [4, 1, 0], // 上 右前
        [1, 4, 5], // 下 右前
        [4, 3, 5], // 下 左前
        [3, 2, 5], // 下 左奥
        [2, 1, 5], // 下 右奥
    ];
}
