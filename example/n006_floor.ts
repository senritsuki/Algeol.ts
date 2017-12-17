// テーマ：森の隠れ家
import * as ut from "../algorithm/utility";
import * as seq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";
import * as cv from "../algorithm/curve";

import * as al from '../geometry/geo';
import * as lib from './n005_lib';


type V3 = vc.V3;

export class Connector {
    constructor(
        public c: V3,
        public deg: number,
    ) {}
}

export function build_connector(o: V3, r: number, deg: number): Connector {
    const d = vc.polar_to_v3(r, ut.deg_to_rad(deg), 0);
    const c = o.add(d);
    return new Connector(c, deg);
}

export class Floor {
    constructor(
        public o: V3,
        public connectors: Connector[],
    ) {}
}

export class SquareFloor extends Floor {
    constructor(
        o: V3,
        public r: number,
        public deg_offset: number = 0,
    ) {
        super(o, seq.arith(4).map(i => build_connector(o, r, i*90+deg_offset)));
    }
}
export class HexaFloor extends Floor {
    constructor(
        o: V3,
        public r: number,
        public deg_offset: number = 0,
    ) {
        super(o, seq.arith(6).map(i => build_connector(o, r, i*60+deg_offset)));
    }
}

export class Route {
    constructor(
        public c1: Connector,
        public c2: Connector,
    ) {}

    curve(): cv.Curve3 {}
}


import * as wf from '../decoder/wavefront';
import * as saver from './n003_save';

function save(objs: al.Obj[]) {
    const result = wf.objs_to_strings('./_obj/n006', objs);
    saver.save_objmtl(result);
}

