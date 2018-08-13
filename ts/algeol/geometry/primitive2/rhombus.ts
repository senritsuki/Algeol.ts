/**
 * Rhombus - ひし形
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../datatype/vector';

export function round4_1(x: number, y: number): vc.V2[] {
    return [
        vc.v2(x, 0),
        vc.v2(0, y),
        vc.v2(-x, 0),
        vc.v2(0, -y),
    ];
}
export function round4_2(x: number, y: number): vc.V2[] {
    return [
        vc.v2(x, y),
        vc.v2(-x, y),
        vc.v2(-x, -y),
        vc.v2(x, -y),
    ];
}

/** ひし形 */
export function verts(r: vc.V2): vc.V2[] {
    return round4_1(r.x, r.y);
}
/** ひし形 */
export function b2(r: vc.V2): (v: vc.V2) => boolean {
    return v => {
        v = v.el_div(r);
        return Math.abs(v.x) + Math.abs(v.y) <= 1;
    };
}
