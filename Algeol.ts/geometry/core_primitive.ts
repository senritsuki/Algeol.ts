/**
 * プリミティブオブジェクトの生成
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as seq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";
import * as geo from "./core";
import * as prim2 from "./primitive_lib2d";
import * as prim3 from "./primitive_lib3d";

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
    return common('tetrahedron', () => prim3.tetrahedron.verts(1), prim3.tetrahedron.faces);
}

/** Octahedron - 正8面体 */
export function octahedron(): geo.Object {
    return common('octahedron', () => prim3.octahedron.verts(1), prim3.octahedron.faces);
}

/** Cube - 正6面体・立方体 */
export function cube(): geo.Object {
    return common('cube', () => prim3.cube.verts(1), prim3.cube.faces);
}

/** Dodecahedron - 正12面体 */
export function dodecahedron(): geo.Object {
    return common('dodecahedron', () => prim3.dodecahedron.verts(1), prim3.dodecahedron.faces);
}

/** Icosahedron - 正20面体 */
export function icosahedron(): geo.Object {
    return common('icosahedron', () => prim3.icosahedron.verts(1), prim3.icosahedron.faces);
}

/** 円に内接する正n角形 */
export function circle(n_gonal: number): geo.Object {
    return common(
        `circle-${n_gonal}`,
        () => prim2.circle_verts(n_gonal, 1, 0).map(v => vc.v3(v.x, v.y, 0)),
        () => [seq.arithmetic(n_gonal)],
    );
}
/** 円に外接する正n角形 */
export function circle_c(n_gonal: number): geo.Object {
    return common(
        `circle-c-${n_gonal}`,
        () => prim2.circle_verts_c(n_gonal, 1, 0).map(v => vc.v3(v.x, v.y, 0)),
        () => [seq.arithmetic(n_gonal)],
    );
}

export function prism(n_gonal: number): geo.Object {
    return common(
        `prism-${n_gonal}`, 
        () => prim3.prism.verts_i(n_gonal, 1, 1),
        () => prim3.prism.faces(n_gonal),
    );
}

export function pyramid(n_gonal: number): geo.Object {
    return common(
        `pyramid-${n_gonal}`, 
        () => prim3.pyramid.verts_i(n_gonal, 1, 1),
        () => prim3.pyramid.faces(n_gonal),
    );
}

export function bipyramid(n_gonal: number): geo.Object {
    return common(
        `bipyramid-${n_gonal}`, 
        () => prim3.bipyramid.verts_i(n_gonal, 1, 1, 1),
        () => prim3.bipyramid.faces(n_gonal),
    );
}
