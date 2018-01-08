import * as ut from "../algorithm/utility";
import * as seq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";
import * as mx from "../algorithm/matrix";

import * as al from '../geometry/geo';
import * as prim2 from '../geometry/primitive2';
import * as lib from './n005_lib';

import * as wf from '../decoder/wavefront';
import * as saver from './n003_save';

const v3 = vc.v3;


export function save(objs: al.Obj[]) {
    saver.save_objmtl(wf.objs_to_strings('./_obj/n006', objs));
}

export function main() {
    const square = lib.floor_square(v3(0, 0, 3), 1);

    const duplicate_square = al.compose_v4map(seq.arith(4), [
        _ => mx.trans_m4(v3(5, 0, 0)),
        i => mx.rot_z_m4(ut.deg90 * i),
    ])
    const squares = al.duplicate_f(square, duplicate_square);
    const geos_square = squares.map(rf => lib.geo_rfloor_simple(rf));
    
    const routes = squares.map((_, i) => lib.route_curve(
        squares[i].connectors[0], 
        squares[(i+1)%squares.length].connectors[3],
        5));

    const geos_route = routes.map(route => lib.geo_route_planes(route, 24));

    const geo_plane = prim2.plane(prim2.circle_i(24, 10), prim2.to_v3_xy(0));
    
    save([
        al.geos_to_obj(geos_square, lib.lch(18, 0, 0)),
        al.geos_to_obj(geos_route, lib.lch(17, 0, 0)),
        al.geo_to_obj(geo_plane, lib.lch(17, 5, 17)),
    ]);
}

export function test_build_curve1() {
    const square1 = lib.floor_square(v3(0, 0, 0), 1);
    const square2 = lib.floor_square(v3(5, 3, 0), 1);
    const route1 = lib.route_arc(square1.con(0), square2.con(3));
    const route2 = lib.route_curve(square1.con(1), square2.con(1), null);
    save([
        al.geo_to_obj(lib.geo_route_planes(route1, 24), null),
        al.geo_to_obj(lib.geo_route_planes(route2, 24), null),
    ]);
    // ok
}
export function test_build_curve2() {
    const square1 = lib.floor_square(v3(0, 5, 3), 1);
    const square2 = lib.floor_square(v3(-5, 0, 3), 1);

    const route = lib.route_curve(
        square1.connectors[2], 
        square2.connectors[1],
        null);

    save([
        al.geo_to_obj(lib.geo_route_planes(route, 24), null),
    ]);
    // ok
}
export function test_build_curve3() {
    const square = lib.floor_square(v3(0, 0, 3), 1);
    console.log(square.connectors[0].toString());
    console.log(square.connectors[3].toString());
    const duplicate_square = al.compose_v4map(seq.arith(2), [
        _ => mx.trans_m4(v3(5, 0, 0)),
        i => mx.rot_z_m4(ut.deg90 * i),
    ]);
    const squares = al.duplicate_f(square, duplicate_square);
    
    const route = lib.route_curve(
        squares[0].connectors[0], 
        squares[1].connectors[3],
        null);
    console.log(route.curve.toString());
    console.log(route.c1.toString());
    console.log(route.c2.toString());

    save([
        al.geos_to_obj(squares.map(rf => lib.geo_rfloor_simple(rf)), lib.lch(18, 0, 0)),
        al.geo_to_obj(lib.geo_route_planes(route, 24), lib.lch(17, 0, 0)),
    ]);
}

main();
//test_build_curve1();
//test_build_curve2();
//test_build_curve3();

