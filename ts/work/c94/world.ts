import * as ut from '../../algeol/algorithm/utility';
import * as mx from '../../algeol/algorithm/matrix';
import * as obj from '../../algeol/object/object';
import * as Prim from '../../algeol/object/primitive'
import * as wf from '../../algeol/decoder/wavefront';
import * as sf from '../../examples/savefile';

const vf_cube = Prim.cube(0.5);

export function base_border_square(len: number, dir: number): obj.Object {
    const depth = 2;
    return obj.obj_single_vf(vf_cube, 'base', mx.compose([
        mx.m4_translate3([0.5, 0, -0.5]),
        mx.m4_scale3([len, 1, depth]),
        mx.m4_translate3([-0.5, 0, 0]),
        mx.m4_rotate3_z(ut.deg90 * dir),
    ]));
}
export function base_border(len: number, wid: number, rad: number): obj.Object {
    const depth = 2;
    return obj.obj_single_vf(vf_cube, 'base', mx.compose([
        mx.m4_translate3([0.5, 0.5, -0.5]),
        mx.m4_scale3([len, wid, depth]),
        mx.m4_rotate3_z(rad),
    ]));
}

wf.useBlenderCoordinateSystem();
wf.setFloatFixed(3);
sf.save_obj('world', build_obj());
