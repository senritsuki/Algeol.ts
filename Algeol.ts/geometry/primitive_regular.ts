import * as ut from '../algorithm/utility';
import * as seq from '../algorithm/sequence';
import * as vc from '../algorithm/vector';
import * as sf from './surface_core';
import * as sfl from './surface_lib';
import * as prim from './primitive_core';

/** 半径1の球 */
export function sphere(div_horizontal: number, div_vertical: number): prim.Primitive3s {
    return prim.primitive3(b3_sphere, build_sf_sphere(div_horizontal, div_vertical));
}

/** 半径1の球 */
export function b3_sphere(v: vc.V3): boolean {
    v = v.el_mul(v);
    return v.x + v.y + v.z <= 1;
}

/** 半径1の球 (UV Sphere) */
function build_sf_sphere(hd: number, vd: number): () => sf.Surfaces {
    const rad_vs = seq.range_wo_last(-ut.pi/2, ut.pi/2, vd).slice(1);
    const rad_hs = seq.range_wo_last(0, ut.pi2, hd);
    const polygons = rad_vs.map(rad_v => rad_hs.map(rad_h => vc.sphere_to_v3(1, rad_h, rad_v)));
    const v1 = vc.v3(0, 0, -1);
    const v2 = vc.v3(0, 0, 1);
    return () => sfl.antiprismArray_bipyramid(polygons, v1, v2);
}


/** 半径1の球に外接する立方体 */
export function b3_cube(v: vc.V3): boolean {
    return Math.max(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z)) <= 1;
}
/** 半径1の球に外接する立方体 */
export function sf_cube(): sf.Surfaces {
    const verts = [vc.v3(1, 1, 0), vc.v3(-1, 1, 0), vc.v3(-1, -1, 0), vc.v3(1, -1, 0)];
    return sfl.extrude3(verts, vc.v3(0, 0, -1), vc.v3(0, 0, 1));
}

/** 半径1の球に内接する正八面体 */
export function b3_octahedron(v: vc.V3): boolean {
    return Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z) <= 1;
}
export function sf_octahedron(): sf.Surfaces {
    const verts = [vc.v3(0, 1, 0), vc.v3(0, 1, 0), vc.v3(-1, 0, 0), vc.v3(0, -1, 0)];
    return sfl.extrude3_bicone(verts, vc.v3(0, 0, -1), vc.v3(0, 0, 1));
}

/** 半径1の球に外接する立方体 */
export function cube(): prim.Primitive3s {
    return prim.primitive3(b3_cube, sf_cube);
}
/** 半径1の球に内接する正八面体 */
export function octahedron(): prim.Primitive3s {
    return prim.primitive3(b3_octahedron, sf_octahedron);
}

/** 半径1の球の一部 */
export function build_b3_pie(deg_h_max: number, deg_v_min: number, deg_v_max: number): (v: vc.V3) => boolean {
    return v => {
        const r_rh_rv = vc.v3_to_sphere(v);
        if (r_rh_rv[0] > 1) return false;
        const deg_h = ut.rad_to_deg(r_rh_rv[1]);
        const deg_v = ut.rad_to_deg(r_rh_rv[2]);
        return ut.isin(0, deg_h_max, deg_h) && ut.isin(deg_v_min, deg_v_max, deg_v);
    }
}
