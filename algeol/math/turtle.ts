/** Turtle graphics - タートルグラフィックス */

import * as ut from './util';
import * as vc from './vector';
import * as mx from './matrix';
import * as cv from './curve';

export interface Line2 {
	start(): vc.V2;
	end(): vc.V2;
}
export interface Line3 {
	start(): vc.V3;
	end(): vc.V3;
}

export interface Turtle2 {
	coord(): vc.V2;
	dir(): vc.V2;
	moveDraw(len: number): TLTuple2;
	move(len: number): Turtle2;
	turn(degree: number): Turtle2;
}
export interface Turtle3 {
	coord(): vc.V3;
	dir(): vc.V3;
	moveDraw(len: number): TLTuple3;
	move(len: number): Turtle3;
	turnH(degree: number): Turtle3;
	turnV(degree: number): Turtle3;
}

export interface TLTuple2 {
	turtle: Turtle2;
	line: Line2;
}
export interface TLTuple3 {
	turtle: Turtle3;
	line: Line3;
}


class LineImpl2 implements Line2 {
	constructor(
		public _start: vc.V2,
		public _end: vc.V2) { }

	start(): vc.V2 { return this._start; }
	end(): vc.V2 { return this._end; }
}
class LineImpl3 implements Line3 {
	constructor(
		public _start: vc.V3,
		public _end: vc.V3) { }

	start(): vc.V3 { return this._start; }
	end(): vc.V3 { return this._end; }
}

function line2(v1: vc.V2, v2: vc.V2): Line2 {
	return new LineImpl2(v1, v2);
}
function line3(v1: vc.V3, v2: vc.V3): Line3 {
	return new LineImpl3(v1, v2);
}


class Turtle2Impl implements Turtle2 {
	constructor(
		public _coord: vc.V2,
		public _degree: number) {
	}
	
	coord(): vc.V2 {
		return this._coord;
	}
	dir(): vc.V2 {
		return vc.polar_v2(1, ut.deg_rad(this._degree));
	}
	moveDraw(len: number): TLTuple2 {
		const dist = this.move(len);
		const line = line2(this.coord(), dist.coord());
		return { turtle: dist, line: line };
	}
	move(len: number): Turtle2 {
		return new Turtle2Impl(
			this._coord.add(this.dir().scalar(len)),
			this._degree);
	}
	turn(degree: number): Turtle2 {
		return new Turtle2Impl(
			this._coord,
			this._degree + degree);
	}
}
class Turtle3Impl implements Turtle3 {
	constructor(
		public _coord: vc.V3,
		public _degreeH: number,
		public _degreeV: number) {
	}

	coord(): vc.V3 {
		return this._coord;
	}
	dir(): vc.V3 {
		return vc.sphere_v3(1, ut.deg_rad(this._degreeH), ut.deg_rad(this._degreeV));
	}
	moveDraw(len: number): TLTuple3 {
		const dist = this.move(len);
		const line = line3(this.coord(), dist.coord());
		return { turtle: dist, line: line };
	}
	move(len: number): Turtle3 {
		return new Turtle3Impl(
			this._coord.add(this.dir().scalar(len)),
			this._degreeH,
			this._degreeV);
	}
	turnH(degree: number): Turtle3 {
		return new Turtle3Impl(
			this._coord,
			this._degreeH + degree,
			this._degreeV);
	}
	turnV(degree: number): Turtle3 {
		return new Turtle3Impl(
			this._coord,
			this._degreeH,
			this._degreeV + degree);
	}
}

export function turtle2(coord: vc.V2 = vc.zero_v2, degree: number = 0): Turtle2 {
	return new Turtle2Impl(coord, degree);
}
export function turtle3(coord: vc.V3 = vc.zero_v3, degreeH: number = 0, degreeV: number = 0): Turtle3 {
	return new Turtle3Impl(coord, degreeH, degreeV);
}

