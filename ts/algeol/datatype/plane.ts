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
    normal(): vc.V3 {
        return normal(this.v1, this.v2, this.v3);
    }
    plane(): Plane {
        const normal = this.normal();
        return new Plane(normal, normal.ip(this.v1));
    }
}

export class Triangle4 extends Triangle<vc.V4> {}

export function normal(v1: vc.V3, v2: vc.V3, v3: vc.V3): vc.V3 {
    const d1 = v2.sub(v1);
    const d2 = v3.sub(v2);
    const cp = d1.cp(d2);
    return cp.scalar(1 / cp.length());
}
