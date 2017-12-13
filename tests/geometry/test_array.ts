declare const require: any;
const fs = require('fs');

import * as ut from "../../algorithm/utility";
import * as seq from "../../algorithm/sequence";
import * as vc from "../../algorithm/vector";
import * as mx from "../../algorithm/matrix";
import * as al from "../../geometry/geo";
import * as prim from "../../geometry/primitive";
import * as multi from "../../geometry/array";
import * as wo from "../../decoder/wavefront";


function save(name: string, geo: al.Geo): void {
    const dir = 'test_geo_multi/';
    const data = wo.geos_to_strings(name, [geo]);
    const path = dir + data.objfile;
    fs.writeFile(path, data.objstrs.join('\n'));
    console.log('save: ' + path);
}

export function test_al() {
    al.duplicate_verts(
        [vc.v3(0, 0, 0), vc.v3(1, 0, 0)],
        al.m4s_to_maps([mx.trans_m4([1, 0, 0]), mx.trans_m4([2, 0, 0])])
    ).forEach(vv => vv.forEach(v => console.log(v)));
    al.composite_m4<number>([0, 1], [
        d => mx.trans_m4([d + 1, 0, 0]),
        _d => mx.scale_m4([2, 2, 2]),
        d => mx.trans_m4([0, d + 1, 0]),
    ]).forEach(m => console.log(m));
}

function test() {
    save('prismArray',
        multi.prismArray([
            prim.fn.circle.verts_i(8, 1, 0, 0),
            prim.fn.circle.verts_i(8, ut.r3, 0, 1),
            prim.fn.circle.verts_i(8, 2, 0, 2),
            prim.fn.circle.verts_i(8, ut.r3, 0, 3),
            prim.fn.circle.verts_i(8, 1, 0, 4),
        ]));
    save('antiprismArray-0',
        multi.antiprismArray([
            prim.fn.circle.verts_i(4, 1, ut.deg1 * 0, 0),
            prim.fn.circle.verts_i(4, 1, ut.deg1 * 45, 1),
        ]));
    save('antiprismArray-1',
        multi.antiprismArray(seq.arith(5).map(i =>
            prim.fn.circle.verts_i(6, 1, ut.deg30 * i, i))));
    save('antiprismArray-2',
        multi.antiprismArray(seq.arith(5).map(i =>
            prim.fn.circle.verts_i(6, 1, ut.deg30 * i * 3, i))));
    save('prismArray_pyramid',
        multi.prismArray_pyramid([
            prim.fn.circle.verts_c(4, 2.0, 0, 0),
            prim.fn.circle.verts_c(4, 1.6, 0, 0.4),
            prim.fn.circle.verts_c(4, 1.2, 0, 1.2),
            prim.fn.circle.verts_c(4, 0.8, 0, 2.8),
            prim.fn.circle.verts_c(4, 0.4, 0, 6.0),
        ], vc.v3(0, 0, 12.4)));
    save('antiprismArray_pyramid',
        multi.prismArray_pyramid([
            prim.fn.circle.verts_c(4, 2.0, 0, 0),
            prim.fn.circle.verts_i(4, 1.5, ut.deg90, 0.6),
            prim.fn.circle.verts_c(4, 1.0, ut.deg90, 1.8),
            prim.fn.circle.verts_i(4, 0.5, ut.deg90 * 2, 4.2),
        ], vc.v3(0, 0, 9.0)));
    save('prismArray_bipyramid',
        multi.prismArray_bipyramid(seq.arith(5, ut.deg30, ut.deg30).map(rad => prim.fn.circle.verts_i(12, 2 * Math.sin(rad), 0, 2 * -Math.cos(rad))),
            vc.v3(0, 0, -2), vc.v3(0, 0, 2)));
    save('antiprismArray_bipyramid',
        multi.antiprismArray_bipyramid(seq.arith(5, ut.deg30, ut.deg30).map(rad => prim.fn.circle.verts_i(12, 2 * Math.sin(rad), rad / 2, 2 * -Math.cos(rad))),
            vc.v3(0, 0, -2), vc.v3(0, 0, 2)));
    save('prismRing',
        multi.prismRing(al.duplicate_verts(
            prim.fn.circle.verts_i(4, 1),
            al.compose<number>(seq.arith(4), [
                _d => mx.rotX_m4(ut.deg90),
                _d => mx.trans_m4([3, 0, 0]),
                d => mx.rotZ_m4(ut.deg90 * d),
            ]))));
    save('antiprismRing',
        multi.antiprismRing(al.duplicate_verts(
            prim.fn.circle.verts_i(4, 1),
            al.compose<number>(seq.arith(8), [
                d => mx.rotZ_m4(ut.deg45 * d),
                _d => mx.rotX_m4(ut.deg90),
                _d => mx.trans_m4([3, 0, 0]),
                d => mx.rotZ_m4(ut.deg45 * d),
            ]))));
}
test();
