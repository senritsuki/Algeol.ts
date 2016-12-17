
// MathのProxy
export const sqrt = Math.sqrt;
export const pow = Math.pow;
export const cos = Math.cos;
export const sin = Math.sin;
export const acos = Math.acos;
export const atan2 = Math.atan2;
export const min = Math.min;
export const max = Math.max;


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
export const deg60 = pi / 3;
export const deg45 = pi / 4;
export const deg30 = pi / 6;

/** Golden Ratio - 黄金比 */
export const phi = (1 + r5) / 2;

/** (角度:度数法) -> 角度:弧度法 */
export function deg_rad(deg: number): number { return pi2 * deg / 360; }
/** (角度:弧度法) -> 角度:度数法 */
export function rad_deg(rad: number): number { return 360 * rad / pi2; }

function mulall(n: number[]): number {
	return n.reduce((a, b) => a * b, 1);
}
/** Factorial - 階乗 */
export function factorial(n: number): number {
	return mulall(seq.arith(n, 1));
}
/** Combination - 組み合わせ */
export function combination(n: number, k: number): number {
	const k2 = min(k, n - k);
	return mulall(seq.arith(k2, n, -1)) / factorial(k2);
}

/** 数列 */
export namespace seq {
	/** Arithmetic Sequence - 等差数列 */
	export function arith(count: number, start: number = 0, diff: number = 1): number[] {
		const seq: number[] = new Array(count);
		for (let i = 0, n = start; i < count; i++ , n += diff) {
			seq[i] = n;
		}
		return seq;
	}
	/** Geometric Sequence - 等比数列 */
	export function geo(count: number, start: number = 1, ratio: number = 2): number[] {
		const seq: number[] = new Array(count);
		for (let i = 0, n = start; i < count; i++ , n *= ratio) {
			seq[i] = n;
		}
		return seq;
	}
	/** Recurrence Relation - 1階漸化式による数列 */
	export function recurrenceRelation1(count: number, n0: number, lambda: (n0: number) => number): number[] {
		const ini: number[] = [n0];
		const seq: number[] = new Array(count);
		const count2 = min(count, ini.length);
		for (let i = 0; i < count2; i++) {
			seq[i] = ini[i];
		}
		for (let i = ini.length; i < count; i++) {
			seq[i] = lambda(seq[i-1]);
		}
		return seq;
	}
	/** Recurrence Relation - 2階漸化式による数列 */
	export function recurrenceRelation2(count: number, n0: number, n1: number, lambda: (n0: number, n1: number) => number): number[] {
		const ini: number[] = [n0, n1];
		const seq: number[] = new Array(count);
		const count2 = min(count, ini.length);
		for (let i = 0; i < count2; i++) {
			seq[i] = ini[i];
		}
		for (let i = ini.length; i < count; i++) {
			seq[i] = lambda(seq[i-2], seq[i-1]);
		}
		return seq;
	}
	/** Fibonacci Sequence - フィボナッチ数列 */
	export function fibonacci(count: number): number[] {
		return recurrenceRelation2(count, 0, 1, (n0, n1) => n0 + n1);
	}
	/** Binomial Coefficients - 2項係数の数列 */
	export function binomialCoefficients(n: number): number[] {
		return arith(n + 1).map(i => combination(n, i));
	}
	/** n次バーンスタイン基底関数のブレンディング関数の数列 */
	export function bernstein(n: number, x: number) {
		return binomialCoefficients(n).map((d, i) => d * pow(1 - x, n - i) * pow(x, i));
	}
}

/** 二次元配列を行列に見立てた転置 */
export function transpose<T>(m1: T[][]): T[][] {
	const orderRC = m1.length;
	const orderCR = m1[0].length;
	const m: T[][] = new Array(orderCR);
	for (let cr = 0; cr < orderCR; cr++) {
		m[cr] = new Array(orderRC);
		for (let rc = 0; rc < orderRC; rc++) {
			m[cr][rc] = m1[rc][cr];
		}
	}
	return m;
}


// 削除

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
		return seq.arith(this._count, this._start, this._step);
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

export function _arithobj(count: number, start: number = 0, step: number = 1): Seq {
	return new ArithmeticSequence(count, start, step);
}

