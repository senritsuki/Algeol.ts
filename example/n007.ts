import * as ut from "../algorithm/utility";
import * as seq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";
import * as mx from "../algorithm/matrix";
import * as cv from "../algorithm/curve";

import * as al from '../geometry/geo';
import * as lib from './n005_lib';

import * as wf from '../decoder/wavefront';
import * as saver from './n003_save';

const v3 = vc.v3;

lib.config_bottom_z(-500);

export function save(objs: al.Obj[]) {
    saver.save_objmtl(wf.objs_to_strings('./_obj/n007', objs));
}

export function at<T>(tt: T[], i: number): T {
    return tt[i % tt.length];
}

export function fz_circle(n: number, height: number): (i: number) => number {
    const height_step = height * 2 / n;
    return i => Math.abs(n / 2 - i) * height_step;
}

export function route_arc_o(c1: lib.Connector, c2: lib.Connector): lib.Route {
    const p1 = c1.ray.c;
    const p2 = c2.ray.c;
    const o = v3(0, 0, (p1.z() + p2.z()) / 2)
    return new lib.Route(c1, c2, cv.bezier3_interpolate_arc(p1, p2, o));
}

type FloorRouteDuplicator = (floor: lib.RegularFloor) => [lib.RegularFloor[], lib.Route[]];

export function dupl_circle(n: number, r: number, fz: (i: number) => number, con1: number, con2: number): FloorRouteDuplicator {
    return floor => {
        const floors = al.duplicate_f(floor, al.compose_v4map(seq.arith(n), [
            i => mx.trans_m4(v3(0, r, fz(i))),
            i => mx.rot_z_m4(ut.deg360 / n * -i),
        ]));
        const routes = floors.map((_, i) => lib.route_arc(
            at(floors, i+1).con(con2),
            at(floors, i).con(con1),
        ));
        return [floors, routes];
    };
}
export const dupl_circle_square = (n: number, r: number, fz: (i: number) => number) => dupl_circle(n, r, fz, 0, 2);
export const dupl_circle_hexa = (n: number, r: number, fz: (i: number) => number) => dupl_circle(n, r, fz, 0, 3);

export function dupl_arc(n: number, r: number, deg1: number, deg2: number, fz: (i: number) => number, con1: number, con2: number): FloorRouteDuplicator {
    const rad_1 = ut.deg_to_rad(deg1);
    const rad_d = ut.deg_to_rad((deg2 - deg1) / (n - 1));
    return floor => {
        const floors = al.duplicate_f(floor, al.compose_v4map(seq.arith(n), [
            i => mx.trans_m4(v3(0, r, fz(i))),
            i => mx.rot_z_m4(rad_1 + rad_d * i),
        ]));
        const routes = floors.map((_, i) => lib.route_arc(
            at(floors, i).con(con1),
            at(floors, i+1).con(con2),
        ));
        return [floors, routes];
    };
}
export const dupl_arc_square = (n: number, r: number, deg1: number, deg2: number, fz: (i: number) => number) => dupl_arc(n, r, deg1, deg2, fz, 2, 0);
export const dupl_arc_hexa = (n: number, r: number, deg1: number, deg2: number, fz: (i: number) => number) => dupl_arc(n, r, deg1, deg2, fz, 3, 0);

export function dupl_lines(n: number, r: number, fz: (i: number) => number, con1: number, con2: number): FloorRouteDuplicator {
    return floor => {
        const floors = al.duplicate_f(floor, al.compose_v4map(seq.arith(n), [
            _ => mx.rot_z_m4(ut.deg180 / floor.n),
            i => mx.trans_m4(v3(0, r, fz(i))),
            i => mx.rot_z_m4(ut.deg360 / n * -i),
        ]));
        const routes = floors.map((_, i) => lib.route_curve(
            at(floors, i+1).con(con2),
            at(floors, i).con(con1),
            null,
        ));
        return [floors, routes];
    };
}
export const dupl_lines_square = (n: number, r: number, fz: (i: number) => number) => dupl_lines(n, r, fz, 3, 2);
export const dupl_lines_hexa = (n: number, r: number, fz: (i: number) => number) => dupl_lines(n, r, fz, 5, 3);


export function floor_simple(): (floor: lib.RegularFloor) => al.Geo {
    return floor => lib.geo_rfloor_simple(floor);
}
export function route_arc(n: number, d: number): (route: lib.Route) => al.Geo {
    return route => lib.geo_route_stairs(route, n, d);
}

export function geo_floors_routes(
    floor: lib.RegularFloor, 
    dupl: FloorRouteDuplicator,
    geo_floor: (floor: lib.RegularFloor) => al.Geo,
    geo_route: (route: lib.Route) => al.Geo,
): [al.Geo[], al.Geo[]] {
    const floor_route = dupl(floor);
    const geo_floors = floor_route[0].map(floor => geo_floor(floor));
    const geo_routes = floor_route[1].map(route => geo_route(route));
    return [geo_floors, geo_routes];
}

export function main() {
    const square = lib.floor_square(v3(0, 0, 1), 1);
    const hexa = lib.floor_hexa(v3(0, 0, 1), 1);

    const stair_d = 1 / 8;
    const fr_circle12 = geo_floors_routes(hexa, dupl_circle_hexa(12, 10, fz_circle(12, 12)), floor_simple(), route_arc(12, stair_d));
    const fr_circle4 = geo_floors_routes(square, dupl_lines_square(4, 5, fz_circle(4, 12)), floor_simple(), route_arc(12, stair_d));

    const m_floor = lib.lch(20, 0, 1);
    const m_route = lib.lch(20, 0, 11);

    save([
        al.geos_to_obj(fr_circle12[0], m_floor),
        al.geos_to_obj(fr_circle12[1], m_route),
        al.geos_to_obj(fr_circle4[0], m_floor),
        al.geos_to_obj(fr_circle4[1], m_route),
    ]);
}

main();
