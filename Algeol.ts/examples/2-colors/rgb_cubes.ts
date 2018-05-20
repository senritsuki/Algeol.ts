import * as mx from "../../algorithm/matrix";
import * as geo from "../../geometry/core";
import * as prim from "../../geometry/core_primitive"
import * as sf from "../../decoder/savefile";

const cube = prim.cube();
const rgb_cubes = geo.obj_group([
    geo.obj_group([cube], mx.affine3_translate([-3, 0, 0]), geo.faceinfo('red', 'red'),  null),
    geo.obj_group([cube], mx.affine3_translate([0, 0, 0]), geo.faceinfo('green', 'green'),  null),
    geo.obj_group([cube], mx.affine3_translate([3, 0, 0]), geo.faceinfo('blue', 'blue'),  null),
], null, null, null);

const materials = [
    geo.material('red', [1.0, 0.0, 0.0]),
    geo.material('green', [0.0, 1.0, 0.0]),
    geo.material('blue', [0.0, 0.0, 1.0]),
];

sf.save_obj_mtl('obj/rgb_cubes', rgb_cubes, materials);
