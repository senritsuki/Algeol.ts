import * as ut from '../../algeol/common';
import * as seq from '../../algeol/algorithm/sequence';
import * as mx from '../../algeol/datatype/matrix';
import * as cc from '../../algeol/algorithm/color_converter';
import * as geo from '../../algeol/datatype/object';
import * as prim from '../../algeol/object/primitive'
import * as wf from '../../algeol/decoder/wavefront';
import * as sf from '../savefile';

const faceinfo = (name: string) => geo.faceInfo(name, name);
const colorkey = (lch: [number, number, number]) => `lch_${lch[0]}_${lch[1]}_${lch[2]}`;

const hue_num = 12;
const seq_lightness = seq.arithmetic(11, 0, 10);
const seq_chroma = seq.arithmetic(11, 1, 10);
const seq_hue = seq.arithmetic(hue_num, 0, 360 / hue_num);

function build_chroma0(): geo.Object {
    const prism_vf = prim.regular_prism(12);
    const prism = geo.objSingle(prism_vf, null, null);
    const tr_base = mx.mulAllRev([
        mx.m4_scale3([0.125, 0.125, 0.875]),
    ]);
    const tr = (lightness: number) => mx.mulAllRev([
        tr_base,
        mx.m4_translate3([0, 0, lightness / 10]),
    ]);
    const obj = geo.objGrouped(
        seq_lightness
            .map(lightness => geo.objGrouped([prism], colorkey([lightness, 0, 0]), tr(lightness))),
        null, null,
    );
    return obj;
}

function build_hue(hue: number): geo.Object {
    const square_vf = prim.regular_polygon_c(4);
    const square = geo.objSingle(square_vf, null, null);
    const tr_base = mx.mulAllRev([
        mx.m4_translate3([-1, 2, 0]),
        mx.m4_rotate3_y(ut.deg90),
        mx.m4_scale3([1, 0.4375, 0.4375]),
    ]);
    const tr = (lch: [number, number, number]) => mx.mulAllRev([
        tr_base,
        mx.m4_translate3([0, lch[1] / 10, lch[0] / 10]),
        mx.m4_rotate3_z(ut.degToRad(-lch[2])),
    ]);
    const obj = geo.objGrouped(
        seq.to_3d(seq_lightness, seq_chroma, [hue])
            .filter(lch => !cc.overflow01(cc.lch_to_rgb01(lch)))
            .map(lch => geo.objGrouped([square], colorkey(lch), tr(lch))),
        null, null,
    );
    return obj;
}

function build_obj(): geo.Object {
    const obj = geo.objGrouped(
        [build_chroma0()].concat(seq_hue.map(hue => build_hue(hue))),
        null, null,
    );
    return obj;
}

function build_mats(): geo.Material[] {
    const mats1 = seq.to_3d(seq_lightness, [0], [0])
        .filter(lch => !cc.overflow01(cc.lch_to_rgb01(lch)))
        .map(lch => geo.material(colorkey(lch), cc.lch_to_rgb01(lch)));
    const mats2 = seq.to_3d(seq_lightness, seq_chroma, seq_hue)
        .filter(lch => !cc.overflow01(cc.lch_to_rgb01(lch)))
        .map(lch => geo.material(colorkey(lch), cc.lch_to_rgb01(lch)));
    return mats1.concat(mats2);
}

wf.useBlenderCoordinateSystem();
wf.setFloatFixed(3);
sf.save_obj_mtl('obj/lch_3d', build_obj(), build_mats());

/*
レンダリングメモ
    カメラ
        透視投影
            焦点距離: 100mm
            センサー幅: 36mm
        平行投影
            スケール: 20
        回転
            x: 52.5
            y: 0
            z: 15
        位置
            x: 0 + 50 * (sin(15) = 0.2588) = 12.94
            y: 0 + 50 * (cos(15) = 0.9659) = 48.3
            z: 6 + 50 * (tan(37.5) = 0.7673) = 44.37
*/