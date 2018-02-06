import * as ut from "../algorithm/utility";
import * as seq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";
import * as mx from "../algorithm/matrix";
import * as cv from "../algorithm/curve";
import * as cc from "../algorithm/color_converter";

import * as al from "../geometry/surface_core";
import * as prim from '../geometry/primitive_surface';
import * as prima from "../geometry/surface_lib";

type V2 = vc.V2;
type V3 = vc.V3;
type V4 = vc.V4;
const v3 = vc.v3;
const v3_zero = vc.v3_zero;

function verts_to_one_face_geo(verts: V3[]): al.Surfaces {
    const faces = verts.map((_, i) => i);
    return new al.Surfaces(verts, [faces]);
}

export function arch_wall(o: V3, outer_dx: V3, outer_dy: V3, inner_dx: number, inner_dy: number, inner_v_num: number): al.Surfaces {
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
export function arch_bar(o: V3, outer_dx: V3, outer_dy: V3, inner_dx: number, inner_dy: number, inner_v_num: number): al.Surfaces {
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

export function xzgeo_arch_wall(outer_dx: number, outer_dy: number, inner_dx: number, inner_dy: number, inner_v_num: number): al.Surfaces {
    return arch_wall(v3_zero, vc.v3(outer_dx, 0, 0), vc.v3(0, 0, outer_dy), inner_dx, inner_dy, inner_v_num);
}
export function xzgeo_arch_bar(outer_dx: number, outer_dy: number, inner_dx: number, inner_dy: number, inner_v_num: number): al.Surfaces {
    return arch_bar(v3_zero, vc.v3(outer_dx, 0, 0), vc.v3(0, 0, outer_dy), inner_dx, inner_dy, inner_v_num);
}

/**
 * x/z plane geometry をy軸方向に厚みをつける
 * @param xzgeo 
 * @param y0 
 * @param y1 
 */
export function xzgeo_extrude(xzgeo: al.Surfaces, y0: number, y1: number): al.Surfaces {
    const verts_0 = xzgeo.verts.map(v => v.add([0, y0, 0]));
    const verts_1 = xzgeo.verts.map(v => v.add([0, y1, 0]));
    return prima.prismArray([verts_0, verts_1]);
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
export function xygeo_scale_trans(xy_verts: V3[], z_num: number, z: (t: number) => V3): al.Surfaces {
    const z_rates = seq.range(0, 1, z_num).map(t => z(t));
    const maps = al.compose_v4map(z_rates, [
        v => mx.scale_m4([v.x, v.y, 1]),
        v => mx.affine3_trans([0, 0, v.z]),
    ]);
    const polygons = al.duplicate_v3(xy_verts, 1, maps);
    return prima.prismArray(polygons);
}

export function xygeo_scale_rot_trans(xy_verts: V3[], z_num: number, z: (t: number) => V3): al.Surfaces {
    const z_rates = seq.range(0, 1, z_num).map(t => z(t));
    const maps = al.compose_v4map(z_rates, [
        v => mx.scale_m4([v.x, v.x, 1]),
        v => mx.affine3_rot_z(v.y),
        v => mx.affine3_trans([0, 0, v.z]),
    ]);
    const polygons = al.duplicate_v3(xy_verts, 1, maps);
    return prima.prismArray(polygons);
}

export function xygeo_z_scale_rot(xy_verts: V3[], zsr_list: V3[]): al.Surfaces {
    const maps = al.compose_v4map(zsr_list, [
        zsr => mx.affine3_trans([0, 0, zsr.x]),
        zsr => mx.scale_m4([zsr.y, zsr.y, 1]),
        zsr => mx.affine3_rot_z(zsr.z),
    ]);
    const polygons = al.duplicate_v3(xy_verts, 1, maps);
    return prima.prismArray(polygons);
}


export function duplicate_rot_z(xy_verts: V3[], count: number, deg: number): V3[] {
    const maps = al.compose_v4map(seq.arith(count), [
        i => mx.affine3_rot_z(ut.deg_to_rad(i * deg)),
    ]);
    const new_verts = al.duplicate_v3(xy_verts, 1, maps);
    return prima.flatten(new_verts); 
}
export function duplicate_rot_z_90_4(xy_verts: V3[]): V3[] {
    return duplicate_rot_z(xy_verts, 4, 90);
}
export function duplicate_rot_z_120_3(xy_verts: V3[]): V3[] {
    return duplicate_rot_z(xy_verts, 3, 120);
}



export function v3_rot_z(v: V3, deg: number): V3 {
    return mx.m3_rot_z(ut.deg_to_rad(deg)).map(v);
}
export function ray3_rot_z_scale(cd: cv.Ray3, deg: number, len: number): cv.Ray3 {
    const d = v3_rot_z(cd.d, deg).scalar(len);
    return cv.ray(cd.c, d);
}


export class Connector implements al.IMap<Connector> {
    constructor(
        public ray: cv.Ray3,
        public width: number,
    ) {}

    clone(): Connector {
        return new Connector(this.ray, this.width);
    }
    map(f: (v: V4) => V4): Connector {
        const ray = cv.map_ray3(this.ray, f);
        return new Connector(ray, this.width);
    }

    /** コネクタ左端 */
    cl(): V3 {
        return ray3_rot_z_scale(this.ray, 90, this.width / 2).c;
    }
    /** コネクタ右端 */
    cr(): V3 {
        return ray3_rot_z_scale(this.ray, -90, this.width / 2).c;
    }

    toString(): string {
        return `{ ray: ${this.ray.toString()}, width: ${this.width} }`;
    }
}

export function build_connector(o: V3, r: number, deg: number, width: number): Connector {
    const d = vc.polar_to_v3(r, ut.deg_to_rad(deg), 0);
    const c = o.add(d);
    const cd = cv.ray(c, d);
    return new Connector(cd, width);
}

export abstract class FloorBase<T extends FloorBase<T>> implements al.IMap<T> {
    constructor(
        public o: V3,
        public connectors: Connector[],
    ) {}

    abstract clone(): T;

    con(i: number): Connector {
        return this.connectors[i % this.connectors.length];
    }
    clone_update(o: V3, connectors: Connector[]): T {
        const t = this.clone();
        t.o = o;
        t.connectors = connectors;
        return t;
    }
    map(f: (v: V4) => V4): T {
        const o = vc.v4map_v3(this.o, 1, f);
        const connectors = this.connectors.map(c => c.map(f));
        return this.clone_update(o, connectors);
    }
}

export class RegularFloor extends FloorBase<RegularFloor> {
    constructor(
        o: V3,
        connectors: Connector[],
        /** 頂点数 */
        public n: number,
        /** 内接円半径, 頂点の開始角度（0ならx軸正, 90ならy軸正） */
        public base: V3 = vc.v3_unit_x,
    ) {
        super(o, connectors);
    }

    clone(): RegularFloor {
        return new RegularFloor(this.o, this.connectors, this.n, this.base);
    }
    ir(): number {
        return this.base.length();
    }
    map(f: (v: V4) => V4): RegularFloor {
        const new_floor = super.map(f);
        new_floor.base = vc.v4map_v3(this.base, 0, f);
        return new_floor;
    }
    verts(): V3[] {
        const rad_offset = Math.atan2(this.base.y, this.base.x);
        const cr = this.ir() / Math.cos(ut.deg180 / this.n);
        const rad_start = rad_offset + ut.deg180  / this.n;
        const verts = seq.arith(this.n, rad_start, ut.pi2 / this.n).map(rad => vc.polar_to_v3(cr, rad, 0));
        return verts.map(v => v.add(this.o));
    }
}

export function floor_regular(
    o: V3,
    /** 頂点数 */
    n: number,
    /** 内接円半径 */
    ir: number,
    /** コネクタの幅（辺の幅と同じなら1.0, 半分なら0.5） */
    width_rate: number = 1.0,
    /** 頂点の開始角度（0ならx軸正, 90ならy軸正） */
    deg_offset: number = 0,
): RegularFloor {
    const width = ir * ut.tan_deg(180 / n) * width_rate;
    const deg = (i: number) => i * 360 / n + deg_offset;
    const connectors = seq.arith(n).map(i => build_connector(o, ir, deg(i), width));
    const deg_base = vc.polar_to_v3(ir, ut.deg_to_rad(deg_offset), 0);
    return new RegularFloor(o, connectors, n, deg_base);
}

export function floor_square(o: V3, ir: number, width_rate: number = 1.0, deg_offset: number = 0): RegularFloor {
    return floor_regular(o, 4, ir, width_rate, deg_offset);
}
export function floor_hexa(o: V3, ir: number, width_rate: number = 1.0, deg_offset: number = 0): RegularFloor {
    return floor_regular(o, 6, ir, width_rate, deg_offset);
}


export function calc_cross_point(cd1: cv.Ray2, cd2: cv.Ray2): V2|null {
    // 位置ベクトルと方向ベクトル取り出し
    const c11 = cd1.c;
    const c21 = cd2.c;
    const c22 = cd2.c.add(cd2.d);
    const d11_12 = cd1.d;
    const d11_21 = c21.sub(c11);
    const d11_22 = c22.sub(c11);
    const d21_22 = cd2.d;

    // cd2の始点と終点の、cd1との距離を求める
    const cross_1 = d11_12.cp(d11_21);
    const cross_2 = d11_12.cp(d11_22);

    // 距離がゼロとなる係数を求める（ゼロとならない＝平行ならnull）
    const cross_d = cross_2 - cross_1;
    if (cross_d == 0) return null;
    const t = cross_1 / cross_d;

    // 距離がゼロとなる位置を求める
    const c = c21.sub(d21_22.scalar(t));
    return c;
}

export function calc_cross_point_v3(cd1: cv.Ray3, cd2: cv.Ray3): V2|null {
    const cd1_ = cv.ray3_to_ray2(cd1);
    const cd2_ = cv.ray3_to_ray2(cd2);
    return calc_cross_point(cd1_, cd2_);
}

export function build_curve_simple(c1: Connector, c2: Connector, mid_distance: number|null): cv.Curve3 {
    const d = c2.ray.c.sub(c1.ray.c);
    if (mid_distance == null) mid_distance = d.length() / 3;
    const mid1 = c1.ray.p(mid_distance);
    const mid2 = c2.ray.p(mid_distance);
    const controls = [c1.ray.c, mid1, mid2, c2.ray.c];
    return cv.bezier(controls);
}

export function build_curve_arc(c1: Connector, c2: Connector): cv.Curve3 {
    const oz = (c1.ray.c.z + c2.ray.c.z) / 2;
    const ray1 = ray3_rot_z_scale(c1.ray, 90, 1);
    const ray2 = ray3_rot_z_scale(c2.ray, 90, 1);
    const oxy = calc_cross_point_v3(ray1, ray2);
    if (oxy == null) {
        return build_curve_simple(c1, c2, null);
    }
    const o = v3(oxy.x, oxy.y, oz);
    return cv.bezier3_interpolate_arc(c1.ray.c, c2.ray.c, o);
}

export class Route {
    constructor(
        public c1: Connector,
        public c2: Connector,
        public curve: cv.Curve3,
    ) {}

    /** tに対応する左, 中央, 右, 方向 */
    lcrd(t: number): V3[] {
        const len1 = this.c1.width / 2;
        const len2 = this.c2.width / 2;
        const len = (1 - t) * len1 + t * len2;
        const ray = this.curve.ray(t);
        let l = cv.rot_ray3d_z(ray, ut.deg90);
        let r = cv.rot_ray3d_z(ray, -ut.deg90);
        l.d._v[2] = 0;
        r.d._v[2] = 0;
        l = l.unit();
        r = r.unit();
        return [l.p(len), ray.c,  r.p(len), ray.d];
    }
}

export function route_curve(c1: Connector, c2: Connector, mid: number|null): Route {
    return new Route(c1, c2, build_curve_simple(c1, c2, mid));
}
export function route_arc(c1: Connector, c2: Connector): Route {
    return new Route(c1, c2, build_curve_arc(c1, c2));
}

export function lch(l: number, c: number, h: number): al.Material {
    const name = `lch${ut.format_02d(l)}${ut.format_02d(c)}${ut.format_02d(h)}`;
    const lch = cc.clamp01(cc.lch_to_rgb01([l*5, c*5, h*15]));
    return new al.Material(name, lch);
}


let BottomZ = -100;

export function config_bottom_z(n: number) {
    BottomZ = n;
}

export function geo_rfloor_simple(floor: RegularFloor): al.Surfaces {
    const o = v3(floor.o.x, floor.o.y, 0);
    const verts = floor.verts().map(v => v.sub(o));
    const geo = xygeo_z_scale_rot(verts, [
        v3(0, 1, 0),
        v3(-1/8, 1, 0),
        v3(-1, 1/8, 0),
        v3(BottomZ, 1/8, 0),
    ]);
    return al.translate(geo, o);
}

export function geo_route_planes(route: Route, n: number): al.Surfaces {
    const lcrd = seq.range(0, 1, n + 1).map(t => route.lcrd(t));
    const bases = seq.arith(n).map(i => {
        const d1 = lcrd[i];
        const d2 = lcrd[i+1];
        const z = d1[1].z;
        const base = [d1[0], d1[2], d2[2], d2[0]];
        return prim.plane_xy(base, z);
    });
    return al.concat_surfaces(bases);
}
export function geo_route_stairs(route: Route, n: number, d: number): al.Surfaces {
    const lcrd = seq.range(0, 1, n + 1).map(t => route.lcrd(t));
    const bases = seq.arith(n).map(i => {
        const d1 = lcrd[i];
        const d2 = lcrd[i+1];
        const z = (d1[1].z + d2[1].z) / 2;
        const base = [d1[0], d1[2], d2[2], d2[0]].map(v => v3(v.x, v.y, z));
        return prima.extrude3(base, v3(0, 0, -d), v3(0, 0, 0));
    });
    return al.concat_surfaces(bases);
}
