import * as ut from '../algorithm/utility';
import * as seq from '../algorithm/sequence';
import * as mx from '../algorithm/matrix';
import * as cc from '../algorithm/color_converter';
import * as al from '../geometry/geo';
import * as prim from '../geometry/primitive';
import * as wf from '../decoder/wavefront';

const sphere = prim.dodecahedron(0.5);
const sq = seq.arith(24);

const duplicater = al.compositeMap(sq, [
    _ => mx.trans_m4([0, 5, 0]),
    n => mx.rotZ_m4(ut.deg_to_rad(-n * 15)),
]);

const geos = al.duplicateVertsAffine(sphere.verts, duplicater)
    .map(v => new al.Geo(v, sphere.faces));

const materials = sq.map(n => new al.Material(`c1510${ut.format_02d(n)}`, cc.lch_to_rgb01([75, 50, n*15])));

const obj = al.merge_geos_materials(geos, materials);

wf.useBlenderCoordinateSystem();
const data = wf.objs_to_strings('n003_colorsphere', [obj]);

declare const require: any;
const fs = require('fs');

fs.writeFile(data.objfile, data.objstrs.join('\n'), (err: any) => {
    if (err) throw err;
    console.log('save: ' + data.objfile);
});
