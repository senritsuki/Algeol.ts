/**
 * Tetrahedron - 正4面体
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../../algorithm/utility';
import * as vc from '../../algorithm/vector';

/** プリミティブオブジェクト生成用関数群 */

const deg120_c = Math.cos(120 * ut.pi / 180);
const deg120_s = Math.sin(120 * ut.pi / 180);
const deg240_c = Math.cos(240 * ut.pi / 180);
const deg240_s = Math.sin(240 * ut.pi / 180);

const tetrahedron_rad = Math.acos(-1 / 3); // 正4面体の半径:高さ = 3:4
const tetrahedron_c = Math.cos(tetrahedron_rad);
const tetrahedron_s = Math.sin(tetrahedron_rad);

// +xを右、+yを奥、+zを上、と考える（Blender）

/**
 * 原点中心の半径rの球に内接する正4面体の頂点4つ
 * 1つをz軸上の頭頂点、残り3つをxy平面に平行な底面とする
 */
export function verts(r: number): vc.V3[] {
    return [
        vc.v3(0, 0, r), // 上
        vc.v3(r * tetrahedron_s, 0, r * tetrahedron_c), // 下 右
        vc.v3(r * tetrahedron_s * deg120_c, r * tetrahedron_s * deg120_s, r * tetrahedron_c), // 下 左奥
        vc.v3(r * tetrahedron_s * deg240_c, r * tetrahedron_s * deg240_s, r * tetrahedron_c), // 下 左前
    ];
}
/**
 * 正4面体の面4つ
 * 面は全て合同の正三角形である
 */
export function faces(): number[][] {
    return [
        [0, 1, 2], // 上 右奥
        [0, 2, 3], // 上 左
        [0, 3, 1], // 上 右前
        [3, 2, 1], // 下
    ];
}
