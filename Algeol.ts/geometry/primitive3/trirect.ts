/**
 * 原点を含みxy平面・yz平面・zx平面に平行で合同な長方形3枚
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../algorithm/vector';

/**
 * 原点を含みxy平面・yz平面・zx平面に平行で合同な長方形3枚の頂点12個
 * xy平面、yz平面、zx平面の順で、さらに第1象限、第2象限、第3象限、第4象限の順
 */
export function verts(a: number, b: number): vc.V3[] {
    return [
        vc.v3(a, b, 0),
        vc.v3(-a, b, 0),
        vc.v3(-a, -b, 0),
        vc.v3(a, -b, 0),
        vc.v3(0, a, b),
        vc.v3(0, -a, b),
        vc.v3(0, -a, -b),
        vc.v3(0, a, -b),
        vc.v3(b, 0, a),
        vc.v3(b, 0, -a),
        vc.v3(-b, 0, -a),
        vc.v3(-b, 0, a),
    ];
}
