/**
 * Icosahedron - 正20面体
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../../common';
import * as sq from '../../algorithm/sequence';
import * as vc from '../../datatype/vector';
import * as mx from '../../datatype/matrix';
import * as trirect from './trirect';
import * as gut from '../utility';

/**
 * 原点中心の半径rの球に内接する正20面体の頂点12個
 * 球に内接する長方形3枚の頂点を流用する
 */
export function verts(r: number, do_rot: boolean = false): vc.V3[] {
    const short = r / Math.sqrt(2 + ut.phi); // 0^2 + 1^2 + ut.phi^2
    const long = short * ut.phi;
    let verts = trirect.verts(long, short);
    if (do_rot) {
        verts = verts.map(v => mx.m3_rotate_y(rad_rot_y_to_z).map(v));
    }
    return verts;
}
/**
 * 正20面体の面20個
 * 面は全て合同の正三角形である
 */
export function faces(): number[][] {
    const xy = sq.arithmetic(4, 0);
    const yz = sq.arithmetic(4, 4);
    const zx = sq.arithmetic(4, 8);
    return [
        [xy[0], zx[0], xy[3]], // 上 右
        [xy[3], zx[1], xy[0]], // 下 右
        [xy[2], zx[3], xy[1]], // 上 左
        [xy[1], zx[2], xy[2]], // 下 左
        [yz[2], xy[3], yz[1]], // 中 前右
        [yz[1], xy[2], yz[2]], // 中 前左
        [yz[0], xy[0], yz[3]], // 中 奥右
        [yz[3], xy[1], yz[0]], // 中 奥左
        [zx[3], yz[1], zx[0]], // 上 前
        [zx[0], yz[0], zx[3]], // 上 奥
        [zx[1], yz[2], zx[2]], // 下 前
        [zx[2], yz[3], zx[1]], // 下 奥
        [zx[0], yz[1], xy[3]], // 中上 右前
        [zx[0], xy[0], yz[0]], // 中上 右奥
        [zx[1], xy[3], yz[2]], // 中下 右前
        [zx[1], yz[3], xy[0]], // 中下 右奥
        [zx[3], xy[2], yz[1]], // 中上 左前
        [zx[3], yz[0], xy[1]], // 中上 左奥
        [zx[2], yz[2], xy[2]], // 中下 左前
        [zx[2], xy[1], yz[3]], // 中下 左奥
    ];
}

/** rad: 0.5535743588970452, deg: 31.717474411461005 */
export const rad_rot_y_to_z = ut.deg90 - Math.atan2(ut.phi, 1);

/**
 * 正20面体の辺30個
 */
export function edges(): [number, number][] {
    return gut.get_edges(faces());
}

export function vf(r: number, do_rot: boolean = false): gut.VF<vc.V3> {
    return {
        verts: verts(r, do_rot),
        faces: faces(),
    }
}
