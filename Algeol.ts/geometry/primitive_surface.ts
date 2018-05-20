/** プリミティブオブジェクト */

import * as vc from "../algorithm/vector";
import * as al from "./surface_core";
import * as fn from "./primitive_lib3d";

type V3 = vc.V3;
const geometry = (verts: V3[], faces: number[][]) => new al.Surfaces(verts, faces);


export function plane_xy(verts: V3[], z: number): al.Surfaces {
    const verts2 = verts.map(v => vc.v3(v.x, v.y, z));
    return geometry(verts2, [verts.map((_, i) => i)]);
}

/**
 * Tetrahedron - 正4面体
 * @param   r   radius of circumscribed sphere - 外接球の半径
 */
export function tetrahedron(r: number): al.Surfaces {
    return geometry(fn.tetrahedron.verts(r), fn.tetrahedron.faces());
}
/**
 * Octahedron - 正8面体
 * @param   r   radius of circumscribed sphere - 外接球の半径
 */
export function octahedron(r: number): al.Surfaces {
    return geometry(fn.octahedron.verts(r), fn.octahedron.faces());
}
/**
 * Cube - 正6面体・立方体
 * @param   r   radius of inscribed sphere - 内接球の半径
 */
export function cube(r: number): al.Surfaces {
    return geometry(fn.cube.verts(r), fn.cube.faces());
}
/**
 * Cuboid - 直方体
 * @param x 
 * @param y 
 * @param z 
 */
export function cuboid(x: number, y: number, z: number): al.Surfaces {
    return geometry(fn.cuboid.verts(x, y, z), fn.cuboid.faces());
}
/**
 * Dodecahedron - 正12面体
 * @param   r   radius of circumscribed sphere - 外接球の半径
 */
export function dodecahedron(r: number): al.Surfaces {
    return geometry(fn.dodecahedron.verts(r), fn.dodecahedron.faces());
}
/**
 * Icosahedron - 正20面体
 * @param   r   radius of circumscribed sphere - 外接球の半径
 */
export function icosahedron(r: number): al.Surfaces {
    return geometry(fn.icosahedron.verts(r), fn.icosahedron.faces());
}

/**
 * Prism - 角柱
 * @param   n_gonal     角柱底面の頂点数
 * @param   r           角柱底面の外接円の半径（xy平面）
 * @param   h           角柱の高さ（+z方向）
 */
export function prism(n_gonal: number, r: number, h: number): al.Surfaces {
    return geometry(fn.prism.verts_i(n_gonal, r, h), fn.prism.faces(n_gonal));
}
/**
 * Pyramid - 角錐
 * @param   n_gonal     角錐底面の頂点数
 * @param   r           角錐底面の外接円の半径（xy平面）
 * @param   h           角錐の高さ（+z方向）
 */
export function pyramid(n_gonal: number, r: number, h: number): al.Surfaces {
    return geometry(fn.pyramid.verts_i(n_gonal, r, h), fn.pyramid.faces(n_gonal));
}
/**
 * Bipyramid - 双角錐
 * @param   n_gonal     角錐底面の頂点数
 * @param   r           角錐底面の外接円の半径（xy平面）
 * @param   h           上向き角錐の高さ（+z方向）
 * @param   d           下向き角錐の深さ（-z方向）
 */
export function bipyramid(n_gonal: number, r: number, h: number, d: number): al.Surfaces {
    return geometry(fn.bipyramid.verts_i(n_gonal, r, h, d), fn.bipyramid.faces(n_gonal));
}

/** z軸上に頂点を置いた正12面体 */
export function rot_dodecahedron(r: number): al.Surfaces {
    return al.rotate_x(dodecahedron(r), fn.dodecahedron.rad_rot_y_to_z);
}
/** z軸上に頂点を置いた正20面体 */
export function rot_icosahedron(r: number): al.Surfaces {
    return al.rotate_x(icosahedron(r), fn.icosahedron.rad_rot_y_to_z);
}

/** v1とv2を対角の頂点とした直方体 */
export function cuboid_vv(v1: number[]|V3, v2: number[]|V3): al.Surfaces {
    v1 = v1 instanceof Array ? vc.array_to_v3(v1) : v1;
    v2 = v2 instanceof Array ? vc.array_to_v3(v2) : v2;
    const center = v1.add(v2).scalar(0.5);
    const d = v2.sub(center);
    return al.translate(cuboid(d.x, d.y, d.z), center);
}

export function trimesh(index: number[][], f: (i: number, j: number) => V3): al.Surfaces {
    const iMax = index.length;
    const jMax = index[0].length;
    const verts: V3[] = [];
    for (let i = 0; i < iMax; i++) {
        for (let j = 0; j < jMax; j++) {
            verts.push(f(i, j));
        }
    }
    const faces: number[][] = [];
    for (let i = 0; i < iMax - 1; i++) {
        const i0 = i * jMax;
        const i1 = (i+1) * jMax;
        for (let j = 0; j < jMax - 1; j++) {
            const i0j0 = i0 + j;
            const i0j1 = i0 + j + 1;
            const i1j0 = i1 + j;
            const i1j1 = i1 + j + 1;
            faces.push([i0j0, i0j1, i1j0]);
            faces.push([i1j1, i1j0, i0j1]);
        }
    }
    return geometry(verts, faces);
}
