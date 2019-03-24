import * as mx from '../../datatype/matrix';
import * as obj from '../../datatype/object';
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
        obj.faceGroup(faces1, facename_grass, facename_grass),
        obj.faceGroup(faces2, facename_dirt, facename_dirt),
    ];
    return obj.objMultiFaceGroup(verts, fg, transform);
}

