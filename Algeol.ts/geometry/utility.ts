import * as sq from '../algorithm/sequence';
import * as vc from '../algorithm/vector'
import * as cv from '../algorithm/curve'

export interface VFs<V extends vc.Vector<V>> {
    verts: V[];
    faces: number[][];
}

export function scaling<V extends vc.Vector<V>>(verts: V[], faces: number[][], scale: number): VFs<V> {
    const vf: VFs<V> = {verts: [], faces: []};
    faces.forEach(face => {
        const verts1 = face.map(i => verts[i]);
        const center = verts1.reduce((a, b) => a.add(b)).scalar(1 / verts1.length);
        const verts2 = verts1.map(v => v.sub(center).scalar(scale).add(center));
        const offset = vf.verts.length;
        const face2 = verts2.map((_, i) => offset + i);
        vf.verts = vf.verts.concat(verts2);
        vf.faces.push(face2);
    });
    return vf;
}

export function edges_to_lines<V extends vc.Vector<V>>(verts: V[], edges: number[][]): cv.Curve<V>[] {
    return edges.map(edge => cv.line(verts[edge[0]], verts[edge[1]]));
}

export function faces_side(bottom_face: number[], top_face: number[]): number[][] {
    const b = bottom_face;
    const t = top_face;
    const n_gonal = Math.max(bottom_face.length, top_face.length);
    return sq.arithmetic(n_gonal)
        .map(i => [i, (i + 1) % n_gonal])
        .map(i => [b[i[0]], b[i[1]], t[i[1]], t[i[0]]]);
}
