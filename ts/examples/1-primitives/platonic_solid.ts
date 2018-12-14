// Platonic solid - プラトンの立体

import * as ut from '../../algeol/common';
import * as geo from '../../algeol/object/object';
import * as prim from '../../algeol/object/primitive'
import * as sf from '../savefile';

const input: [string, geo.VF][] = [
    ['tetrahedron', prim.regular_tetrahedron()],
    ['cube', prim.regular_hexahedron()],
    ['octahedron', prim.regular_octahedron()],
    ['dodecahedron', prim.regular_dodecahedron()],
    ['icosahedron', prim.regular_icosahedron()],
];

<<<<<<< HEAD
const objs = input.map(d => geo.objSingle(d[1], d[0], null));
=======
const objs = input.map(d => geo.obj_single_vf(d[1], d[0], null));
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998

ut.zip(input.map(d => d[0]), objs).forEach(d => sf.save_obj('obj/' + d[0], d[1]));
