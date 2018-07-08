/**
 * Cuboid - 直方体
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../algorithm/vector';

/** 直方体の頂点8つ
    頂点の順序は立方体と同じであり、同じface配列を流用可能 */
export function verts(x: number, y: number, z: number): vc.V3[] {
    return [
        vc.v3(x, y, z),    // 上 右奥
        vc.v3(-x, y, z),   // 上 左奥
        vc.v3(-x, -y, z),  // 上 左前
        vc.v3(x, -y, z),   // 上 右前
        vc.v3(x, y, -z),   // 下 右奥
        vc.v3(-x, y, -z),  // 下 左奥
        vc.v3(-x, -y, -z), // 下 左前
        vc.v3(x, -y, -z),  // 下 右前
    ];
}
/** 直方体の面6つ */
export function faces(): number[][] {
    return [
        [0, 1, 2, 3], // 上
        [7, 6, 5, 4], // 下
        [4, 5, 1, 0], // 奥
        [5, 6, 2, 1], // 左
        [6, 7, 3, 2], // 前
        [7, 4, 0, 3], // 右
    ];
}
/** 直方体の上面 */
export function faces_top(): number[][] {
    return [
        [0, 1, 2, 3], // 上
    ];
}
/** 直方体の下面 */
export function faces_bottom(): number[][] {
    return [
        [7, 6, 5, 4], // 下
    ];
}
/** 直方体の側面 */
export function faces_side(): number[][] {
    return [
        [4, 5, 1, 0], // 奥
        [5, 6, 2, 1], // 左
        [6, 7, 3, 2], // 前
        [7, 4, 0, 3], // 右
    ];
}
