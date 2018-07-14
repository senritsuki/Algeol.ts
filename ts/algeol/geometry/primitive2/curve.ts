import * as ut from '../../algorithm/utility';
import * as sq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';
import * as mx from '../../algorithm/matrix';
import * as cv from '../../algorithm/curve';

export enum ExpandDir {
    Left,
    Right,
    Both,
}

/**
 * 曲線
 * @param curve         曲線
 * @param n             曲線を近似する辺の数
 */
export function verts_expand(curve: cv.Curve2, n: number, dir: ExpandDir, width: number): vc.V2[] {
    const tt = sq.range(0, 1, n);
    const rays = tt.map(t => curve.ray(t));
    const v1 = rays.map(ray => ray.c);
    const rot90 = mx.m2_rotate_90();
    const lefts = rays.map(ray => rot90.map(ray.d).unit().scalar(width));
    if (dir == ExpandDir.Left) {
        const v2 = ut.zip(rays, lefts).map(d => d[0].c.add(d[1]));
        return v1.concat(v2);
    } else if (dir == ExpandDir.Right) {
        const v2 = ut.zip(rays, lefts).map(d => d[0].c.sub(d[1]));
        return v1.concat(v2);
    } else {
        const v2 = ut.zip(rays, lefts).map(d => d[0].c.add(d[1].scalar(0.5)));
        const v3 = ut.zip(rays, lefts).map(d => d[0].c.add(d[1].scalar(0.5)));
        return v2.concat(v3);
    }
}

/**
 * 曲線
 * @param curve         曲線1
 * @param curve         曲線2
 * @param n             曲線を近似する辺の数
 */
export function verts(curve1: cv.Curve2, curve2: cv.Curve2, n: number): vc.V2[] {
    const tt = sq.range(0, 1, n);
    const v1 = tt.map(t => curve1.coord(t));
    const v2 = tt.map(t => curve2.coord(t));
    return v1.concat(v2);
}

export function faces(n: number): number[][] {
    const nn = sq.arithmetic(n);
    return nn.map(i => [i, i+n, i+n+1, i+1]);
}
