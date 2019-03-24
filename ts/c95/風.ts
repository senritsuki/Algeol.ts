import * as ut from '../algeol/common';
import * as mx from '../algeol/datatype/matrix';
import * as obj from '../algeol/datatype/object';
import * as 床 from './床';
import * as 木 from './木';

export interface circleTreeInfo {
    g_name_床: string,
    g_name_幹: string,
    g_name_葉: string[],
}
export function circleTree(info: circleTreeInfo): obj.Object {
    const r = 10;
    const rad = ut.deg360 / info.g_name_葉.length;
    const floor = 床.逆4角錐({
        幅x: 1,
        幅y: 1,
        深さ: 1,
        原点: 床.原点.中心,
        g_name: info.g_name_床,
        transform: null,
    });
    const trees = 木.色木({
        葉の数: 6,
        葉の段数: 4,
        段の高さ: 0.4,
        葉の小半径: 0.3,
        葉の大半径: 0.5,
        幹の半径: 0.05,
        g_name_幹: info.g_name_幹,
        g_name_葉: info.g_name_葉,
        transform: null,
    });
    const trees2 = trees.map((tree, i) => obj.objGrouped([tree, floor], null, mx.mulAll([
        mx.m4_rotate3_z(rad * i),
        mx.m4_translate3([r, 0, 0]),
    ])));
    return obj.objGrouped(trees2, null, null);
}
