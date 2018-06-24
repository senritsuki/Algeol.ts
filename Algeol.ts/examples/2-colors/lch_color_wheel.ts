import * as ut from '../../algorithm/utility';
import * as seq from '../../algorithm/sequence';
import * as mx from '../../algorithm/matrix';
import * as cc from '../../algorithm/color_converter';

import * as geo from '../../object/object';
import * as prim from '../../object/primitive'
import * as sf from '../../decoder/savefile';

const faceinfo = (name: string) => geo.faceinfo(name, name);
const colorkey = (hue: number) => `lch_70_40_${hue}`;

function build_obj(count: number): geo.Object {
    const rad = ut.deg180 / count;
    const r = 1 / Math.cos(rad);
    const t = r * Math.sin(rad);
    const base = prim.regular_bipyramid(4);
    const tr_base = mx.compose([
        mx.affine3_scale([t, t, t]),
        mx.affine3_translate([0, 1, 0]),
    ]);
    const tr = (hue: number) => mx.compose([
        tr_base,
        mx.affine3_rotate_z(ut.deg_to_rad(hue)),
    ]);
    const obj = geo.obj_group(
        seq.arithmetic(count, 0, 360 / count)
            .map(hue => geo.obj_group([base], tr(hue), faceinfo(colorkey(hue)))),
        null, null,
    );
    return obj;
}

function build_mats(count: number): geo.Material[] {
    const mats = seq.arithmetic(count, 0, 360 / count)
        .map(hue => geo.material(colorkey(hue), cc.lch_to_rgb01([70, 40, hue])));
    return mats;
}

const count = 24;
sf.save_obj_mtl('obj/lch_color_wheel', build_obj(count), build_mats(count));
