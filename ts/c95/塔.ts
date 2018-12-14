import * as ut from '../algeol/common'
import * as vc from '../algeol/datatype/vector'
import * as mx from '../algeol/datatype/matrix'
import * as sq from '../algeol/algorithm/sequence'

import * as pArray from '../algeol/geometry/obj/polygon_array';

import * as geo from '../algeol/object/object';

import * as lib from './lib';
import * as lib柱 from './柱';



export interface 塔のサイドinfo {
    /** 柱の内接円の半径 */
    柱の半径: number,
    柱の高さ: number,
    /** 柱の中心間の間隔 + 柱の半径 * 2 */
    柱の両端の間隔: number,
    装飾の幅: number,
    装飾の高さ: number,
    transform: mx.M4|null,
}
export function 塔のサイド(info: 塔のサイドinfo): geo.Object {
    const 角数 = 4;
    const column = lib柱.柱({
        角数: 角数,
        外接円の半径: lib.内接円の半径_to_外接円の半径(角数, info.柱の半径),
        高さ: info.柱の高さ,
        水平回転deg: 45,
    });
    const arch = lib柱.双アーチ({
        片アーチ: lib柱.片三角アーチ({
            dx: info.装飾の幅,
            dy: info.装飾の高さ,
            dz1: -info.柱の半径,
            dz2: info.柱の半径,
            transform: mx.m4_translate3([0, 0, info.柱の高さ]),
        }),
        間隔: info.柱の両端の間隔 - info.柱の半径 * 4,
        transform: mx.m4_translate3([info.柱の半径, 0, 0]),
    });
    const side = lib柱.二本の柱({
        柱: column,
        柱の中心間の間隔: info.柱の両端の間隔 - info.柱の半径 * 2,
        原点: lib柱.二本の柱の原点.一本目,
        水平回転deg: 0,
        装飾: arch,
        transform: mx.mulAll([
            info.transform || mx.unit_m4,
            mx.m4_translate3([info.柱の半径, 0, 0]),
        ]),
    });
    return side;
}

export interface 多角形の塔の柱info {
    塔の角数: number,
    塔の内接円の半径: number,
    柱の半径: number,
    柱の高さ: number,
    装飾の幅: number,
    装飾の高さ: number,
    transform: mx.M4|null,
}
export function 多角形の塔の柱(info: 多角形の塔の柱info): geo.Object {
    const 外接円の半径 = lib.内接円の半径_to_外接円の半径(info.塔の角数, info.塔の内接円の半径);
    const rad = ut.degToRad(180 / info.塔の角数);
    const sideLenHalf = 外接円の半径 * Math.sin(rad)
    const sideLen = sideLenHalf * 2;
    const side = 塔のサイド({
        柱の半径: info.柱の半径,
        柱の高さ: info.柱の高さ,
        柱の両端の間隔: sideLen,
        装飾の幅: info.装飾の幅,
        装飾の高さ: info.装飾の高さ,
        transform: mx.mulAll([
            mx.m4_translate3([info.塔の内接円の半径, -sideLenHalf, 0]),
            mx.m4_rotate3_z(ut.deg90),
            mx.m4_translate3([0, info.柱の半径, 0]),
        ]),
    });
    const sides = geo.objDuplicated(side, sq.arithmetic(info.塔の角数)
        .map(i => mx.m4_rotate3_z(ut.deg360 * i / info.塔の角数)));
    return sides;
}

export function 多角形の多段の塔(): geo.Object {
    return geo.objMultiFaceGroup([], [], null);
}

export function 四角形の塔(): geo.Object {
    const columns = 多角形の塔の柱({
        塔の角数: 6,
        塔の内接円の半径: 1,
        柱の半径: 0.1,
        柱の高さ: 2,
        装飾の幅: 0.8,
        装飾の高さ: 0.8,
        transform: null,
    });
    const roof = geo.objSingle(pArray.vf({
        polygons: [
            pArray.circle_c(6, 1, 2),
        ],
        vFirst: [0, 0, 2],
        vLast: [0, 0, 3],
    }), null, null);
    const tower = geo.objGrouped([
        geo.objWrapped(columns, 'white', null),
        geo.objWrapped(roof, 'blue', null),
    ], null, null);
    return tower;
}
