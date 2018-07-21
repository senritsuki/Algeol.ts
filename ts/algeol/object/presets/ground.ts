import * as mx from '../../algorithm/matrix';
import * as obj from '../object';
import * as cube from '../../geometry/primitive3/cube';

export function cube_grass_dirt(
    facename_grass: string = 'grass',
    facename_dirt: string = 'dirt',
    cube_radius: number = 0.5,
    transform: mx.M4|null = null,
): obj.Object {
    const verts = cube.verts(cube_radius);
    const faces1 = cube.faces_top();
    const faces2 = cube.faces_side().concat(cube.faces_bottom());
    const fg = [
        obj.facegroup(faces1, facename_grass, facename_grass),
        obj.facegroup(faces2, facename_dirt, facename_dirt),
    ];
    return obj.obj_single(verts, fg, transform);
}

