import * as ut from '../algeol/common';
import * as mx from '../algeol/datatype/matrix';
import * as sq from '../algeol/algorithm/sequence';
import * as prism from '../algeol/geometry/primitive3/prism';
import * as pyramid from '../algeol/geometry/primitive3/pyramid';
import * as obj from '../algeol/object/object';

export interface 葉info {
    数: number,
    半径小: number,
    半径大: number,
    高さ: number,
    transform: mx.M4|null,
    g_name: string|null,
}
export function 葉(info: 葉info): obj.Object {
    const base = obj.objSingle(pyramid.vf_i(4, info.半径大, info.高さ), info.g_name, mx.m4_scale3([1, info.半径小 / info.半径大, 1]));
    let leaf = obj.objDuplicated(base, sq.arithmetic(info.数).map(i => mx.m4_rotate3_z(ut.deg180 * i / info.数)));
    if (info.transform) {
        leaf = obj.objWrapped(leaf, null, info.transform);
    }
    return leaf;
}

export interface 木info {
    葉の数: number,
    葉の段数: number,
    段の高さ: number
    葉の最大半径: number,
    幹の半径: number,
}
export function 木(info: 木info): obj.Object {
    const weight = 1.0;
    const leafs = sq.arithmetic(info.葉の段数).map(i => 葉({
        数: info.葉の数,
        半径小: info.葉の最大半径 * (info.葉の段数 + 1 - i) / (info.葉の段数 + 1) / 3,
        半径大: info.葉の最大半径 * (info.葉の段数 + 1 - i) / (info.葉の段数 + 1),
        高さ: ((info.段の高さ * 2) * weight + (info.段の高さ * 2) * (info.葉の段数 - i) / info.葉の段数) / (weight + 1),
        transform: mx.m4_translate3([0, 0, (i+1)*info.段の高さ]),
        g_name: null,
    }));
    const trunk = obj.objSingle(prism.vf_i(8, info.幹の半径, 1), 'brown', null);
    const tree = obj.objGrouped(leafs.concat([trunk]), 'green', null);
    return tree;
}

export function test(): obj.Object {
    return 木({
        葉の数: 6,
        葉の段数: 3,
        段の高さ: 0.5,
        葉の最大半径: 0.5,
        幹の半径: 0.05,
    })
}
