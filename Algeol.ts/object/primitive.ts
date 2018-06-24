/**
 * プリミティブオブジェクトの生成
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as seq from '../algorithm/sequence';
import * as vc from '../algorithm/vector';
import * as prim2_circle from '../geometry/primitive2/circle';
import * as prim3_tetrahedron from '../geometry/primitive3/tetrahedron';
import * as prim3_octahedron from '../geometry/primitive3/octahedron';
import * as prim3_cube from '../geometry/primitive3/cube';
import * as prim3_dodecahedron from '../geometry/primitive3/dodecahedron';
import * as prim3_icosahedron from '../geometry/primitive3/icosahedron';
import * as prim3_prism from '../geometry/primitive3/prism';
import * as prim3_antiprism from '../geometry/primitive3/antiprism';
import * as prim3_pyramid from '../geometry/primitive3/pyramid';
import * as prim3_bipyramid from '../geometry/primitive3/bipyramid';
import * as prim3_trapezohedron from '../geometry/primitive3/trapezohedron';
import * as geo from './object';

class VF {
    constructor(
        public verts: vc.V3[],
        public faces: number[][],
    ) {}
}

const cache: Map<string, VF> = new Map();

function common(key: string, verts: () => vc.V3[], faces: () => number[][]): geo.Object {
    let vf = cache.get(key);
    if (!vf) {
        vf = new VF(verts(), faces());
        cache.set(key, vf);
    }
    return geo.obj_single(
        vf.verts,
        [geo.face(vf.faces, null, null)],
        null,
        null,
    );
}

/**
 * Regular tetrahedron - 半径1の球に内接する正4面体
 */
export function regular_tetrahedron(): geo.Object {
    return common('regular_tetrahedron', () => prim3_tetrahedron.verts(1), prim3_tetrahedron.faces);
}

/**
 * Regular octahedron - 半径1の球に内接する正8面体
 */
export function regular_octahedron(): geo.Object {
    return common('regular_octahedron', () => prim3_octahedron.verts(1), prim3_octahedron.faces);
}

/**
 * Regular hexahedron (cube) - 半径1の球に外接する正6面体（立方体）
 */
export function regular_hexahedron(): geo.Object {
    return common('regular_hexahedron', () => prim3_cube.verts(1), prim3_cube.faces);
}
export const cube = regular_hexahedron;

/**
 * Regular dodecahedron - 半径1の球に内接する正12面体
 */
export function regular_dodecahedron(): geo.Object {
    return common('regular_dodecahedron', () => prim3_dodecahedron.verts(1), prim3_dodecahedron.faces);
}

/**
 * Regular icosahedron - 半径1の球に内接する正20面体
 */
export function regular_icosahedron(): geo.Object {
    return common('regular_icosahedron', () => prim3_icosahedron.verts(1), prim3_icosahedron.faces);
}

/**
 * 半径1の円に内接する正n角形
 */
export function regular_polygon(n: number): geo.Object {
    return common(
        `regular_polygon_${n}`,
        () => prim2_circle.verts(n, 1, 0).map(v => vc.v3(v.x, v.y, 0)),
        () => [seq.arithmetic(n)],
    );
}
/**
 * 半径1の円に外接する正n角形
 */
export function regular_polygon_c(n: number): geo.Object {
    return common(
        `regular_polygon_c_${n}`,
        () => prim2_circle.verts_c(n, 1, 0).map(v => vc.v3(v.x, v.y, 0)),
        () => [seq.arithmetic(n)],
    );
}

/**
 * Regular prism - 正n角柱
 * ・底面は原点中心で半径1の円に内接する正n角形
 * ・高さは1
 */
export function regular_prism(n: number): geo.Object {
    return common(
        `regular_prism_${n}`, 
        () => prim3_prism.verts_i(n, 1, 1),
        () => prim3_prism.faces(n),
    );
}

export function regular_antiprism(n: number): geo.Object {
    return common(
        `regular_antiprism_${n}`, 
        () => prim3_antiprism.verts_i(n, 1, 1),
        () => prim3_antiprism.faces(n),
    );
}

export function prism(base_verts: vc.V3[], translation: vc.V3|number[]): geo.Object {
    const second_base_verts = base_verts.map(v => v.add(translation));
    const verts = base_verts.concat(second_base_verts);
    const faces = prim3_prism.faces(base_verts.length);
    return geo.obj_single(
        verts,
        [geo.face(faces, null, null)],
        null,
        null,
    );
}

/**
 * Regular pyramid - 正n角錐
 * ・底面は原点中心で半径1の円に内接する正n角形
 * ・高さは1
 */
export function regular_pyramid(n_gonal: number): geo.Object {
    return common(
        `regular_pyramid_${n_gonal}`, 
        () => prim3_pyramid.verts_i(n_gonal, 1, 1),
        () => prim3_pyramid.faces(n_gonal),
    );
}

/**
 * Bipyramid - 双角錐
 * ・底面は原点中心で半径1の円に内接
 * ・頂点はz1, z2
 */
export function regular_bipyramid(n: number, z1: number, z2: number): geo.Object {
    return geo.obj_single(
        prim3_bipyramid.verts_i(n, 1, z1, z2),
        [geo.face(prim3_bipyramid.faces(n), null, null)],
        null,
        null,
    );
}

export function regular_trapezohedron(n: number, b1: number, b2: number, z1: number, z2: number): geo.Object {
    return geo.obj_single(
        prim3_trapezohedron.verts(n, 1, b1, b2, z1, z2),
        [geo.face(prim3_trapezohedron.faces(n), null, null)],
        null,
        null,
    );
}
