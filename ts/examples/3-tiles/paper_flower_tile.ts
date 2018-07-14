import * as ut from '../../algeol/algorithm/utility';
import * as seq from '../../algeol/algorithm/sequence';
import * as vc from '../../algeol/algorithm/vector';
import * as mx from '../../algeol/algorithm/matrix';
import * as cv from '../../algeol/algorithm/curve';

import * as mesh_rect from '../../algeol/geometry/mesh/rectangle';
import * as mesh_util from '../../algeol/geometry/utility';

import * as geo from '../../algeol/object/object';
import * as prim from '../../algeol/object/primitive'

import * as wf from '../../algeol/decoder/wavefront';

import * as sf from '../savefile';


function build_paper_flower(num: number, width: number): geo.Object {
    const paper_flower = geo.obj_single_vf(prim.regular_polygon(4), null, null);
    const tr_base = mx.compose([
        mx.m4_scale3([0.5, 0.5 * width, 1]),
        mx.m4_translate3([0.5, 0, 0]),
    ]);
    const tr = (i: number) => mx.compose([
        tr_base,
        mx.m4_rotate3_z(ut.deg360 * i / num),
    ]);
    return geo.obj_duplicate(
        paper_flower,
        seq.arithmetic(num).map(i => tr(i)),
        null,
    );
}

function build_small_flowers(lines: cv.Curve3[]): geo.Object {
    const paper_flower = build_paper_flower(4, 0.5);
    const scaling = mx.m4_scale3([1/16, 1/16, 1]);
    const tr = (ray: cv.Ray3) => mx.compose([
        scaling,
        mx.m4_rotate_from_10_to_v([ray.d.x, ray.d.y]),
        mx.m4_translate3(ray.c),
    ]);
    const ts = [0.25, 0.50, 0.75];
    return geo.obj_duplicate(
        paper_flower,
        lines.map(line => ts.map(i => tr(line.ray(i)))).reduce((a, b) => a.concat(b)),
        null,
    );
}
function build_large_flowers(verts: vc.V3[]): geo.Object {
    const paper_flower = build_paper_flower(6, 0.5 / ut.r3);
    const scaling = mx.m4_scale3([1/8, 1/8, 1]);
    const tr = (v: vc.V3) => mx.compose([
        scaling,
        mx.m4_translate3(v),
    ]);
    return geo.obj_duplicate(
        paper_flower,
        verts.map(v => tr(v)),
        null,
    );
}
function build_flower_tile(): geo.Object {
    const size = 10;
    const dx = vc.v3(1, 0, 0);
    const dy = vc.v3(0.5, 0.5 * ut.r3, 0);
    const o = dx.add(dy).scalar(size * -0.5);
    const verts = mesh_rect.verts(o, dx, dy, size, size, null);
    const edges = mesh_rect.edges_triangle(size, size);
    const lines = mesh_util.edges_to_lines(verts, edges);
    
    const small_flowers = build_small_flowers(lines);
    const large_flowers = build_large_flowers(verts);

    return geo.obj_group([
        small_flowers,
        large_flowers,
    ], null, null);
}


wf.useBlenderCoordinateSystem();
wf.setFloatFixed(3);
sf.save_obj_mtl('obj/paper_flower_tile', build_flower_tile(), []);
