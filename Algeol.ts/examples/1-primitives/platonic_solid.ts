// Platonic solid - プラトンの立体

import * as ut from '../../algorithm/utility';
import * as geo from '../../object/object';
import * as prim from '../../object/primitive'
import * as sf from '../../decoder/savefile';

const input: [string, geo.VF][] = [
    ['tetrahedron', prim.regular_tetrahedron()],
    ['cube', prim.regular_hexahedron()],
    ['octahedron', prim.regular_octahedron()],
    ['dodecahedron', prim.regular_dodecahedron()],
    ['icosahedron', prim.regular_icosahedron()],
];

const objs = input.map(d => geo.obj_single_vf(d[1], d[0], null));

ut.zip(input.map(d => d[0]), objs).forEach(d => sf.save_obj('obj/' + d[0], d[1]));
