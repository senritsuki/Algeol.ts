import * as vc from '../algeol/datatype/vector';
import * as mx from '../algeol/datatype/matrix';
import * as obj from '../algeol/object/object';
import * as gut from '../algeol/geometry/utility';
import * as prism from '../algeol/geometry/primitive3/prism';
import * as pyramid from '../algeol/geometry/primitive3/pyramid';
import * as poly from '../algeol/geometry/primitive3/polygon';

export enum 原点 {
    中心,
    下,
    左下,
}

export interface 地面info {
    幅x: number,
    幅y: number,
    深さ: number,
    原点: 原点,
    transform: mx.M4|null,
    g_name: string|null,
}

function common_transform_origin(info: 地面info): mx.M4 {
    switch(info.原点) {
        case 原点.中心:
            return mx.unit_m4;
        case 原点.下:
            return mx.m4_translate3([0, info.幅y/2, 0]);
        case 原点.左下:
            return mx.m4_translate3([info.幅x/2, info.幅y/2, 0]);
    }
}
function common_transform(info: 地面info): mx.M4 {
    return mx.mulAll([
        info.transform || mx.unit_m4,
        mx.m4_scale3([info.幅x, info.幅y, info.深さ]),
        common_transform_origin(info),
        mx.m4_rotate3_x180(),
    ]);
}

export function 逆四角錐(info: 地面info): obj.Object {
    return obj.objSingle(pyramid.vf_c(4, 0.5, 1), info.g_name, common_transform(info));
}

export function 直方体(info: 地面info): obj.Object {
    return obj.objSingle(prism.vf_c(4, 0.5, 1), info.g_name, common_transform(info));
}

export interface 六角柱info extends 地面info {
    round_x: number,
}
export function 六角柱(info: 六角柱info): obj.Object {
    const hexagon = gut.toPrism(poly.hexagon(info.幅x, info.幅y, info.round_x, 0), vc.v3(0, 0, info.深さ), null);
    return obj.objSingle(hexagon.vf(), info.g_name, common_transform(info));
}

export interface 八角柱info extends 地面info {
    round_x: number,
    round_y: number,
}
export function 八角柱(info: 八角柱info): obj.Object {
    const octagon = gut.toPrism(poly.octagon(info.幅x, info.幅y, info.round_x, info.round_y, 0), vc.v3(0, 0, info.深さ), null);
    return obj.objSingle(octagon.vf(), info.g_name, common_transform(info));
}

