/** 
 * Plane - 平面
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from './vector';

export class Plane {
    constructor(
        public n: vc.V3,
        public d: number,
    ) {}

    /** 平面上で最もvに近い点 */
    nearest(v: vc.V3): vc.V3 {
        const t = this.d - this.n.ip(v);
        const d = this.n.scalar(t);
        return v.add(d);
    }
}

export function planeWithND(n: vc.V3, d: number): Plane {
    return new Plane(n, d);
}

export function planeWithV3(v1: vc.V3, v2: vc.V3, v3: vc.V3): Plane|null {
    const n = normal(v1, v2, v3);
    if (!n) {
        return null;
    }
    return new Plane(n, n.ip(v1));
}

/** 法線ベクトルを求める。線形従属の場合はnull */
export function normal(v1: vc.V3, v2: vc.V3, v3: vc.V3): vc.V3|null {
    const d1 = v2.sub(v1);
    const d2 = v3.sub(v2);
    const cp = d1.cp(d2);
    const len = cp.length();
    if (len == 0) {
        return null;
    }
    return cp.scalar(1 / len);
}


/** Triangle - 三角形 */
export class Triangle<V extends vc.Vector<V>> {
    constructor(
        public v1: V,
        public v2: V,
        public v3: V,
    ) {}
}

/** Triangle2 - 二次元平面上の三角形 */
export class Triangle2 extends Triangle<vc.V2> {}

/** Triangle3 - 三次元空間上の三角形 */
export class Triangle3 extends Triangle<vc.V3> {
    normal(): vc.V3|null {
        return normal(this.v1, this.v2, this.v3);
    }
    plane(): Plane|null {
        return planeWithV3(this.v1, this.v2, this.v3);
    }
    gravCoord(v: vc.V3): GravCoord|null {
        return gravCoord(this.v1, this.v2, this.v3, v);
    }
}

export class Triangle4 extends Triangle<vc.V4> {}

export class GravCoord {
    constructor(
        public b1: number,
        public b2: number,
        public b3: number,
    ) {}

    isInnerTriangle(): boolean {
        if (this.b1 >= 0 && this.b2 >= 0 && this.b3 >= 0) {
            return true;
        }
        return false;
    }
}

/** 三角形v1,v2,v3に対するvの重心座標を求める。線形従属の場合はnull */
export function gravCoord(v1: vc.V3, v2: vc.V3, v3: vc.V3, v: vc.V3): GravCoord|null {
    const n = normal(v1, v2, v3);
    if (!n) {
        return null;
    }
    const d1 = v.sub(v1);
    const d2 = v.sub(v2);
    const d3 = v.sub(v3);
    const e1 = v3.sub(v2);
    const e2 = v1.sub(v3);
    const e3 = v2.sub(v1);
    const a = e1.cp(e2).ip(n) / 2;
    const a1 = e1.cp(d3).ip(n) / 2;
    const a2 = e2.cp(d1).ip(n) / 2;
    const a3 = e3.cp(d2).ip(n) / 2;
    const b1 = a1 / a;
    const b2 = a2 / a;
    const b3 = a3 / a;
    return new GravCoord(b1, b2, b3);
}

export class Sphere {
    constructor(
        public c: vc.V3,
        public r: number,
    ) {}
}
