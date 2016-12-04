
// MathのProxy
export const sqrt = Math.sqrt;
export const cos = Math.cos;
export const sin = Math.sin;
export const acos = Math.acos;
export const atan2 = Math.atan2;

/** Square Root of 2 - 2の平方根 */
export const r2 = sqrt(2);
/** Square Root of 3 - 3の平方根 */
export const r3 = sqrt(3);
/** Square Root of 5 - 5の平方根 */
export const r5 = sqrt(5);

/** 円周率 */
export const pi = Math.PI;
/** 円周率の2倍 */
export const pi2 = pi * 2;

export const deg360 = pi2;
export const deg180 = pi;
export const deg90 = pi / 2;

/** Golden Ratio - 黄金比 */
export const phi = (1 + r5) / 2;

/** (角度:度数法) -> 角度:弧度法 */
export function deg_rad(deg: number): number { return pi2 * deg / 360; }
/** (角度:弧度法) -> 角度:度数法 */
export function rad_deg(rad: number): number { return 360 * rad / pi2; }


/** Arithmetic Sequence - 等差数列 */
export function arith(count: number, start: number = 0, step: number = 1): number[] {
	const seq: number[] = new Array(count);
	for (let i = 0, n = start; i < count; i++ , n += step) {
		seq[i] = n;
	}
	return seq;
}

export interface Seq {
	seq(): number[];
	toJSON(): {};
	toString(): string;
}
class ArithmeticSequence implements Seq {
	constructor(
		public _count: number,
		public _start: number,
		public _step: number) { }

	seq(): number[] {
		return arith(this._count, this._start, this._step);
	}
	toJSON(): {} {
		return {
			"object": "ArithmeticSequence",
			"count": this._count,
			"start": this._start,
			"step": this._step,
		};
	}
	toString(): string {
		return JSON.stringify(this.toJSON());
	}
}

export function arithObj(count: number, start: number = 0, step: number = 1): Seq {
	return new ArithmeticSequence(count, start, step);
}

