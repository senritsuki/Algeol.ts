// Sequence and Linear Mapping

import * as ut from "./math/util";
import * as mx from "./math/matrix";

export interface SeqLim {
	lim(): mx.M4[];
}

class LimImpl implements SeqLim {
	constructor(
		public _lims: () => mx.M4[]) { }

	lim(): mx.M4[] {
		return this._lims();
	}
}
class SeqLimImpl implements SeqLim {
	constructor(
		public _seq: ut.Seq,
		public _lim: (i: number) => mx.M4) { }

	lim(): mx.M4[] {
		return this._seq.seq().map(i => this._lim(i));
	}
}

export function lims(m4: mx.M4[]): SeqLim {
	return new LimImpl(() => m4);
}
export function lim(m4: mx.M4): SeqLim {
	return lims([m4]);
}
export function seqlim(seq: ut.Seq, lambda_m4: (i: number) => mx.M4): SeqLim {
	return new SeqLimImpl(seq, lambda_m4);
}


function mul(s1: SeqLim, s2: SeqLim): SeqLim {
	const m1l = s1.lim();
	const m2l = s2.lim();
	const m: mx.M4[] = [];
	m1l.forEach(m1 => {
		m2l.forEach(m2 => {
			m.push(m1.mul(m2));
		});
	});
	return lims(m);
}
export function merge(seqlims: SeqLim[]): SeqLim {
	if (seqlims.length == 0) {
		return lims([]);
	}
	return seqlims.reduce((a, b) => mul(b, a));
}
