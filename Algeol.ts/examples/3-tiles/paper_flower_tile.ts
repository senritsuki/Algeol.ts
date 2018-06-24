import * as ut from '../../algorithm/utility';
import * as seq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';
import * as mx from '../../algorithm/matrix';
import * as cv from '../../algorithm/curve';

import * as mesh_rect from '../../geometry/mesh/rectangle';
import * as mesh_util from '../../geometry/utility';

import * as geo from '../../object/object';
import * as prim from '../../object/primitive'

import * as wf from '../../decoder/wavefront';
import * as sf from '../../decoder/savefile';


function build_paper_flower(num: number, width: number): geo.Object {
    const paper_flower = prim.regular_polygon(4);
    const tr_base = mx.compose([
        mx.affine3_scale([0.5, 0.5 * width, 1]),
        mx.affine3_translate([0.5, 0, 0]),
    ]);
    const tr = (i: number) => mx.compose([
        tr_base,
        mx.affine3_rotate_z(ut.deg360 * i / num),
    ]);
    return geo.obj_duplicate(
        paper_flower,
        seq.arithmetic(num).map(i => tr(i)),
        null,
    );
}

function build_small_flowers(lines: cv.Curve3[]): geo.Object {
    const paper_flower = build_paper_flower(4, 0.5);
    const scaling = mx.affine3_scale([1/16, 1/16, 1]);
    const tr = (ray: cv.Ray3) => mx.compose([
        scaling,
        mx.affine3_rotate_z_10_to_xy([ray.d.x, ray.d.y]),
        mx.affine3_translate(ray.c),
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
    const scaling = mx.affine3_scale([1/8, 1/8, 1]);
    const tr = (v: vc.V3) => mx.compose([
        scaling,
        mx.affine3_translate(v),
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
    const verts = mesh_rect.verts(o, dx, dy, size, size);
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
