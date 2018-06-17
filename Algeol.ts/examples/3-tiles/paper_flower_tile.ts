import * as ut from '../../algorithm/utility';
import * as seq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';
import * as mx from '../../algorithm/matrix';

import * as mesh_rect from '../../geometry/mesh/rectangle';
import * as mesh_util from '../../geometry/utility';

import * as geo from '../../object/object';
import * as prim from '../../object/primitive'

import * as wf from '../../decoder/wavefront';
import * as sf from '../../decoder/savefile';


function build_paper_flower(num: number, width: number): geo.Object {
    const paper_flower = prim.circle(4);
    const tr_base = mx.compose([
        mx.affine3_scale([0.5 * width, 0.5, 1]),
        mx.affine3_translate([0, 0.5, 0]),
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

function build_small_flowers(): geo.Object {
    const paper_flower = build_paper_flower(4, 0.5);
    const verts = mesh_rect.verts(vc.v3(0, 0, 0), vc.v3(1, 0, 0), vc.v3(0.5, 0.5 * ut.r3, 0), 5, 5);
    const edges = mesh_rect.edges_triangle(5, 5);
    const lines = mesh_util.edges_to_lines(verts, edges);
    const ts = [0.25, 0.50, 0.75];
    return geo.obj_duplicate(
        paper_flower,
        lines.map(line => ts.map(i => mx.affine3_translate(line.coord(i)))).reduce((a, b) => a.concat(b)),
        null,
    );
}

wf.useBlenderCoordinateSystem();
wf.setFloatFixed(3);
sf.save_obj_mtl('obj/paper_flower_tile', build_small_flowers(), []);
