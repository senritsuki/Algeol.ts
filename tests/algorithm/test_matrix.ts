﻿import * as t from "../test_common";
import * as vc from "../../algorithm/vector";
import * as mx from "../../algorithm/matrix";

export function test(): t.OkNg {
    const m2 = mx.rows_to_m2([[1,2], [3,4]]);
    const m3 = mx.rows_to_m3([[1,2,3], [4,5,6], [7,8,9]]);
    const m4 = mx.rows_to_m4([[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]);

    return t.printModule('algeol/math/matrix', [
        {group: 'generate', results: t.tests([
            t.dataNumArray2('m2', m2.array_rows(), [[1,2], [3,4]]),
            t.dataNumArray2('m3', m3.array_rows(), [[1,2,3], [4,5,6], [7,8,9]]),
            t.dataNumArray2('m4', m4.array_rows(), [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]),
            t.dataNumArray2('trans_m4([3,4,5])', mx.affine3_trans([3,4,5]).array_rows(), [[1,0,0,3], [0,1,0,4], [0,0,1,5], [0,0,0,1]]),
            t.dataNumArray2('scale_m3([3,4,5])', mx.scale_m3([3,4,5]).array_rows(), [[3,0,0], [0,4,0], [0,0,5]]),
            t.dataNumArray2('rotX_m3(PI/2)', mx.m3_rot_x(Math.PI/2).array_rows(), [[1,0,0], [0,0,-1], [0,1,0]]),
            t.dataNumArray2('rotY_m3(PI/2)', mx.m3_rot_y(Math.PI/2).array_rows(), [[0,0,1], [0,1,0], [-1,0,0]]),
            t.dataNumArray2('rotZ_m3(PI/2)', mx.m3_rot_z(Math.PI/2).array_rows(), [[0,-1,0], [1,0,0], [0,0,1]]),
        ], t.evalNumArray2, 1e-6)},
        {group: 'convert', results: t.tests([
            t.dataNumArray2('m2_m3(m2)', mx.m2_to_m3(m2).array_rows(), [[1,2,0], [3,4,0], [0,0,1]]),
            t.dataNumArray2('m3_m4(m3)', mx.m3_to_m4(m3).array_rows(), [[1,2,3,0], [4,5,6,0], [7,8,9,0], [0,0,0,1]]),
            t.dataNumArray2('m3_m2(m3)', mx.m3_to_m2(m3).array_rows(), [[1,2], [4,5]]),
            t.dataNumArray2('m4_m3(m4)', mx.m4_to_m3(m4).array_rows(), [[1,2,3], [5,6,7], [9,10,11]]),
        ], t.evalNumArray2, 1e-6)},
        {group: 'map', results: t.tests([
            t.dataNumArray('m2.map(v2(1,1))', m2.map(vc.v2(1,1)).array(), [1+2,3+4]),
            t.dataNumArray('m3.map(v3(1,1,1))', m3.map(vc.v3(1,1,1)).array(), [1+2+3,4+5+6,7+8+9]),
            t.dataNumArray('m4.map(v4(1,1,1,1))', m4.map(vc.v4(1,1,1,1)).array(), [1+2+3+4,5+6+7+8,9+10+11+12,13+14+15+16]),
            t.dataNumArray('trans_m4([3,4,5]).map(v4(0,0,0,0))', mx.affine3_trans([3,4,5]).map(vc.v4(0,0,0,0)).array(), [0,0,0,0]),
            t.dataNumArray('trans_m4([3,4,5]).map(v4(0,0,0,1))', mx.affine3_trans([3,4,5]).map(vc.v4(0,0,0,1)).array(), [3,4,5,1]),
            t.dataNumArray('scale_m3([3,4,5]).map(v3(1,2,3))', mx.scale_m3([3,4,5]).map(vc.v3(1,2,3)).array(), [3,8,15]),
            t.dataNumArray('rotX_m3(PI/2).map(v3(1,2,3))', mx.m3_rot_x(Math.PI/2).map(vc.v3(1,2,3)).array(), [1,-3,2]),
            t.dataNumArray('rotY_m3(PI/2).map(v3(1,2,3))', mx.m3_rot_y(Math.PI/2).map(vc.v3(1,2,3)).array(), [3,2,-1]),
            t.dataNumArray('rotZ_m3(PI/2).map(v3(1,2,3))', mx.m3_rot_z(Math.PI/2).map(vc.v3(1,2,3)).array(), [-2,1,3]),
        ], t.evalNumArray, 1e-6)},
    ]);
}

declare const module: any;
if (module != null && !module.parent) test();
