/** プリミティブオブジェクト */

import * as vc from "../algorithm/vector";

export function to_v3_xy(z: number = 0): (v: vc.V2) => vc.V3 {
    return v => vc.v3(v.x, v.y, z);
}
export function to_v3_xz(y: number = 0): (v: vc.V2) => vc.V3 {
    return v => vc.v3(v.x, y, v.y);
}
