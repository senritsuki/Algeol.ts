/** Turtle graphics - タートルグラフィックス */

import * as ut from './utility';
import * as vc from './vector';
import * as cv2 from './curve2';
import * as cv3 from './curve3';


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
	line: cv2.Curve;
}
export interface TLTuple3 {
	turtle: Turtle3;
	line: cv3.Curve;
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
		const line = cv2.line(this.coord(), dist.coord());
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
		const line = cv3.line(this.coord(), dist.coord());
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

