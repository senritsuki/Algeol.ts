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
import * as prim3_pyramid from '../geometry/primitive3/pyramid';
import * as prim3_bipyramid from '../geometry/primitive3/bipyramid';
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

/** Tetrahedron - 正4面体 */
export function tetrahedron(): geo.Object {
    return common('tetrahedron', () => prim3_tetrahedron.verts(1), prim3_tetrahedron.faces);
}

/** Octahedron - 正8面体 */
export function octahedron(): geo.Object {
    return common('octahedron', () => prim3_octahedron.verts(1), prim3_octahedron.faces);
}

/** Cube - 正6面体・立方体 */
export function cube(): geo.Object {
    return common('cube', () => prim3_cube.verts(1), prim3_cube.faces);
}

/** Dodecahedron - 正12面体 */
export function dodecahedron(): geo.Object {
    return common('dodecahedron', () => prim3_dodecahedron.verts(1), prim3_dodecahedron.faces);
}

/** Icosahedron - 正20面体 */
export function icosahedron(): geo.Object {
    return common('icosahedron', () => prim3_icosahedron.verts(1), prim3_icosahedron.faces);
}

/** 円に内接する正n角形 */
export function circle(n_gonal: number): geo.Object {
    return common(
        `circle-${n_gonal}`,
        () => prim2_circle.verts(n_gonal, 1, 0).map(v => vc.v3(v.x, v.y, 0)),
        () => [seq.arithmetic(n_gonal)],
    );
}
/** 円に外接する正n角形 */
export function circle_c(n_gonal: number): geo.Object {
    return common(
        `circle-c-${n_gonal}`,
        () => prim2_circle.verts_c(n_gonal, 1, 0).map(v => vc.v3(v.x, v.y, 0)),
        () => [seq.arithmetic(n_gonal)],
    );
}

export function prism(n_gonal: number): geo.Object {
    return common(
        `prism-${n_gonal}`, 
        () => prim3_prism.verts_i(n_gonal, 1, 1),
        () => prim3_prism.faces(n_gonal),
    );
}

export function pyramid(n_gonal: number): geo.Object {
    return common(
        `pyramid-${n_gonal}`, 
        () => prim3_pyramid.verts_i(n_gonal, 1, 1),
        () => prim3_pyramid.faces(n_gonal),
    );
}

export function bipyramid(n_gonal: number): geo.Object {
    return common(
        `bipyramid-${n_gonal}`, 
        () => prim3_bipyramid.verts_i(n_gonal, 1, 1, 1),
        () => prim3_bipyramid.faces(n_gonal),
    );
}
