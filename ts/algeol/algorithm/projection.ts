﻿/**
 * Projection - 射影演算
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../datatype/vector';
import * as mx from '../datatype/matrix';


export interface Projection {
    projection(dist: vc.V3): vc.V3;
}

class ProjectionImpl implements Projection {
    constructor(
        public _mx: mx.M4,
        public _lambda: (v: vc.V3) => vc.V3) { }
    projection(dist: vc.V3): vc.V3 {
        return this._lambda(this._mx.map_v3(dist, 1));
    }
}

/** Parallel Projection - 平行投影 */
export function parallel(m: mx.M4, scale: number): Projection {
    return new ProjectionImpl(m, v => v.el_mul([scale, scale, 1]));
}
/** Perspective Projection - 透視投影 */
export function perspective(m: mx.M4, scale: number, tan: number, near: number = 1): Projection {
    const c = scale * tan;
    return new ProjectionImpl(m, v => c >= near ? v.el_mul(vc.v3(c / v.z, c / v.z, 1)) : v);
}


/** x軸方向のプロジェクタをxy平面、奥行きzに変換 */
export function viewport_x(): mx.M3 {
    return mx.rows_to_m3([
        [0, 0, 1],
        [-1, 0, 0],
        [0, -1, 0],
    ]);
}
