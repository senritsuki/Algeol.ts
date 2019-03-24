import * as ut from '../algeol/common'
import * as sq from '../algeol/algorithm/sequence'
import * as cc from '../algeol/algorithm/color_converter';

export interface Value {
    key: string,
    rgb01: number[],
}
export interface Set {
    keys: string[],
    values: {[key: string]: Value},
}

export function toKey(l: number, c: number, h: number): string {
    return 'lch_' + [l, c, h].map(n => Math.round(n)).join('_')
}

export function gradient(
    l0: number, c0: number, h0: number,
    l1: number, c1: number, h1: number,
    count: number,
    skipLast: boolean,
): Value[] {
    const imax = count - (skipLast ? 0 : 1);
    const values = sq.arithmetic(count).map(i => {
        const l = ut.mid(l0, l1, i / imax);
        const c = ut.mid(c0, c1, i / imax);
        const h = ut.mid(h0, h1, i / imax);
        const key = toKey(l, c, h);
        const rgb01 = cc.lch_to_rgb01([l, c, h]);
        return {
            key: key,
            rgb01: rgb01,
        }
    });
    return values;
}

export function circle(l: number, c: number, count: number): Value[] {
    return gradient(l, c, 0, l, c, 360, count, true);
}
