// Platonic solid - プラトンの立体

import * as geo from '../../object/object';
import * as prim from '../../object/primitive'
import * as sf from '../../decoder/savefile';

const data: [string, geo.Object][] = [
    ['tetrahedron', prim.regular_tetrahedron()],
    ['cube', prim.regular_hexahedron()],
    ['octahedron', prim.regular_octahedron()],
    ['dodecahedron', prim.regular_dodecahedron()],
    ['icosahedron', prim.regular_icosahedron()],
];

data.forEach(d => sf.save_obj('obj/' + d[0], d[1]));
