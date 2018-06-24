/**
 * コネクタ
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../algorithm/vector';
import * as mx from '../../algorithm/matrix';
import * as geo from '../object';


export function connect(
    obj: geo.Object, 
    src1: vc.V3, 
    src2: vc.V3, 
    src_width: number,
    dst1: vc.V3, 
    dst2: vc.V3, 
    dst_width: number,
): geo.Object {
    const src_d = src2.sub(src1);
    const src_c = src1.add(src2).scalar(0.5);
    const dst_d = dst2.sub(dst1);
    const dst_c = dst1.add(dst2).scalar(0.5);
    const src_len = src_d.length();
    const dst_len = dst_d.length();
    const transform = mx.compose([
        mx.affine3_translate(src_c.scalar(-1)),
        mx.affine3_rotate_z_xy_to_10(vc.v2(src_d.x, src_d.y)),
        mx.affine3_scale([dst_len / src_len, dst_width / src_width, 1]),
        mx.affine3_rotate_z_10_to_xy(vc.v2(dst_d.x, dst_d.y)),
        mx.affine3_translate(dst_c),
    ]);
    return geo.obj_group([obj], transform, null, null);
}
