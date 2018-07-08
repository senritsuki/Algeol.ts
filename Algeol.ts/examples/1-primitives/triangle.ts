// Triangle - 三角形

import * as vc from '../../algorithm/vector';
import * as geo from '../../object/object';
import * as sf from '../../decoder/savefile';

const obj = geo.obj_single(
    // vertices
    [
        vc.v3(0, 0, 0),
        vc.v3(1, 0, 0),
        vc.v3(0, 1, 0),
    ],
    // face groups
    [
        // face group
        geo.facegroup(
            // faces
            [
                [0, 1, 2],
            ],
            // face group name (option)
            null,
            // use material name (option)
            null,
        ),
    ],
    // transform (option)
    null,
    // object name (option)
    'triangle',
);

sf.save_obj('obj/triangle', obj);
