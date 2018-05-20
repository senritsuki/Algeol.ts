// Platonic solid - プラトンの立体

import * as geo from "../../geometry/core";
import * as prim from "../../geometry/core_primitive"
import * as sf from "../../decoder/savefile";

const data: [string, geo.Object][] = [
    ['tetrahedron', prim.tetrahedron()],
    ['cube', prim.cube()],
    ['octahedron', prim.octahedron()],
    ['dodecahedron', prim.dodecahedron()],
    ['icosahedron', prim.icosahedron()],
];

data.forEach(d => sf.save_obj('obj/' + d[0], d[1]));