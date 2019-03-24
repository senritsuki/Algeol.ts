import * as mx from '../../algeol/datatype/matrix';
import * as geo from '../../algeol/datatype/object';
import * as prim from '../../algeol/object/primitive'
import * as sf from '../savefile';

const cube = geo.objSingle(prim.regular_hexahedron(), null, null);
const rgb_cubes = geo.objGrouped([
    geo.objGrouped([cube], 'red', mx.m4_translate3([-3, 0, 0]), null),
    geo.objGrouped([cube], 'green', mx.m4_translate3([0, 0, 0]),  null),
    geo.objGrouped([cube], 'blue', mx.m4_translate3([3, 0, 0]), null),
], null, null, null);

const materials = [
    geo.material('red', [1.0, 0.0, 0.0]),
    geo.material('green', [0.0, 1.0, 0.0]),
    geo.material('blue', [0.0, 0.0, 1.0]),
];

sf.save_obj_mtl('obj/rgb_cubes', rgb_cubes, materials);
