import * as mx from '../../algeol/datatype/matrix';
import * as geo from '../../algeol/object/object';
import * as prim from '../../algeol/object/primitive'
import * as sf from '../savefile';

<<<<<<< HEAD
const cube = geo.objSingle(prim.regular_hexahedron(), null, null);
const rgb_cubes = geo.objGrouped([
    geo.objGrouped([cube], mx.m4_translate3([-3, 0, 0]), geo.faceInfo('red', 'red'),  null),
    geo.objGrouped([cube], mx.m4_translate3([0, 0, 0]), geo.faceInfo('green', 'green'),  null),
    geo.objGrouped([cube], mx.m4_translate3([3, 0, 0]), geo.faceInfo('blue', 'blue'),  null),
=======
const cube = geo.obj_single_vf(prim.regular_hexahedron(), null, null);
const rgb_cubes = geo.obj_group([
    geo.obj_group([cube], mx.m4_translate3([-3, 0, 0]), geo.faceinfo('red', 'red'),  null),
    geo.obj_group([cube], mx.m4_translate3([0, 0, 0]), geo.faceinfo('green', 'green'),  null),
    geo.obj_group([cube], mx.m4_translate3([3, 0, 0]), geo.faceinfo('blue', 'blue'),  null),
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
], null, null, null);

const materials = [
    geo.material('red', [1.0, 0.0, 0.0]),
    geo.material('green', [0.0, 1.0, 0.0]),
    geo.material('blue', [0.0, 0.0, 1.0]),
];

sf.save_obj_mtl('obj/rgb_cubes', rgb_cubes, materials);
