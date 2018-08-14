/** 
 * Ray - 光線・半直線
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from './vector';
import * as mx from './matrix';

export interface RayJson {
    c: number[];
    d: number[];
}

/** Ray - 光線・半直線 */
export class Ray<V extends vc.Vector<V>> {
    constructor(
        /** 位置ベクトル */
        public c: V,
        /** 方向ベクトル */
        public d: V,
    ) { }

    /** c + td */
    p(t: number): V {
        const d = this.d.scalar(t);
        return this.c.add(d);
    }

    /** 方向ベクトルの単位ベクトル化 */
    unit(): Ray<V> {
        const d = this.d.unit();
        return new Ray(this.c, d);
    }

    /** 光線上で最もvに近い点 */
    nearest(v: V): V {
        const t = this.d.ip(v.sub(this.c));
        const d = this.d.scalar(t);
        return this.c.add(d);
    }

    toJson(): RayJson {
        return {
            c: this.c._v,
            d: this.d._v,
        };
    }

    toString(): string {
        return `{ c: ${this.c.toString03f()}, d: ${this.d.toString03f()} }`;
    }
}

export class Ray1 extends Ray<vc.V1> {}
export class Ray2 extends Ray<vc.V2> {}
export class Ray3 extends Ray<vc.V3> {}
export class Ray4 extends Ray<vc.V4> {}


/** Ray - 光線・半直線 */
export function ray<T extends vc.Vector<T>>(c: T, d: T): Ray<T> {
    return new Ray(c, d);
}

export function ray3_to_ray2(ray3: Ray3): Ray2 {
    const c = vc.v3_to_v2(ray3.c);
    const d = vc.v3_to_v2(ray3.d);
    return ray(c, d);
}

export function rot_ray3d_z(ray3: Ray3, rad: number): Ray3 {
    const d = mx.m3_rotate_z(rad).map(ray3.d);
    return ray(ray3.c, d);
}

export function map_ray3(ray3: Ray3, f: (v: vc.V4) => vc.V4): Ray3 {
    const c = vc.v4map_v3(ray3.c, 1, f);
    const d = vc.v4map_v3(ray3.d, 0, f);
    return ray(c, d);
}

export function transform(src: Ray3, dst: Ray3): mx.M4 {
    return mx.compose([
        mx.m4_translate3(src.c.scalar(-1)),
        mx.m4_rotate_from_v1_to_v2(src.d, dst.d),
        mx.m4_translate3(dst.c),
    ]);
}

export function transfrom_to_100(src: Ray3): mx.M4 {
    return mx.compose([
        mx.m4_translate3(src.c.scalar(-1)),
        mx.m4_rotate_from_v_to_001(src.d),
    ]);
}
