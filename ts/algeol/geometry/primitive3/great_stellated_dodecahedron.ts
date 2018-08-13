/**
 * Great stellated dodecahedron - 大星型十二面体
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from '../../common';
import * as vc from '../../datatype/vector';
import * as icosahedron from './icosahedron';
import * as stellation from './stellation';

// 大星型十二面体の凸部分は正3角錐である。
// 凸部分の正3角錐について、
// ・底面の一辺の長さ = 正二十面体の一辺の長さ
// ・底面の中心と辺の距離 = 底面の一辺の長さ/2 * tan(60/2)
// ・高さ = sqrt(側面の二等辺三角形の高さ^2 - 底面の中心と辺の距離)
// 正3角錐の側面の二等辺三角形について、
// ・角度は 36, 72, 72
// ・底辺の長さ = 正二十面体の一辺の長さ
// ・高さ = 底辺の長さ/2 * tan(72)
function calc_stella_height(verts: vc.V3[], faces: number[][]): number {
    const tan30 = Math.tan(ut.degToRad(30));
    const tan72 = Math.tan(ut.degToRad(72));
    const base_len = vc.sub(verts[faces[0][1]], verts[faces[0][0]]).length();
    const base_center_len = tan30 * base_len / 2;
    const side_height = tan72 * base_len / 2;
    const height = Math.sqrt(side_height * side_height - base_center_len * base_center_len);
    return height;
}

function calc_scale(verts: vc.V3[], faces: number[][], stella_height: number): number {
    const d = faces[0].map(i => verts[i]).reduce((a, b) => a.add(b)).scalar(1 / faces[0].length);
    const len = d.length();
    const scale = (len + stella_height) / len;
    return scale;
}

let scale_cache: number|null = null;

function get_scale(verts: vc.V3[], faces: number[][]): number {
    if (scale_cache) {
        return scale_cache;
    } else {
        const stella_height = calc_stella_height(verts, faces);
        const scale = calc_scale(verts, faces, stella_height);
        scale_cache = scale;
        return scale;
    }
}

export function verts(r: number): stellation.VF {
    const verts = icosahedron.verts(r);
    const faces = icosahedron.faces();
    const scale = get_scale(verts, faces);
    return stellation.stellate(verts, faces, scale);
}
