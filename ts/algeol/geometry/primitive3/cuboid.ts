/**
 * Cuboid - 直方体
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from '../../datatype/vector';

export interface ICuboid {
    o: vc.V3;
    r: vc.V3;
}
export class Cuboid {
    constructor(
        public d: ICuboid,
    ) {}

    verts(): vc.V3[] {
        return verts_o_r(this.d.o, this.d.r);
    }
    faces(): number[][] {
        return faces();
    }
    faces_top(): number[][] {
        return faces_top();
    }
    faces_side(): number[][] {
        return faces_side();
    }
    faces_bottom(): number[][] {
        return faces_bottom();
    }

    edges(): [number, number][] {
        return edges();
    }

    isin(v: vc.V3): boolean {
        const d = v.sub(this.d.o).el_div(this.d.r);
        return d.absmax() <= 1;
    }
}

export function cuboid(
    o: vc.V3,
    r: vc.V3,
): Cuboid {
    return new Cuboid({o, r});
}


/**
 * 直方体の頂点8つ
 * 頂点の順序は立方体と同じであり、同じface配列を流用する
 */
export function verts(x: number, y: number, z: number): vc.V3[] {
    return [
        vc.v3(x, y, z),    // 上 右奥
        vc.v3(-x, y, z),   // 上 左奥
        vc.v3(-x, -y, z),  // 上 左前
        vc.v3(x, -y, z),   // 上 右前
        vc.v3(x, y, -z),   // 下 右奥
        vc.v3(-x, y, -z),  // 下 左奥
        vc.v3(-x, -y, -z), // 下 左前
        vc.v3(x, -y, -z),  // 下 右前
    ];
}

export function verts_o_r(o: vc.V3, r: vc.V3): vc.V3[] {
    return verts(r.x, r.y, r.z).map(v => v.add(o));
}

/** 直方体の面6つ */
export function faces(): number[][] {
    return [
        [0, 1, 2, 3], // 上
        [7, 6, 5, 4], // 下
        [4, 5, 1, 0], // 奥
        [5, 6, 2, 1], // 左
        [6, 7, 3, 2], // 前
        [7, 4, 0, 3], // 右
    ];
}
/** 直方体の上面 */
export function faces_top(): number[][] {
    return [
        [0, 1, 2, 3], // 上
    ];
}
/** 直方体の下面 */
export function faces_bottom(): number[][] {
    return [
        [7, 6, 5, 4], // 下
    ];
}
/** 直方体の側面 */
export function faces_side(): number[][] {
    return [
        [4, 5, 1, 0], // 奥
        [5, 6, 2, 1], // 左
        [6, 7, 3, 2], // 前
        [7, 4, 0, 3], // 右
    ];
}

/**
 * 直方体の辺12個
 */
export function edges(): [number, number][] {
    return [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],
    ];
}
