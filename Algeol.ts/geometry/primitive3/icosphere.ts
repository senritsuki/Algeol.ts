/**
 * Icosphere
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../algorithm/vector';
import * as icosahedron from './icosahedron';

export interface VF {
    verts: vc.V3[];
    faces: number[][];
}

/** vertex and index */
interface VI {
    v: vc.V3;
    i: number;
}

function to_key(i1: number, i2: number): string {
    return i1 <= i2 ? i1 + '-' + i2 : i2 + '-' + i1;
}

function process_mid(keymap: Map<string, VI>, i1: number, i2: number, r: number, verts: vc.V3[], subverts: vc.V3[]): VI {
    const key = to_key(i1, i2);
    let vi = keymap.get(key);
    if (!vi) {
        const i = verts.length + subverts.length;
        const v = vc.add(verts[i1], verts[i2]).scalar(0.5).unit().scalar(r);
        vi = {v, i}
        keymap.set(key, vi);
        subverts.push(v);
    }
    return vi;
}

export function verts_faces(r: number, recurse: number): VF {
    const verts = icosahedron.verts(r);
    const faces = icosahedron.faces();
    return verts_faces_recurse({verts, faces}, r, recurse);
}

function verts_faces_recurse(vf: VF, r: number, recurse: number): VF {
    if (recurse <= 0) {
        return vf;
    }
    const keymap = new Map<string, VI>();
    const verts = vf.verts;
    const faces = vf.faces;
    const subverts: vc.V3[] = [];
    let subfaces: number[][] = [];
    const loop = [[0, 1], [1, 2], [2, 0]];
    faces.forEach(f => {
        const vvi = f.map(i => ({v: verts[i], i}));
        const mvi = loop.map(ii => process_mid(keymap, f[ii[0]], f[ii[1]], r, verts, subverts));
        const f123 = loop.map(ii => [vvi[ii[1]], mvi[ii[1]], mvi[ii[0]]].map(vi => vi.i));
        const f4 = [mvi[0], mvi[1], mvi[2]].map(vi => vi.i);
        subfaces = subfaces.concat(f123.concat([f4]));
    });
    const sub_vf = {
        verts: verts.concat(subverts),
        faces: subfaces,
    };
    return verts_faces_recurse(sub_vf, r, recurse - 1);
}
