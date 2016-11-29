// Vector ベクトル

import * as ut from "../util/util";

export namespace fn {
	export function op(a: number[], dim: number, fn: (n1: number) => number): number[] {
		const v: number[] = [];
		for (let i = 0; i < dim; i++) {
			v.push(fn(a[i]));
		}
		return v;
	}
	export function op2(a: number[], b: number[], dim: number, fn: (n1: number, n2: number) => number): number[] {
		const v: number[] = [];
		for (let i = 0; i < dim; i++) {
			v.push(fn(a[i], b[i]));
		}
		return v;
	}

	/** Addition 加算 */
	export function add(a: number[], b: number[]): number[] {
		return op2(a, b, a.length, (n1, n2) => n1 + n2);
	}
	/** Subtraction 減算 */
	export function sub(a: number[], b: number[]): number[] {
		return op2(a, b, a.length, (n1, n2) => n1 - n2);
	}
	/** スカラー倍 */
	export function scalar(a: number[], n: number): number[] {
		return op(a, a.length, (n1) => n1 * n);
	}
	/** 要素ごとの積, アダマール積 */
	export function hadamart(a: number[], b: number[]): number[] {
		return op2(a, b, a.length, (n1, n2) => n1 * n2);
	}
	/** Inner Product, Dot Product 内積 */
	export function ip(a: number[], b: number[]): number {
		return hadamart(a, b).reduce((a, b) => a + b);
	}
	/** Cross Product 2-D 外積（二次元） */
	export function cp2(a: number[], b: number[]): number {
		return a[0] * b[1] - a[1] * b[0];
	}
	/** Cross Product 3-D 外積（三次元） */
	export function cp3(a: number[], b: number[]): number[] {
		return [
			a[1] * b[2] - a[2] * b[1],
			a[2] * b[0] - a[0] * b[2],
			a[0] * b[1] - a[1] * b[0],
		];
	}
}


/** 2D Vector - 2次元ベクトル */
export interface V2 {
	/** ベクトルを表す配列. 生の参照を返すため破壊的変更が可能 */
	_ref(): number[];
	/** ベクトルを表す配列. 複製を返す */
	array(): number[];
	/** x値. array()[0]と同値 */
	x(): number;
	/** y値. array()[1]と同値 */
	y(): number;
	/** 複製 */
	clone(): V2;
	/** 加算 */
	add(dist: V2): V2;
	/** 減算 */
	sub(dist: V2): V2;
	/** 要素同士の積 */
	hadamart(dist: V2): V2;
	/** スカラー倍 */
	scalar(n: number): V2;
	/** 内積 */
	ip(dist: V2): number;
	/** 外積 */
	cp(dist: V2): number;
	/** 単位ベクトル化 - clone() / length() と同値 */
	unit(): V2;
	/** ベクトルの長さの2乗 */
	lenght2(): number;
	/** ベクトルの長さ */
	length(): number;
}

/** 3D Vector - 3次元ベクトル */
export interface V3 {
	/** ベクトルを表す配列. 生の参照を返すため破壊的変更が可能 */
	_ref(): number[];
	/** ベクトルを表す配列. 複製を返す */
	array(): number[];
	/** x値. array()[0]と同値 */
	x(): number;
	/** y値. array()[1]と同値 */
	y(): number;
	/** z値. array()[2]と同値 */
	z(): number;
	/** 複製 */
	clone(): V3;
	/** 加算 */
	add(dist: V3): V3;
	/** 減算 */
	sub(dist: V3): V3;
	/** 要素同士の積 */
	hadamart(dist: V3): V3;
	/** スカラー倍 */
	scalar(n: number): V3;
	/** 内積 */
	ip(dist: V3): number;
	/** 外積 */
	cp(dist: V3): V3;
	/** 単位ベクトル化 - clone() / length() と同値 */
	unit(): V3;
	/** ベクトルの長さの2乗 */
	lenght2(): number;
	/** ベクトルの長さ */
	length(): number;
}

