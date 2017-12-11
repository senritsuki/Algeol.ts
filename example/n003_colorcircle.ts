import * as ut from '../algorithm/utility';
import * as seq from '../algorithm/sequence';
import * as mx from '../algorithm/matrix';
import * as cc from '../algorithm/color_converter';
import * as al from '../geometry/geo';
import * as prim from '../geometry/primitive';
import * as wf from '../decoder/wavefront';
import * as save from './n003_save';

const num = 24;
const step = 360 / num;
const geo = prim.prism(12, 0.5, 1.0);
const sq = seq.arith(num);

const duplicater = al.compose(sq, [
    _ => mx.trans_m4([0, 5, 0]),
    n => mx.rotZ_m4(ut.deg_to_rad(-n * step)),
]);

const geos = al.duplicate(geo, duplicater);

const lch = ut.composite_2f(cc.lch_to_rgb01, (nn: number[]) => cc.clamp(nn, 0, 1));

const materials = sq.map(n => new al.Material(`c1510${ut.format_02d(n)}`, lch([75, 50, n*step])));

const obj = al.merge_geos_materials(geos, materials);

const result = wf.objs_to_strings('./_obj/n003_colorcircle', [obj]);

save.save_objmtl(result);
