// Platonic solid - プラトンの立体

import * as ut from '../../algeol/common';
import * as geo from '../../algeol/datatype/object';
import * as prim from '../../algeol/object/primitive'
import * as prim4 from '../../algeol/geometry/primitive3/tetrahedron';
import * as prim6 from '../../algeol/geometry/primitive3/cube';
import * as prim8 from '../../algeol/geometry/primitive3/octahedron';
import * as prim12 from '../../algeol/geometry/primitive3/dodecahedron';
import * as prim20 from '../../algeol/geometry/primitive3/icosahedron';

const input: [string, geo.VF][] = [
    ['tetrahedron', prim4.vf(1)],
    ['cube', prim6.vf(1)],
    ['octahedron', prim8.vf(1)],
    ['dodecahedron', prim12.vf(1, true)],
    ['icosahedron', prim20.vf(1, true)],
];

const objs = input.map(d => geo.objSingle(d[1], d[0], null));

import * as wf from '../../algeol/decoder/wavefront';
import * as sf from '../savefile';

wf.useBlenderCoordinateSystem();
wf.setFloatFixed(6);
ut.zip(input.map(d => d[0]), objs).forEach(d => sf.save_obj('obj/' + d[0], d[1]));
