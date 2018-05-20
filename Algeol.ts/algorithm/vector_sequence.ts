/** Sequence - 数列 */

import * as sq from "./sequence";
import * as vc from "./vector";


/** 
 * Arithmetic Sequence - 等差数列
 */
export function v_arith<T extends vc.Vector<T>>(start: T, diff: T, count: number): T[] {
    const seq: T[] = new Array(count);
    for (let i = 0; i < count; i++) {
        seq[i] = start.add(diff.scalar(i));
    }
    return seq;
}

/**
 * Geometric Sequence - 等比数列
 */
export function v_geo<T extends vc.Vector<T>>(count: number, start: T, ratio: T): T[] {
    const seq: T[] = new Array(count);
    for (let i = 0, n = start; i < count; i++, n = n.el_mul(ratio)) {
        seq[i] = n;
    }
    return seq;
}

export function v_arith2<T extends vc.Vector<T>>(o: T, d1: T, count1: number, d2: T, count2: number): T[] {
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
export function v_arith3<T extends vc.Vector<T>>(o: T, d1: T, count1: number, d2: T, count2: number, d3: T, count3: number): T[] {
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

