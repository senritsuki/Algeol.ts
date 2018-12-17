/**
 * コネクタ
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../datatype/vector';
import * as mx from '../../datatype/matrix';
import * as geo from '../object';


export function connect(
    obj: geo.Object, 
    src1: vc.V3, 
    src2: vc.V3, 
    dst1: vc.V3, 
    dst2: vc.V3, 
    /** div(dst_width, src_width) */
    scale_width: number = 1,
    /** div(dst_height, src_height) */
    scale_height: number = 1,
): geo.Object {
    const src_d = src2.sub(src1);
    const src_c = src1.add(src2).scalar(0.5);
    const dst_d = dst2.sub(dst1);
    const dst_c = dst1.add(dst2).scalar(0.5);
    const src_len = src_d.length();
    const dst_len = dst_d.length();
    const transform = mx.mulAllRev([
        mx.m4_translate3(src_c.scalar(-1)),
        mx.m4_rotate_from_v_to_10(vc.v2(src_d.x, src_d.y)),
        mx.m4_scale3([dst_len / src_len, scale_width, scale_height]),
        mx.m4_rotate_from_10_to_v(vc.v2(dst_d.x, dst_d.y)),
        mx.m4_translate3(dst_c),
    ]);
    return geo.objGrouped([obj], null, transform);
}
