/**
 * Vector sequence - ベクトル数列の生成
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as sq from './sequence';
import * as vc from './vector';
//import * as cv from './curve';

/** 
 * Arithmetic Sequence - 等差数列
 */
export function arithmetic<T extends vc.Vector<T>>(count: number, start: T, diff: T): T[] {
    const seq: T[] = new Array(count);
    for (let i = 0; i < count; i++) {
        seq[i] = start.add(diff.scalar(i));
    }
    return seq;
}

/**
 * Geometric Sequence - 等比数列
 */
export function geometric<T extends vc.Vector<T>>(count: number, start: T, ratio: T): T[] {
    const seq: T[] = new Array(count);
    for (let i = 0, n = start; i < count; i++, n = n.el_mul(ratio)) {
        seq[i] = n;
    }
    return seq;
}

export function arithmetic2<T extends vc.Vector<T>>(o: T, d1: T, count1: number, d2: T, count2: number): T[] {
    const seq: T[] = new Array(count1 * count2);
    sq.arithmetic(count1).forEach(i => {
        const i2 = i * count2;
        sq.arithmetic(count2).forEach(j => {
            const i3 = i2 + j;
            seq[i3] = o.add(d1.scalar(i)).add(d2.scalar(j));
        });
    });
    return seq;
}
export function arithmetic3<T extends vc.Vector<T>>(o: T, d1: T, count1: number, d2: T, count2: number, d3: T, count3: number): T[] {
    const seq: T[] = new Array(count1 * count2);
    sq.arithmetic(count1).forEach(i => {
        const i2 = i * count2 * count3;
        sq.arithmetic(count2).forEach(j => {
            const i3 = i2 + j * count3;
            sq.arithmetic(count3).forEach(k => {
                const i4 = i3 + k;
                seq[i4] = o.add(d1.scalar(i)).add(d2.scalar(j)).add(d3.scalar(k));
            });
        });
    });
    return seq;
}

export function accelerate<T extends vc.Vector<T>>(o: T, velocity: T, acceleration: T, count: number): T[] {
    const seq: T[] = new Array(count);
    let c = o;
    let v = velocity;
    sq.arithmetic(count).forEach(i => {
        seq[i] = c;
        c = c.add(v);
        v = v.add(acceleration);
    });
    return seq;
}

export function range<V extends vc.Vector<V>>(first: V, last: V, count: number, skip_last: boolean = false): V[] {
    const i_max = skip_last ? count - 1 : count;
    const seq: V[] = new Array(i_max);
    for (let i = 0; i < i_max; i++) {
        const r = i / (count - 1);  // 0.0 ... 1.0
        const n = vc.add(first.scalar(1 - r), last.scalar(r));
        seq[i] = n;
    }
    return seq;
}

export function arc_range<V extends vc.Vector<V>>(o: V, dx: V, dy: V, rad1: number, rad2: number, count: number, skip_last: boolean = false): V[] {
    const fx = Math.cos;
    const fy = Math.sin;
    return arc_range_custom(o, dx, dy, fx, fy, rad1, rad2, count, skip_last);
}

export function arc_range_custom<V extends vc.Vector<V>>(
    o: V, 
    dx: V, 
    dy: V, 
    fx: (rad: number) => number,
    fy: (rad: number) => number, 
    rad1: number,
    rad2: number,
    count: number,
    skip_last: boolean = false,
): V[] {
    return sq.range(rad1, rad2, count, skip_last)
        .map(rad => o.add(dx.scalar(fx(rad)).add(dy.scalar(fy(rad)))))
}