/** 4D Vector - 4次元ベクトル */
export interface V4 {
	/** ベクトルを表す配列. 生の参照を返すため破壊的変更が可能 */
	_ref(): number[];
	/** ベクトルを表す配列. 複製を返す */
	array(): number[];
	/** x値. array()[0]と同値 */
	x(): number;
	/** y値. array()[1]と同値 */
	y(): number;
	/** z値. array()[2]と同値 */
	z(): number;
	/** w値. array()[3]と同値 */
	w(): number;
	/** 複製 */
	clone(): V4;
	/** 加算 */
	add(dist: V4): V4;
	/** 減算 */
	sub(dist: V4): V4;
	/** 要素同士の積 */
	hadamart(dist: V4): V4;
	/** スカラー倍 */
	scalar(n: number): V4;
	/** 内積 */
	ip(dist: V4): number;
	/** 単位ベクトル化 - clone() / length() と同値 */
	unit(): V4;
	/** ベクトルの長さの2乗 */
	lenght2(): number;
	/** ベクトルの長さ */
	length(): number;
}


class V2Impl implements V2 {
	_v: number[];

	constructor(
		x: number,
		y: number) {
		this._v = [x, y];
	}

	static FromArray(v: number[]): V2Impl {
		return new V2Impl(v[0], v[1]);
	}

	_ref(): number[] { return this._v; }
	array(): number[] { return this._v.slice(0); }
	x(): number { return this._v[0]; }
	y(): number { return this._v[1]; }
	clone(): V2 { return new V2Impl(this.x(), this.y()); }
	add(dist: V2): V2 { return V2Impl.FromArray(fn.add(this._ref(), dist._ref())); }
	sub(dist: V2): V2 { return V2Impl.FromArray(fn.sub(this._ref(), dist._ref())); }
	hadamart(dist: V2): V2 { return V2Impl.FromArray(fn.hadamart(this._ref(), dist._ref())); }
	scalar(n: number): V2 { return V2Impl.FromArray(fn.scalar(this._ref(), n)); }
	ip(dist: V2): number { return fn.ip(this.array(), dist._ref()); }
	cp(dist: V2): number { return fn.cp2(this._ref(), dist._ref()); }
	unit(): V2 { return this.scalar(1 / this.length()); }
	lenght2(): number { return this.ip(this); }
	length(): number { return ut.sqrt(this.lenght2()); }
}

class V3Impl implements V3 {
	_v: number[];

	constructor(
		x: number,
		y: number,
		z: number) {
		this._v = [x, y, z];
	}

	static FromArray(v: number[]): V3Impl {
		return new V3Impl(v[0], v[1], v[2]);
	}

	_ref(): number[] { return this._v; }
	array(): number[] { return this._v.slice(0); }
	x(): number { return this._v[0]; }
	y(): number { return this._v[1]; }
	z(): number { return this._v[2]; }
	clone(): V3 { return new V3Impl(this.x(), this.y(), this.z()); }
	add(dist: V3): V3 { return V3Impl.FromArray(fn.add(this._ref(), dist._ref())); }
	sub(dist: V3): V3 { return V3Impl.FromArray(fn.sub(this._ref(), dist._ref())); }
	hadamart(dist: V3): V3 { return V3Impl.FromArray(fn.hadamart(this._ref(), dist._ref())); }
	scalar(n: number): V3 { return V3Impl.FromArray(fn.scalar(this._ref(), n)); }
	ip(dist: V3): number { return fn.ip(this.array(), dist._ref()); }
	cp(dist: V3): V3 { return V3Impl.FromArray(fn.cp3(this._ref(), dist._ref())); }
	unit(): V3 { return this.scalar(1 / this.length()); }
	lenght2(): number { return this.ip(this); }
	length(): number { return ut.sqrt(this.lenght2()); }
}

class V4Impl implements V4 {
	_v: number[];

	constructor(
		x: number,
		y: number,
		z: number,
		w: number) {
		this._v = [x, y, z, w];
	}

	static FromArray(v: number[]): V4Impl {
		return new V4Impl(v[0], v[1], v[2], v[3]);
	}

