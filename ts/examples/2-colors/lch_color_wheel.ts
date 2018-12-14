import * as ut from '../../algeol/common';
import * as seq from '../../algeol/algorithm/sequence';
import * as mx from '../../algeol/datatype/matrix';
import * as cc from '../../algeol/algorithm/color_converter';
import * as geo from '../../algeol/object/object';
import * as prim from '../../algeol/object/primitive'
import * as sf from '../savefile';

<<<<<<< HEAD
const faceinfo = (name: string) => geo.faceInfo(name, name);
=======
const faceinfo = (name: string) => geo.faceinfo(name, name);
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
const colorkey = (hue: number) => `lch_70_40_${hue}`;

function build_obj(count: number): geo.Object {
    const rad = ut.deg180 / count;
    const r = 1 / Math.cos(rad);
    const t = r * Math.sin(rad);
<<<<<<< HEAD
    const base = geo.objSingle(prim.regular_bipyramid(4, 1, 1), null, null);
    const tr_base = mx.mulAllRev([
        mx.m4_scale3([t, t, t]),
        mx.m4_translate3([0, 1, 0]),
    ]);
    const tr = (hue: number) => mx.mulAllRev([
        tr_base,
        mx.m4_rotate3_z(ut.degToRad(hue)),
    ]);
    const obj = geo.objGrouped(
        seq.arithmetic(count, 0, 360 / count)
            .map(hue => geo.objGrouped([base], tr(hue), faceinfo(colorkey(hue)))),
=======
    const base = geo.obj_single_vf(prim.regular_bipyramid(4, 1, 1), null, null);
    const tr_base = mx.compose([
        mx.m4_scale3([t, t, t]),
        mx.m4_translate3([0, 1, 0]),
    ]);
    const tr = (hue: number) => mx.compose([
        tr_base,
        mx.m4_rotate3_z(ut.degToRad(hue)),
    ]);
    const obj = geo.obj_group(
        seq.arithmetic(count, 0, 360 / count)
            .map(hue => geo.obj_group([base], tr(hue), faceinfo(colorkey(hue)))),
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
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
