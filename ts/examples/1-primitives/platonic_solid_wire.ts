// Platonic solid - プラトンの立体

import * as ut from '../../algeol/common';
import * as vc from '../../algeol/datatype/vector';
import * as prim4 from '../../algeol/geometry/primitive3/tetrahedron';
import * as prim6 from '../../algeol/geometry/primitive3/cube';
import * as prim8 from '../../algeol/geometry/primitive3/octahedron';
import * as prim12 from '../../algeol/geometry/primitive3/dodecahedron';
import * as prim20 from '../../algeol/geometry/primitive3/icosahedron';
import * as obj from '../../algeol/object/object';
import * as line from '../../algeol/object/lib/line';
import * as wf from '../../algeol/decoder/wavefront';
import * as sf from '../savefile';

const input: [string, vc.V3[], [number, number][]][] = [
    ['wire_tetrahedron', prim4.verts(1), prim4.edges()],
    ['wire_cube', prim6.verts(1), prim6.edges()],
    ['wire_octahedron', prim8.verts(1), prim8.edges()],
    ['wire_dodecahedron', prim12.verts(1), prim12.edges()],
    ['wire_icosahedron', prim20.verts(1), prim20.edges()],
];

function fn(d: [string, vc.V3[], [number, number][]]): obj.Object {
    const verts = d[1];
    const edges = d[2];
<<<<<<< HEAD
    const vflist = edges.map(edge => line.cube(verts[edge[0]], verts[edge[1]], 0.05, 0.05));
    return obj.objGrouped(vflist.map(vf => obj.objSingle(vf, null, null)), null, null);
=======
    const vf = edges.map(edge => line.cube(verts[edge[0]], verts[edge[1]], 0.05, 0.05));
    return obj.obj_group_vf(vf, null, null);
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
}

const objs = input.map(d => fn(d));

wf.useBlenderCoordinateSystem();
wf.setFloatFixed(3);

ut.zip(input.map(d => d[0]), objs).forEach(d => sf.save_obj('obj/' + d[0], d[1]));