	_ref(): number[] { return this._v; }
	array(): number[] { return this._v.slice(0); }
	x(): number { return this._v[0]; }
	y(): number { return this._v[1]; }
	z(): number { return this._v[2]; }
	w(): number { return this._v[3]; }
	clone(): V4 { return new V4Impl(this.x(), this.y(), this.z(), this.w()); }
	add(dist: V4): V4 { return V4Impl.FromArray(fn.add(this._ref(), dist._ref())); }
	sub(dist: V4): V4 { return V4Impl.FromArray(fn.sub(this._ref(), dist._ref())); }
	hadamart(dist: V4): V4 { return V4Impl.FromArray(fn.hadamart(this._ref(), dist._ref())); }
	scalar(n: number): V4 { return V4Impl.FromArray(fn.scalar(this._ref(), n)); }
	ip(dist: V4): number { return fn.ip(this.array(), dist._ref()); }
	unit(): V4 { return this.scalar(1 / this.length()); }
	lenght2(): number { return this.ip(this); }
	length(): number { return ut.sqrt(this.lenght2()); }
}


/** (x成分, y成分) -> 2次元ベクトルオブジェクト */
export function v2(x: number, y: number): V2 { return new V2Impl(x, y); }
/** (xyz成分を含む配列) -> 2次元ベクトルオブジェクト */
export function ar_v2(v: number[]): V2 { return V2Impl.FromArray(v); }

/** (x成分, y成分, z成分) -> 3次元ベクトルオブジェクト */
export function v3(x: number, y: number, z: number): V3 { return new V3Impl(x, y, z); }
/** (xyz成分を含む配列) -> 3次元ベクトルオブジェクト */
export function ar_v3(v: number[]): V3 { return V3Impl.FromArray(v); }

/** (x成分, y成分, z成分, w成分) -> 4次元ベクトルオブジェクト */
export function v4(x: number, y: number, z: number, w: number): V4 { return new V4Impl(x, y, z, w); }
/** (xyzw成分を含む配列) -> 4次元ベクトルオブジェクト */
export function ar_v4(v: number[]): V4 { return V4Impl.FromArray(v); }


/** (2次元ベクトルオブジェクト, z成分) -> 3次元ベクトルオブジェクト */
export function v2_v3(v2: V2, z: number): V3 { return V3Impl.FromArray(v2._ref().concat(z)); }
/** (3次元ベクトルオブジェクト) -> 2次元ベクトルオブジェクト */
export function v3_v2(v3: V3): V2 { return V2Impl.FromArray(v3._ref()); }

/** (3次元ベクトルオブジェクト, w成分) -> 4次元ベクトルオブジェクト */
export function v3_v4(v3: V3, w: number): V4 { return V4Impl.FromArray(v3._ref().concat(w)); }
/** (4次元ベクトルオブジェクト) -> 3次元ベクトルオブジェクト */
export function v4_v3(v4: V4): V3 { return V3Impl.FromArray(v4._ref()); }

export const zero_v3 = v3(0, 0, 0);
export const unitX_v3 = v3(1, 0, 0);
export const unitY_v3 = v3(0, 1, 0);
export const unitZ_v3 = v3(0, 0, 1);


/** Vector ベクトル */
export class _Vector {
	constructor(
		public v: number[]) { }

	static FromArray(v: number[]): _Vector {
		return new _Vector(v);
	}

	dim(): number {
		return this.v.length;
	}

	toString(): string {
		return this.v.join(', ');
	}

	add(dist: _Vector): _Vector {
		return _Vector.FromArray(fn.add(this.v, dist.v));
	}
	sub(dist: _Vector): _Vector {
		return _Vector.FromArray(fn.sub(this.v, dist.v));
	}
	hadamart(dist: _Vector): _Vector {
		return _Vector.FromArray(fn.hadamart(this.v, dist.v));
	}
	scalar(n: number): _Vector {
		return _Vector.FromArray(fn.scalar(this.v, n));
	}
	/** Inner Product, Dot Product 内積 */
	ip(dist: _Vector): number {
		return fn.ip(this.v, dist.v);
	}
	/** Unit Vector 単位ベクトル */
	normalize(): _Vector {
		return this.scalar(1 / this.length());
	}

