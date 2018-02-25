import * as seq from '../algorithm/sequence';
import * as vc from '../algorithm/vector';
import * as mx from '../algorithm/matrix';
import * as al from '../geometry/surface_core';
import * as prim from '../geometry/primitive_surface';
import * as wf from '../decoder/wavefront';

const octahedron = prim.octahedron(0.5);

const radius = 9;

const sq: vc.V3[] = [];
seq.range_step(-radius, radius, 1).forEach(x => {
    const dx = Math.abs(x);
    seq.range_step(-radius, radius, 1).forEach(y => {
        const dy = Math.abs(y);
        if (dx + dy > radius) return;
        seq.range_step(-radius, radius, 1).forEach(z => {
            const dz = Math.abs(z);
            if (dx + dy + dz > radius) return;
            if (dx + dy + dz < radius-1) return;
            sq.push(vc.v3(x, y, z));
        });
    });
});

const duplicater = al.compose_v4map(sq, [
    v => mx.affine3_translate(v),
]);

const octahedrons = al.duplicate_v3(octahedron.verts, 1, duplicater)
    .map(v => new al.Surfaces(v, octahedron.faces));

wf.useBlenderCoordinateSystem();
const data = wf.geos_to_strings('./_obj/n001_octahedron', octahedrons);

declare const require: any;
const fs = require('fs');

fs.writeFile(data.objfile, data.objstrs.join('\n'), (err: any) => {
    if (err) throw err;
    console.log('save: ' + data.objfile);
});
