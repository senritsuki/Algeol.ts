/**
 * Dodecahedron - 正12面体
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../../common';
import * as sq from '../../algorithm/sequence';
import * as vc from '../../datatype/vector';
import * as mx from '../../datatype/matrix';
import * as trirect from './trirect';
import * as cube from './cube';
import * as gut from '../utility';

/**
 * 原点中心の半径rの球に内接する正12面体の頂点20個
 * 球に内接する長方形3枚と立方体の頂点を流用する
 */
export function verts(r: number, do_rot: boolean = false): vc.V3[] {
    const c = r / ut.r3;
    const short = c / ut.phi;
    const long = c * ut.phi;
    let verts = trirect.verts(long, short).concat(cube.verts(c));
    if (do_rot) {
        verts = verts.map(v => mx.m3_rotate_y(rad_rot_y_to_z).map(v));
    }
    return verts;
}

/**
 * 正12面体の面12個
 * 面は全て合同の正五角形である
 */
export function faces(): number[][] {
    const xy = sq.arithmetic(4, 0);
    const yz = sq.arithmetic(4, 4);
    const zx = sq.arithmetic(4, 8);
    const ct = sq.arithmetic(4, 12);
    const cb = sq.arithmetic(4, 16);
    return [
        [xy[0], ct[0], zx[0], ct[3], xy[3]], // 上 右
        [xy[3], cb[3], zx[1], cb[0], xy[0]], // 下 右
        [xy[2], ct[2], zx[3], ct[1], xy[1]], // 上 左
        [xy[1], cb[1], zx[2], cb[2], xy[2]], // 下 左
        [yz[2], cb[3], xy[3], ct[3], yz[1]], // 中 右前
        [yz[1], ct[2], xy[2], cb[2], yz[2]], // 中 左前
        [yz[0], ct[0], xy[0], cb[0], yz[3]], // 中 右奥
        [yz[3], cb[1], xy[1], ct[1], yz[0]], // 中 左奥
        [zx[3], ct[2], yz[1], ct[3], zx[0]], // 上 前
        [zx[0], ct[0], yz[0], ct[1], zx[3]], // 上 奥
        [zx[1], cb[3], yz[2], cb[2], zx[2]], // 下 前
        [zx[2], cb[1], yz[3], cb[0], zx[1]], // 下 奥
    ];
}

/** rad: 0.36486382811348306, deg: 20.905157447889295 */
export const rad_rot_y_to_z = ut.deg90 - Math.atan2(ut.phi * ut.phi, 1);

/**
 * 正12面体の辺30個
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