	/** 長さの二乗 */
	length2(): number {
		return this.ip(this);
	}
	/** 長さ */
	length(): number {
		return ut.sqrt(this.length2());
	}
}

export class _Vector2 extends _Vector {
	constructor(
		x: number,
		y: number) {
		super([x, y]);
	}

	static FromArray(v: number[]): _Vector2 {
		return new _Vector2(v[0], v[1]);
	}

	dim(): number {
		return 2;
	}
	x(): number {
		return this.v[0];
	}
	y(): number {
		return this.v[1];
	}

	add(dist: _Vector2): _Vector2 {
		return _Vector2.FromArray(fn.add(this.v, dist.v));
	}
	sub(dist: _Vector2): _Vector2 {
		return _Vector2.FromArray(fn.sub(this.v, dist.v));
	}
	hadamart(dist: _Vector2): _Vector2 {
		return _Vector2.FromArray(fn.hadamart(this.v, dist.v));
	}
	scalar(n: number): _Vector2 {
		return _Vector2.FromArray(fn.scalar(this.v, n));
	}
	/** Inner Product, Dot Product 内積 */
	ip(dist: _Vector2): number {
		return super.ip(dist)
	}
	/** Unit Vector 単位ベクトル */
	normalize(): _Vector2 {
		return this.scalar(1 / this.length());
	}

	/** Cross Product 外積 */
	cp(dist: _Vector2): number {
		return fn.cp2(this.v, dist.v);
	}

}

export class _Vector3 extends _Vector {
	constructor(
		x: number,
		y: number,
		z: number) {
		super([x, y, z]);
	}

	static FromArray(v: number[]): _Vector3 {
		return new _Vector3(v[0], v[1], v[2]);
	}

	dim(): number {
		return 3;
	}
	x(): number {
		return this.v[0];
	}
	y(): number {
		return this.v[1];
	}
	z(): number {
		return this.v[2];	
	}

	add(dist: _Vector3): _Vector3 {
		return _Vector3.FromArray(fn.add(this.v, dist.v));
	}
	sub(dist: _Vector3): _Vector3 {
		return _Vector3.FromArray(fn.sub(this.v, dist.v));
	}
	hadamart(dist: _Vector3): _Vector3 {
		return _Vector3.FromArray(fn.hadamart(this.v, dist.v));
	}
	scalar(n: number): _Vector3 {
		return _Vector3.FromArray(fn.scalar(this.v, n));
	}
	/** Inner Product, Dot Product 内積 */
	ip(dist: _Vector3): number {
		return super.ip(dist)
	}
	/** Unit Vector 単位ベクトル */
	normalize(): _Vector3 {
		return this.scalar(1 / this.length());
	}

	/** Cross Product 外積 */
	cp(dist: _Vector3): _Vector3 {
		return _Vector3.FromArray(fn.cp3(this.v, dist.v));
	}

}

export class _Vector4 extends _Vector {
	constructor(
		x: number,
		y: number,
		z: number,
		w: number) {
		super([x, y, z, w]);
	}

	static FromArray(v: number[]): _Vector4 {
		return new _Vector4(v[0], v[1], v[2], v[3]);
	}

	dim(): number {
		return 4;
	}
	x(): number {
		return this.v[0];
	}
	y(): number {
		return this.v[1];
	}
	z(): number {
		return this.v[2];
	}
	w(): number {
		return this.v[3];
	}

	add(dist: _Vector4): _Vector4 {
		return _Vector4.FromArray(fn.add(this.v, dist.v));
	}
	sub(dist: _Vector4): _Vector4 {
		return _Vector4.FromArray(fn.sub(this.v, dist.v));
	}
	hadamart(dist: _Vector4): _Vector4 {
		return _Vector4.FromArray(fn.hadamart(this.v, dist.v));
	}
	scalar(n: number): _Vector4 {
		return _Vector4.FromArray(fn.scalar(this.v, n));
	}
	/** Inner Product, Dot Product 内積 */
	ip(dist: _Vector4): number {
		return super.ip(dist)
	}
	/** Unit Vector 単位ベクトル */
	normalize(): _Vector4 {
		return this.scalar(1 / this.length());
	}

}


