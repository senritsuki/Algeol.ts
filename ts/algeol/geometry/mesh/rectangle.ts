
import * as sq from '../../algorithm/sequence';
import * as vc from '../../datatype/vector';


export type xy_filter = (x: number, y: number) => boolean;

function seq_yx(x: number, y: number): [number, number][] {
    return sq.to_2d(sq.arithmetic(y), sq.arithmetic(x));
}

function seq_yx_f(x: number, y: number, filter: xy_filter|null): [number, number][] {
    const yx_array = seq_yx(x, y);
    return filter ? yx_array.filter(yx => filter(yx[1], yx[0])) : yx_array;
}

function seq_i(x: number, y: number, x_max: number, filter: xy_filter|null): number[] {
    return seq_yx_f(x, y, filter).map(yx => yx_to_i(yx, x_max));
}

function yx_to_i(yx: [number, number], x: number): number {
    return yx[0] * x + yx[1];
}

function yx_to_vertex<V extends vc.Vector<V>>(yx: [number, number], o: V, dx: V, dy: V, f: null|((v: V) => V)): V {
    const v = o.add(dx.scalar(yx[1]).add(dy.scalar(yx[0])));
    return f ? f(v) : v;
}

function i_to_face_rectangle(i: number, x: number): number[] {
    return [i, i+1, i+1+x, i+x];
}

function i_to_face_triangle(i: number, x: number): number[] {
    return [i, i+1, i+x];
}
function i_to_face_triangle2(i: number, x: number): number[] {
    return [i+1+x, i+1, i+x];
}

export class Rectangle<V extends vc.Vector<V>> {
    constructor(
        public o: V,
        public dx: V,
        public dy: V,
        public div_x: number,
        public div_y: number,
    ){}

    verts(f: null|((v: V) => V)): V[] {
        return verts(this.o, this.dx, this.dy, this.div_x, this.div_y, f);
    }

    faces_rectangle(filter: xy_filter|null): number[][] {
        return faces_rectangle(this.div_x, this.div_y, filter);
    }
    faces_triangle(filter: xy_filter|null): number[][] {
        return faces_triangle(this.div_x, this.div_y, filter);
    }
    faces_triangle2(filter: xy_filter|null): number[][] {
        return faces_triangle2(this.div_x, this.div_y, filter);
    }

    edges_rectangle(): number[][] {
        return edges_rectangle(this.div_x, this.div_y);
    }
    edges_triangle(): number[][] {
        return edges_triangle(this.div_x, this.div_y);
    }

    i_o(): number {
        return 0;
    }
    i_dx(): number {
        return this.div_x;
    }
    i_dy(): number {
        return (this.div_x + 1) * this.div_y;
    }
    i_dxy(): number {
        return (this.div_x + 1) * (this.div_y + 1) - 1;
    }
    face_corner(): number[] {
        return [this.i_o(), this.i_dx(), this.i_dxy(), this.i_dy()];
    }
}

/**
 * x=3, y=2 の場合: o, o+dx, o+2dx, o+3dx, o+dy, o+dx+dy, o+2dx+dy, ..., o+3dx+2dy
 * @param o 
 * @param dx 
 * @param dy 
 * @param div_x 
 * @param div_y 
 */
export function verts<V extends vc.Vector<V>>(o: V, dx: V, dy: V, div_x: number, div_y: number, f: null|((v: V) => V)): V[] {
    return seq_yx(div_x+1, div_y+1).map(yx => yx_to_vertex(yx, o, dx, dy, f));
}

export function faces_rectangle(x: number, y: number, filter: xy_filter|null): number[][] {
    return seq_i(x, y, x+1, filter).map(i => i_to_face_rectangle(i, x));
}

export function faces_triangle(x: number, y: number, filter: xy_filter|null): number[][] {
    return seq_i(x, y, x+1, filter).map(i => i_to_face_triangle(i, x));
}
export function faces_triangle2(x: number, y: number, filter: xy_filter|null): number[][] {
    return seq_i(x, y, x+1, filter).map(i => i_to_face_triangle2(i, x));
}

export function edges_rectangle(x: number, y: number): number[][] {
    const w = x + 1;
    const edges_x = seq_i(x, y+1, x+1, null).map(i => [i, i+1]);
    const edges_y = seq_i(x+1, y, x+1, null).map(i => [i, i+w]);
    return edges_x.concat(edges_y);
}

export function edges_triangle(x: number, y: number): number[][] {
    const w = x + 1;
    const edges_x = seq_i(x, y+1, x+1, null).map(i => [i, i+1]);
    const edges_y = seq_i(x+1, y, x+1, null).map(i => [i, i+w]);
    const edges_d = seq_i(x, y, x+1, null).map(i => [i+1, i+w]);
    return edges_x.concat(edges_y).concat(edges_d);
}
