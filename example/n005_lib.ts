import * as seq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";
import * as mx from "../algorithm/matrix";
import * as cv from "../algorithm/curve";

import * as al from "../geometry/geo";
import * as geo_array from "../geometry/array";

type V3 = vc.V3;
const v3 = vc.v3;

function verts_to_one_face_geo(verts: V3[]): al.Geo {
    const faces = verts.map((_, i) => i);
    return new al.Geo(verts, [faces]);
}

export function arch_wall(o: V3, outer_dx: V3, outer_dy: V3, inner_dx: number, inner_dy: number, inner_v_num: number): al.Geo {
    const p1 = o.add(outer_dx);
    const p2 = p1.add(outer_dy);
    const p4 = o.sub(outer_dx);
    const p3 = p4.add(outer_dy);
    const px_inner = o.add(outer_dx.scalar(inner_dx));
    const py_inner = o.add(outer_dy.scalar(inner_dy));
    const arc = cv.circle(o, px_inner, py_inner);
    const p_arch = seq.range(0.5, 0, inner_v_num).map(t => arc.coord(t));
    const verts = [p1, p2, p3, p4].concat(p_arch);
    return verts_to_one_face_geo(verts);
}
export function arch_bar(o: V3, outer_dx: V3, outer_dy: V3, inner_dx: number, inner_dy: number, inner_v_num: number): al.Geo {
    const x_outer = o.add(outer_dx);
    const y_outer = o.add(outer_dy);
    const x_inner = o.add(outer_dx.scalar(inner_dx));
    const y_inner = o.add(outer_dy.scalar(inner_dy));
    const arc_outer = cv.circle(o, x_outer, y_outer);
    const arc_inner = cv.circle(o, x_inner, y_inner);
    const p_arch_outer = seq.range(0, 0.5, inner_v_num).map(t => arc_outer.coord(t));
    const p_arch_inner = seq.range(0.5, 0, inner_v_num).map(t => arc_inner.coord(t));
    const verts = p_arch_outer.concat(p_arch_inner);
    return verts_to_one_face_geo(verts);
}

// x axis one face series

export function xof_arch_wall(outer_dx: number, outer_dy: number, inner_dx: number, inner_dy: number, inner_v_num: number): al.Geo {
    return arch_wall(vc.v3_zero, vc.v3(outer_dx, 0, 0), vc.v3(0, 0, outer_dy), inner_dx, inner_dy, inner_v_num);
}
export function xof_arch_bar(outer_dx: number, outer_dy: number, inner_dx: number, inner_dy: number, inner_v_num: number): al.Geo {
    return arch_bar(vc.v3_zero, vc.v3(outer_dx, 0, 0), vc.v3(0, 0, outer_dy), inner_dx, inner_dy, inner_v_num);
}

// x axis geo series

/**
 * x axis one face geometry をy軸方向に厚みをつける
 * @param xof 
 * @param y0 
 * @param y1 
 */
export function xg_extract(xof: al.Geo, y0: number, y1: number): al.Geo {
    const verts_0 = xof.verts.map(v => v.add([0, y0, 0]));
    const verts_1 = xof.verts.map(v => v.add([0, y1, 0]));
    return geo_array.prismArray([verts_0, verts_1]);
}


function to_square_verts(o: V3, dx: V3, dy: V3): V3[] {
    return [
        o.add(dx).add(dy),
        o.sub(dx).add(dy),
        o.sub(dx).sub(dy),
        o.add(dx).sub(dy),
    ];
}

/**
 * 
 * @param dx 
 * @param dy 
 * @param z_num 
 * @param z     (0 ... 1) => x縮小率, y縮小率, z位置
 */
export function square_ground(dx: number, dy: number, z_num: number, z: (i: number) => V3): al.Geo {
    const ground_verts = to_square_verts(vc.v3_zero, v3(dx, 0, 0), v3(0, dy, 0));
    const z_rates = seq.range(0, 1, z_num).map(t => z(t));
    const maps = al.compose(z_rates, [
        v => mx.scale_m4([v.x(), v.y(), 1]),
        v => mx.trans_m4([0, 0, v.z()]),
    ]);
    const polygons = al.duplicate_verts(ground_verts, maps);
    return geo_array.prismArray(polygons);
}
