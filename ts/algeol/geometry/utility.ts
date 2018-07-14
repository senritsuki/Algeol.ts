import * as sq from '../algorithm/sequence';
import * as vc from '../algorithm/vector'
import * as cv from '../algorithm/curve'

export interface VF<V extends vc.Vector<V>> {
    verts: V[];
    faces: number[][];
}

export function scale_face<V extends vc.Vector<V>>(verts: V[], faces: number[][], scale: number): VF<V> {
    const vf: VF<V> = {verts: [], faces: []};
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

export function get_edges(faces: number[][]): [number, number][] {
    const set = new Set<string>();
    const swap = (n: [number, number]): [number, number] => n[0] > n[1] ? [n[1], n[0]] : n;
    const edges: [number, number][] = [];
    faces.forEach(face => {
        const loop = sq.arithmetic(face.length).map(i => [i, (i+1) % face.length]);
        loop.forEach(ii => {
            const edge = swap([face[ii[0]], face[ii[1]]]);
            const key = edge.join('-');
            if (set.has(key)) {
                return;
            }
            set.add(key);
            edges.push(edge);
        });
    });
    return edges;
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

export class ExpandedPrism<V extends vc.Vector<V>> {
    verts2: V[];

    constructor(
        public verts1: V[],
        public d: V,
        public faces1: number[][],
    ) {
        this.verts2 = verts1.map(v => v.add(d));
    }

    verts(): V[] {
        return this.verts1.concat(this.verts2);
    }
    faces(): number[][] {
        return this.faces_base1().concat(this.faces_base2()).concat(this.faces_side());
    }
    faces_base1(): number[][] {
        return this.faces1;
    }
    faces_base2(): number[][] {
        const n = this.verts1.length;
        return this.faces1.map(face => face.map(i => i + n));
    }
    faces_side(): number[][] {
        const c = this.verts1.length;
        return sq.arithmetic(c)
            .map(n => [n, (n + 1) % c])
            .map(nn => [nn[0], nn[1], nn[1] + c, nn[0] + c]);
    }
    faces_side_open(): number[][] {
        const c = this.verts1.length;
        return sq.arithmetic(c - 1)
            .map(n => [n, n + 1])
            .map(nn => [nn[0], nn[1], nn[1] + c, nn[0] + c]);
    }
}

export function expand<V extends vc.Vector<V>>(verts1: V[], d: V, faces: number[][]): ExpandedPrism<V> {
    return new ExpandedPrism(verts1, d, faces);
}

export function expand2<V extends vc.Vector<V>>(verts: V[], d1: V, d2: V, faces: number[][]): ExpandedPrism<V> {
    const verts1 = verts.map(v => v.add(d1));
    const d = d2.sub(d1);
    return new ExpandedPrism(verts1, d, faces);
}
