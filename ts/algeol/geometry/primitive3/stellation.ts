/**
 * 星型化
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../datatype/vector';

export interface VF {
    verts: vc.V3[];
    faces: number[][];
}

export function stellate(verts: vc.V3[], faces: number[][], scale: number): VF {
    const new_verts = verts.slice(0);
    const new_faces: number[][] = [];
    const o = verts.reduce((a, b) => a.add(b)).scalar(1 / verts.length);
    faces.forEach(face => {
        const fv = face.map(i => verts[i]);
        const fo = fv.reduce((a, b) => a.add(b)).scalar(1 / fv.length);
        const d = fo.sub(o);
        const v = d.scalar(scale);
        new_verts.push(v);
        const n = new_verts.length - 1;
        const pairs = face.map(i => [i, (i + 1) % face.length]);
        pairs.map(p => [n, face[p[0]], face[p[1]]])
            .forEach(f => new_faces.push(f));
    });
    return {
        verts: new_verts,
        faces: new_faces,
    }
}

