import * as ut from '../algeol/common';
import * as mx from '../algeol/datatype/matrix';

import * as g_triprism from '../algeol/geometry/primitive3/tri_prism'

import * as geo from '../algeol/object/object';
import * as prim from '../algeol/object/primitive';

export interface 柱info {
    角数: number,
    外接円の半径: number,
    高さ: number,
    水平回転deg: number,
}
export function 柱(info: 柱info): geo.Object {
    const column_vf = prim.regular_prism(info.角数, info.外接円の半径, info.高さ);
    const rot = mx.m4_rotate3_z(ut.degToRad(info.水平回転deg));
    const column = geo.objSingle(column_vf, null, rot);
    return column;
}

export interface 二本の柱info {
    柱: geo.Object,
    柱の中心間の間隔: number,
    原点: 二本の柱の原点,
    水平回転deg: number,
    装飾: geo.Object|null,
    transform: mx.M4|null,
}
export enum 二本の柱の原点 {
    一本目,
    中点,
}

export function 二本の柱(info: 二本の柱info): geo.Object {
    let x1 = 0, x2 = 0;
    switch (info.原点) {
        case 二本の柱の原点.一本目:
            x1 = 0;
            x2 = info.柱の中心間の間隔;
            break;
        case 二本の柱の原点.中点:
            x1 = -info.柱の中心間の間隔 / 2;
            x2 = info.柱の中心間の間隔 / 2;
            break;
    }
    const columnObjs = [
        geo.objGrouped([info.柱], mx.m4_translate3([x1, 0, 0]), null),
        geo.objGrouped([info.柱], mx.m4_translate3([x2, 0, 0]), null),
    ];
    if (info.装飾) {
        columnObjs.push(info.装飾);
    }
    const transform = mx.mulAll([
        info.transform || mx.unit_m4,
        mx.m4_rotate3_z(ut.degToRad(info.水平回転deg)),
    ]);
    const columns = geo.objGrouped(columnObjs, transform, null);
    return columns;
}


export interface 片三角アーチinfo {
    dx: number,  // 幅
    dy: number,  // 高さ
    dz1: number, // 奥行き（z1 < z2）
    dz2: number, // 奥行き（z1 < z2）
    transform: mx.M4|null,    // translate([x_offset, 0, 高さ])
}
export function 片三角アーチ(info: 片三角アーチinfo): geo.Object {
    const h = info.dz2 - info.dz1;
    const prism = g_triprism.vf([info.dx, 0], [0, info.dy], h);
    const transform = mx.mulAll([
        info.transform || mx.unit_m4,
        mx.m4_rotate3_x(-ut.deg90),
        mx.m4_translate3([0, 0, info.dz1]),
    ]);
    const obj = geo.objSingle(prism, null, transform);
    return obj;
}
export interface 双アーチinfo {
    片アーチ: geo.Object,
    間隔: number,
    transform: mx.M4|null,
}
export function 双アーチ(info: 双アーチinfo): geo.Object {
    const obj = geo.objDuplicated(info.片アーチ, [
        mx.mulAll([
            info.transform || mx.unit_m4,
        ]),
        mx.mulAll([
            info.transform || mx.unit_m4,
            mx.m4_translate3([info.間隔, 0, 0]),
            mx.m4_rotate3_z180(),
        ]),
    ]);
    return obj;
}
