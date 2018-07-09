// Icosphere

import * as mx from '../../algorithm/matrix';
import * as geo from '../../object/object';
import * as prim from '../../object/primitive'
import * as sf from '../../decoder/savefile';

const obj0 = prim.icosphere(0);
const obj1 = prim.icosphere(1);
const obj2 = prim.icosphere(2);

const obj = geo.obj_group([
    geo.obj_single_vf(obj0, null, mx.m4_translate3([-3, 0, 0])),
    geo.obj_single_vf(obj1, null, mx.m4_translate3([0, 0, 0])),
    geo.obj_single_vf(obj2, null, mx.m4_translate3([3, 0, 0])),
], null, null);

sf.save_obj('obj/icosphere', obj);
