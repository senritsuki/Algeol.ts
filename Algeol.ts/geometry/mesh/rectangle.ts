
import * as sq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';

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

function yx_to_vertex<V extends vc.Vector<V>>(yx: [number, number], o: V, dx: V, dy: V): V {
    return o.add(dx.scalar(yx[1]).add(dy.scalar(yx[0])));
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


/**
 * x=3, y=2 の場合: o, o+dx, o+2dx, o+3dx, o+dy, o+dx+dy, o+2dx+dy, ..., o+3dx+2dy
 * @param o 
 * @param dx 
 * @param dy 
 * @param x 
 * @param y 
 */
export function verts<V extends vc.Vector<V>>(o: V, dx: V, dy: V, x: number, y: number): V[] {
    return seq_yx(x+1, y+1).map(yx => yx_to_vertex(yx, o, dx, dy));
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
