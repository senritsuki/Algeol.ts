import * as seq from '../algorithm/sequence';
import * as vc from '../algorithm/vector';
import * as mx from '../algorithm/matrix';
import * as al from '../geometry/geo';
import * as prim from '../geometry/primitive';
import * as wf from '../decoder/wavefront';

const cube = prim.cube(0.5);

const sq = seq.arith(21, -10, 1).map(x => seq.arith(21, -10, 1).map(y => vc.v2(x, y)))
    .reduce((a, b) => a.concat(b));

const duplicater = al.composite_m4(sq, [
    v => mx.trans_m4([v.x(), v.y(), 0.5]),
    v => mx.scale_m4([1, 1, 1 + Math.min(12, v.length())]),
]);

const cubes = al.duplicate_verts(cube.verts, duplicater)
    .map(v => new al.Geo(v, cube.faces));

wf.useBlenderCoordinateSystem();
const data = wf.geos_to_strings('./_obj/w001_concave', cubes);

declare const require: any;
const fs = require('fs');

fs.writeFile(data.objfile, data.objstrs.join('\n'), (err: any) => {
    if (err) throw err;
    console.log('save: ' + data.objfile);
});