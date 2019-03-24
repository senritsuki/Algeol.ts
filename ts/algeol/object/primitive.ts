/**
 * プリミティブオブジェクトの生成
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as seq from '../algorithm/sequence';
import * as vc from '../datatype/vector';
import * as prim2_circle from '../geometry/primitive2/circle';
import * as prim3_tetrahedron from '../geometry/primitive3/tetrahedron';
import * as prim3_octahedron from '../geometry/primitive3/octahedron';
import * as prim3_cube from '../geometry/primitive3/cube';
import * as prim3_dodecahedron from '../geometry/primitive3/dodecahedron';
import * as prim3_icosahedron from '../geometry/primitive3/icosahedron';
import * as prim3_icosphere from '../geometry/primitive3/icosphere';
import * as prim3_prism from '../geometry/primitive3/prism';
import * as prim3_antiprism from '../geometry/primitive3/antiprism';
import * as prim3_pyramid from '../geometry/primitive3/pyramid';
import * as prim3_bipyramid from '../geometry/primitive3/bipyramid';
import * as prim3_trapezohedron from '../geometry/primitive3/trapezohedron';
import * as obj from '../datatype/object';


const vf = (verts: vc.V3[], faces: number[][]): obj.VF => ({ verts, faces });

/**
 * Regular tetrahedron - 半径rの球に内接する正4面体
 */
export function regular_tetrahedron(r: number = 1): obj.VF {
    return vf(prim3_tetrahedron.verts(r), prim3_tetrahedron.faces());
}

/**
 * Regular octahedron - 半径rの球に内接する正8面体
 */
export function regular_octahedron(r: number = 1): obj.VF {
    return vf(prim3_octahedron.verts(r), prim3_octahedron.faces());
}

/**
 * Regular hexahedron (cube) - 半径rの球に外接する正6面体（立方体）
 */
export function regular_hexahedron(r: number = 1): obj.VF {
    return vf(prim3_cube.verts(r), prim3_cube.faces());
}
export const cube = regular_hexahedron;

/**
 * Regular dodecahedron - 半径rの球に内接する正12面体
 */
export function regular_dodecahedron(r: number = 1): obj.VF {
    return vf(prim3_dodecahedron.verts(r), prim3_dodecahedron.faces());
}

/**
 * Regular icosahedron - 半径rの球に内接する正20面体
 */
export function regular_icosahedron(r: number = 1): obj.VF {
    return vf(prim3_icosahedron.verts(r), prim3_icosahedron.faces());
}

/**
 * icosphere
 */
export function icosphere(recurse: number, r: number = 1): obj.VF {
    return prim3_icosphere.verts_faces(r, recurse);
}

/**
 * 半径rの円に内接する正n角形
 */
export function regular_polygon(n: number, r: number = 1): obj.VF {
    return vf(prim2_circle.verts(n, r, 0).map(v => vc.v3(v.x, v.y, 0)), [seq.arithmetic(n)]);
}
/**
 * 半径rの円に外接する正n角形
 */
export function regular_polygon_c(n: number, r: number = 1): obj.VF {
    return vf(prim2_circle.verts_c(n, r, 0).map(v => vc.v3(v.x, v.y, 0)), [seq.arithmetic(n)]);
}

/**
 * Regular prism - 正n角柱
 * ・底面: 原点中心で半径rの円に内接する正n角形
 * ・高さ: h
 */
export function regular_prism(n: number, r: number = 1, h: number = 1): obj.VF {
    return vf(prim3_prism.verts_i(n, r, h), prim3_prism.faces(n));
}

export function regular_antiprism(n: number, r: number = 1, h: number = 1): obj.VF {
    return vf(prim3_antiprism.verts_i(n, r, h), prim3_antiprism.faces(n));
}

export function prism(base_verts: vc.V3[], translation: vc.V3|number[]): obj.VF {
    const second_base_verts = base_verts.map(v => v.add(translation));
    const verts = base_verts.concat(second_base_verts);
    const faces = prim3_prism.faces(base_verts.length);
    return vf(verts, faces);
}

/**
 * Regular pyramid - 正n角錐
 * ・底面: 原点中心で半径rの円に内接する正n角形
 * ・高さ: h
 */
export function regular_pyramid(n_gonal: number, r: number = 1, h: number = 1): obj.VF {
    return vf(prim3_pyramid.verts_i(n_gonal, r, h), prim3_pyramid.faces(n_gonal));
}

/**
 * Bipyramid - 双角錐
 * ・底面は原点中心で半径1の円に内接
 * ・頂点はz1, z2
 */
export function regular_bipyramid(n: number, z1: number = 1, z2: number = -1): obj.VF {
    return vf(prim3_bipyramid.verts_i(n, 1, z1, z2), prim3_bipyramid.faces(n));
}

/**
 * Trapezohedron - ねじれ双角錐
 * @param n n角形
 * @param b1 底面1のz座標
 * @param b2 底面2のz座標
 * @param z1 頂点1のz座標
 * @param z2 頂点2のz座標
 */
export function regular_trapezohedron(n: number, b1: number, b2: number, z1: number, z2: number): obj.VF {
    return vf(prim3_trapezohedron.verts(n, 1, b1, b2, z1, z2), prim3_trapezohedron.faces(n));
}
