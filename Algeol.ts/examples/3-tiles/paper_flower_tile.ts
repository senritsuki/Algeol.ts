import * as ut from "../../algorithm/utility";
import * as seq from "../../algorithm/sequence";
import * as mx from "../../algorithm/matrix";

import * as geo from "../../geometry/core";
import * as prim from "../../geometry/core_primitive"
import * as wf from "../../decoder/wavefront";
import * as sf from "../../decoder/savefile";


function build_paper_flower(): geo.Object {
    const paper_flower = prim.circle(4);
    const tr_base = mx.compose([
        mx.affine3_scale([0.25, 0.5, 1]),
        mx.affine3_translate([0, 0.5, 0]),
    ]);
    const tr = (i: number) => mx.compose([
        tr_base,
        mx.affine3_rotate_z(ut.deg60 * i),
    ]);
    return geo.obj_duplicate(
        paper_flower,
        seq.arithmetic(6).map(i => tr(i)),
        null,
    );
}

wf.useBlenderCoordinateSystem();
wf.setFloatFixed(3);
sf.save_obj_mtl('obj/paper_flower_tile', build_paper_flower(), []);

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
