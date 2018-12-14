// Icosphere

import * as mx from '../../algeol/datatype/matrix';
import * as geo from '../../algeol/object/object';
import * as prim from '../../algeol/object/primitive'
import * as sf from '../savefile';

const obj0 = prim.icosphere(0);
const obj1 = prim.icosphere(1);
const obj2 = prim.icosphere(2);

<<<<<<< HEAD
const obj = geo.objGrouped([
    geo.objSingle(obj0, null, mx.m4_translate3([-3, 0, 0])),
    geo.objSingle(obj1, null, mx.m4_translate3([0, 0, 0])),
    geo.objSingle(obj2, null, mx.m4_translate3([3, 0, 0])),
=======
const obj = geo.obj_group([
    geo.obj_single_vf(obj0, null, mx.m4_translate3([-3, 0, 0])),
    geo.obj_single_vf(obj1, null, mx.m4_translate3([0, 0, 0])),
    geo.obj_single_vf(obj2, null, mx.m4_translate3([3, 0, 0])),
>>>>>>> 22927be6c8c25f9963f0d23a91084017345f9998
], null, null);

sf.save_obj('obj/icosphere', obj);
