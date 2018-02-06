import * as vc from '../algorithm/vector';
import * as sfl from './surface_lib';
import * as prim from './primitive_core';

const prism_z_min = 0;
const prism_z_max = 1;

/** 任意の平面形状の角柱 */
export function Prism(p2: prim.Plane): prim.Primitive {
    return new prim.BasePrimitive(v => {
        if (v.z < prism_z_min || v.z > prism_z_max) return false;
        return p2.b2(vc.v3_to_v2(v));
    }, 
    () => sfl.extrude2(p2.sf, prism_z_max));
}
/** 任意の平面形状の角錐 */
export function Cone(p2: prim.Plane): prim.Primitive {
    return new prim.BasePrimitive(v => {
        if (v.z < prism_z_min || v.z > prism_z_max) return false;
        if (v.z == prism_z_max) {
            v = vc.v3(0, 0, prism_z_max);
        } else {
            v = v.scalar(1 / (prism_z_max - v.z));
        }
        return p2.b2(vc.v3_to_v2(v));
    }, 
    () => sfl.extrude2_cone(p2.sf, prism_z_max));
}

/** 半径1の円に外接する正方形 */
export function b2_square(v: vc.V2): boolean {
    return Math.max(Math.abs(v.x), Math.abs(v.y)) <= 1;
}
/** 半径1の円に内接するひし形 */
export function b2_rhombus(v: vc.V2): boolean {
    return Math.abs(v.x) + Math.abs(v.y) <= 1;
}
