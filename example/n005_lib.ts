import * as ut from "../algorithm/utility";
import * as seq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";
import * as mx from "../algorithm/matrix";
import * as cv from "../algorithm/curve";

import * as al from "../geometry/geo";
import * as geo_array from "../geometry/array";

type V3 = vc.V3;
const v3 = vc.v3;
const v3_zero = vc.v3_zero;

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

// x/z plane geometry

export function xzgeo_arch_wall(outer_dx: number, outer_dy: number, inner_dx: number, inner_dy: number, inner_v_num: number): al.Geo {
    return arch_wall(v3_zero, vc.v3(outer_dx, 0, 0), vc.v3(0, 0, outer_dy), inner_dx, inner_dy, inner_v_num);
}
export function xzgeo_arch_bar(outer_dx: number, outer_dy: number, inner_dx: number, inner_dy: number, inner_v_num: number): al.Geo {
    return arch_bar(v3_zero, vc.v3(outer_dx, 0, 0), vc.v3(0, 0, outer_dy), inner_dx, inner_dy, inner_v_num);
}

/**
 * x/z plane geometry をy軸方向に厚みをつける
 * @param xzgeo 
 * @param y0 
 * @param y1 
 */
export function xzgeo_extract(xzgeo: al.Geo, y0: number, y1: number): al.Geo {
    const verts_0 = xzgeo.verts.map(v => v.add([0, y0, 0]));
    const verts_1 = xzgeo.verts.map(v => v.add([0, y1, 0]));
    return geo_array.prismArray([verts_0, verts_1]);
}

export function to_xy_square(o: V3, dx: V3, dy: V3): V3[] {
    return [
        o.add(dx).add(dy),
        o.sub(dx).add(dy),
        o.sub(dx).sub(dy),
        o.add(dx).sub(dy),
    ];
}
export function to_xy_square_basis(dx: number, dy: number): V3[] {
    return to_xy_square(v3_zero, v3(dx, 0, 0), v3(0, dy, 0));
}
export function to_xy_hexagon(o: V3, d0: V3, d1: V3): V3[] {
    return [
        o.add(d0),
        o.add(d1),
        o.add(d1).sub(d0),
        o.sub(d0),
        o.sub(d1),
        o.sub(d1).add(d0),
    ];
}
export function to_xy_hexagon_basis(d: number, offset_deg: number): V3[] {
    const rad0 = ut.deg_to_rad(offset_deg);
    const rad1 = ut.deg_to_rad(offset_deg + 60);
    const d0 = v3(d * Math.cos(rad0), d * Math.sin(rad0), 0);
    const d1 = v3(d * Math.cos(rad1), d * Math.sin(rad1), 0);
    return to_xy_hexagon(v3_zero, d0, d1);
}
export function to_xy_hexagon_basis_deg30(d_inner: number): V3[] {
    const d_outer = d_inner * 2 / ut.r3;
    return to_xy_hexagon_basis(d_outer, 30);
}

// x/y plane & z depth geometry

/**
 * 
 * @param xy_verts 
 * @param z_num 
 * @param z     (0 ... 1) => x縮小率, y縮小率, z位置
 */
export function xygeo_scale_trans(xy_verts: V3[], z_num: number, z: (i: number) => V3): al.Geo {
    const z_rates = seq.range(0, 1, z_num).map(t => z(t));
    const maps = al.compose(z_rates, [
        v => mx.scale_m4([v.x(), v.y(), 1]),
        v => mx.trans_m4([0, 0, v.z()]),
    ]);
    const polygons = al.duplicate_verts(xy_verts, maps);
    return geo_array.prismArray(polygons);
}

export function xygeo_scale_rot_trans(xy_verts: V3[], z_num: number, z: (i: number) => V3): al.Geo {
    const z_rates = seq.range(0, 1, z_num).map(t => z(t));
    const maps = al.compose(z_rates, [
        v => mx.scale_m4([v.x(), v.x(), 1]),
        v => mx.rot_z_m4(v.y()),
        v => mx.trans_m4([0, 0, v.z()]),
    ]);
    const polygons = al.duplicate_verts(xy_verts, maps);
    return geo_array.prismArray(polygons);
}

export function duplicate_rot_z(xy_verts: V3[], count: number, deg: number): V3[] {
    const maps = al.compose(seq.arith(count), [
        i => mx.rot_z_m4(ut.deg_to_rad(i * deg)),
    ]);
    const new_verts = al.duplicate_verts(xy_verts, maps);
    return geo_array.flatten(new_verts);
}
export function duplicate_rot_z_90_4(xy_verts: V3[]): V3[] {
    return duplicate_rot_z(xy_verts, 4, 90);
}
export function duplicate_rot_z_120_3(xy_verts: V3[]): V3[] {
    return duplicate_rot_z(xy_verts, 3, 120);
}

