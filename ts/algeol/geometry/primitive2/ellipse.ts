/**
 * Ellipse - 楕円
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../../common';
import * as sq from '../../algorithm/sequence';
import * as vc from '../../datatype/vector';

/**
 * 楕円に内接するn角形
 * @param   n_gonal     多角形の頂点数
 * @param   r           多角形の外接円の半径
 * @param   rad         多角形の1つ目の頂点の偏角
 */
export function verts(n_gonal: number, r: vc.V2, rad: number): vc.V2[] {
    return sq.arithmetic(n_gonal, rad, ut.deg360 / n_gonal)
        .map(rad => vc.polar_to_v2(1, rad))
        .map(v => v.el_mul(r));
}

export function b2(r: vc.V2): (v: vc.V2) => boolean {
    return v => {
        v = v.el_div(r);
        v = v.el_mul(v);
        return v.x + v.y <= 1;
    };
}
