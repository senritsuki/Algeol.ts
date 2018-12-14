// Triangle - 三角形

import * as vc from '../../algeol/datatype/vector';
import * as geo from '../../algeol/object/object';
import * as sf from '../savefile';

<<<<<<< HEAD
const obj = geo.objMultiFaceGroup(
=======
const obj = geo.obj_single(
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
    // vertices
    [
        vc.v3(0, 0, 0),
        vc.v3(1, 0, 0),
        vc.v3(0, 1, 0),
    ],
    // face groups
    [
        // face group
<<<<<<< HEAD
        geo.faceGroup(
=======
        geo.facegroup(
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
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
