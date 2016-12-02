// Square Matrix 正方行列

import * as ut from "../util/util";
import * as vc from "./vector";

export namespace fn {
	/** Clone - 複製
		(行列, 行数, 列数) -> 行列の複製結果を表す2次元配列 */
	export function clone(m1: number[][], orderR: number, orderC: number): number[][] {
		const m: number[][] = new Array(orderR);
		for (let r = 0; r < orderR; r++) {
			m[r] = new Array(orderC);
			for (let c = 0; c < orderC; c++) {
				m[r][c] = m1[r][c];
			}
		}
		return m;
	}
	/** Transpose - 転置
		(行列) -> 行列の転置結果を表す2次元配列 */
	export function transpose(m1: number[][]): number[][] {
		const orderRC = m1.length;
		const orderCR = m1[0].length;
		const m: number[][] = new Array(orderCR);
		for (let cr = 0; cr < orderCR; cr++) {
			m[cr] = new Array(orderRC);
			for (let rc = 0; rc < orderRC; rc++) {
				m[cr][rc] = m1[rc][cr];
			}
		}
		return m;
	}
	/** Multiplication - 乗算
		(左辺行列, 右辺行列) -> 左辺行列*右辺行列の乗算結果を表す2次元配列 */
	export function mul(m1: number[][], m2: number[][]): number[][] {
		const m2t = transpose(m2);
		const orderR = m1.length;
		const orderC = m2t.length;
		const m: number[][] = new Array(orderR);
		for (let r = 0; r < orderR; r++) {
			m[r] = new Array(orderC);
			for (let c = 0; c < orderC; c++) {
				m[r][c] = vc.fn.ip(m1[r], m2t[c]);
			}
		}
		return m;
	}
	/** Scalar Product - スカラー倍
		(行列, スカラー値) -> 行列*スカラー値の乗算結果を表す2次元配列 */
	export function scalar(m1: number[][], n: number): number[][] {
		const orderR = m1.length;
		const orderC = m1[0].length;
		const m: number[][] = new Array(orderR);
		for (let r = 0; r < orderR; r++) {
			m[r] = new Array(orderC);
			for (let c = 0; c < orderC; c++) {
				m[r][c] = m1[r][c] * n;
			}
		}
		return m;
	}
	/** Linear Mapping - 線形写像
		(左辺行列, 右辺ベクトル) -> 左辺行列*右辺ベクトルの演算結果を表す配列 */
	export function map(m1: number[][], v1: number[]): number[] {
		const orderR = m1.length;
		const v: number[] = new Array(orderR);
		for (let i = 0; i < orderR; i++) {
			v[i] = vc.fn.ip(m1[i], v1);
		}
		return v;
	}
}

/** Square Matrix of order 2 - 2次元正方行列 */
export interface M2 {
	/** () -> 自身の行列の参照を示す2次元配列
		添え字は[行番号][列番号]. 生の参照を返すため破壊的変更が可能 */
	_ref(): number[][];
	/** () -> 自身の行列の複製を表す2次元配列
		添え字は[行番号][列番号] */
	array_rows(): number[][];
	/** () -> 自身の行列の複製を表す2次元配列
		添え字は[列番号][行番号] */
	array_cols(): number[][];
	/** Multiplication - 乗算
		(右辺行列) -> 自身の行列*右辺行列の乗算結果を表す行列 */
	mul(dist: M2): M2;
	/** Linear Mapping - 線形写像
		(右辺ベクトル) -> 自身の行列*右辺ベクトルの演算結果を表すベクトル */
	map(v: vc.V2): vc.V2;
}

/** Square Matrix of order 3 - 3次元正方行列 */
export interface M3 {
	/** () -> 自身の行列の参照を示す2次元配列
		添え字は[行番号][列番号]. 生の参照を返すため破壊的変更が可能 */
	_ref(): number[][];
	/** () -> 自身の行列の複製を表す2次元配列
		添え字は[行番号][列番号] */
	array_rows(): number[][];
	/** () -> 自身の行列の複製を表す2次元配列
		添え字は[列番号][行番号] */
	array_cols(): number[][];
	/** Multiplication - 乗算
		(右辺行列) -> 自身の行列*右辺行列の乗算結果を表す行列 */
	mul(dist: M3): M3;
	/** Linear Mapping - 線形写像
		(右辺ベクトル) -> 自身の行列*右辺ベクトルの演算結果を表すベクトル */
	map(v: vc.V3): vc.V3;
}

/** Square Matrix of order 4 - 4次元正方行列 */
export interface M4 {
	/** () -> 自身の行列の参照を示す2次元配列
		添え字は[行番号][列番号]. 生の参照を返すため破壊的変更が可能 */
	_ref(): number[][];
	/** () -> 自身の行列の複製を表す2次元配列
		添え字は[行番号][列番号] */
	array_rows(): number[][];
	/** () -> 自身の行列の複製を表す2次元配列
		添え字は[列番号][行番号] */
	array_cols(): number[][];
	/** Multiplication - 乗算
		(右辺行列) -> 自身の行列*右辺行列の乗算結果を表す行列 */
	mul(dist: M4): M4;
	/** Linear Mapping - 線形写像
		(右辺ベクトル) -> 自身の行列*右辺ベクトルの演算結果を表すベクトル */
	map(v: vc.V4): vc.V4;
}



class M2Impl implements M2 {
	static Dim = 2;
	_rows: number[][];

	constructor(rows: number[][]) {
		this._rows = fn.clone(rows, M2Impl.Dim, M2Impl.Dim);
	}

	static FromRows(rows: number[][]): M2Impl { return new M2Impl(rows); }
	static FromCols(cols: number[][]): M2Impl { return new M2Impl(fn.transpose(cols)); }

	_ref(): number[][] { return this._rows; }
	array_rows(): number[][] { return fn.clone(this._rows, M2Impl.Dim, M2Impl.Dim); }
	array_cols(): number[][] { return fn.transpose(this._rows); }
	mul(dist: M2): M2 { return M2Impl.FromRows(fn.mul(this._ref(), dist._ref())); }
	map(v: vc.V2): vc.V2 { return vc.ar_v2(fn.map(this._ref(), v._ref())); }
}

class M3Impl implements M3 {
	static Dim = 3;
	_rows: number[][];

	constructor(rows: number[][]) {
		this._rows = fn.clone(rows, M3Impl.Dim, M3Impl.Dim);
	}

	static FromRows(rows: number[][]): M3Impl { return new M3Impl(rows); }
	static FromCols(cols: number[][]): M3Impl { return new M3Impl(fn.transpose(cols)); }

	_ref(): number[][] { return this._rows; }
	array_rows(): number[][] { return fn.clone(this._rows, M3Impl.Dim, M3Impl.Dim); }
	array_cols(): number[][] { return fn.transpose(this._rows); }
	mul(dist: M3): M3 { return M3Impl.FromRows(fn.mul(this._ref(), dist._ref())); }
	map(v: vc.V3): vc.V3 { return vc.ar_v3(fn.map(this._ref(), v._ref())); }
}

class M4Impl implements M4 {
	static Dim = 4;
	_rows: number[][];

	constructor(rows: number[][]) {
		this._rows = fn.clone(rows, M4Impl.Dim, M4Impl.Dim);
	}

	static FromRows(rows: number[][]): M4Impl { return new M4Impl(rows); }
	static FromCols(cols: number[][]): M4Impl { return new M4Impl(fn.transpose(cols)); }

	_ref(): number[][] { return this._rows; }
	array_rows(): number[][] { return fn.clone(this._rows, M4Impl.Dim, M4Impl.Dim); }
	array_cols(): number[][] { return fn.transpose(this._rows); }
	mul(dist: M4): M4 { return M4Impl.FromRows(fn.mul(this._ref(), dist._ref())); }
	map(v: vc.V4): vc.V4 { return vc.ar_v4(fn.map(this._ref(), v._ref())); }
}



/** ([列番号][行番号]と表される2次元配列) -> 2次元正方行列オブジェクト */
export function cols_m2(cols: number[][]): M2 { return M2Impl.FromCols(cols); }
/** ([行番号][列番号]と表される2次元配列) -> 2次元正方行列オブジェクト */
export function rows_m2(rows: number[][]): M2 { return M2Impl.FromRows(rows); }

/** ([列番号][行番号]と表される2次元配列) -> 3次元正方行列オブジェクト */
export function cols_m3(cols: number[][]): M3 { return M3Impl.FromCols(cols); }
/** ([行番号][列番号]と表される2次元配列) -> 3次元正方行列オブジェクト */
export function rows_m3(rows: number[][]): M3 { return M3Impl.FromRows(rows); }

/** ([列番号][行番号]と表される2次元配列) -> 4次元正方行列オブジェクト */
export function cols_m4(cols: number[][]): M4 { return M4Impl.FromCols(cols); }
/** ([行番号][列番号]と表される2次元配列) -> 4次元正方行列オブジェクト */
export function rows_m4(rows: number[][]): M4 { return M4Impl.FromRows(rows); }

export function v2cols_m2(vl: vc.V2[]): M2 { return M2Impl.FromCols(vl.map(v => v._ref())); }
export function v3cols_m3(vl: vc.V3[]): M3 { return M3Impl.FromCols(vl.map(v => v._ref())); }
export function v4cols_m4(vl: vc.V4[]): M4 { return M4Impl.FromCols(vl.map(v => v._ref())); }

/** 2次元単位正方行列 */
export const unit_m2: M2 = M2Impl.FromRows([
	[1, 0],
	[0, 1],
]);
/** 2次元単位正方行列 */
export const unit_m3: M3 = M3Impl.FromRows([
	[1, 0, 0],
	[0, 1, 0],
	[0, 0, 1],
]);
/** 4次元単位正方行列 */
export const unit_m4: M4 = M4Impl.FromRows([
	[1, 0, 0, 0],
	[0, 1, 0, 0],
	[0, 0, 1, 0],
	[0, 0, 0, 1],
]);

/** (2次元正方行列) -> 3次元正方行列 */
export function m2_m3(m2: M2): M3 {
	const m3rows = m2._ref().map(row => row.concat(0));
	m3rows.push([0, 0, 1]);
	return M3Impl.FromRows(m3rows);
}
/** (3次元正方行列) -> 2次元正方行列 */
export function m3_m2(m3: M3): M2 {
	return M2Impl.FromRows(m3._ref());
}
/** (3次元正方行列) -> 4次元正方行列 */
export function m3_m4(m3: M3): M4 {
	const m4rows = m3._ref().map(row => row.concat(0));
	m4rows.push([0, 0, 0, 1]);
	return M4Impl.FromRows(m4rows);
}
/** (4次元正方行列) -> 3次元正方行列 */
export function m4_m3(m4: M4): M3 {
	return M3Impl.FromRows(m4._ref());
}

/** 3次元ベクトル配列に対するアフィン写像
	(3次元ベクトル配列, 4次元正方行列, 4次元ベクトルのw成分) -> 変換後の3次元正方行列 */
export function map_m4_v3(vl: vc.V3[], m4: M4, w: number = 1): vc.V3[] {
	return vl.map(v => vc.v4_v3(m4.map(vc.v3_v4(v, w))));
}

/** 平行移動写像 */
export function trans_m4(x: number, y: number, z: number): M4 {
	return M4Impl.FromRows([
		[1, 0, 0, x],
		[0, 1, 0, y],
		[0, 0, 1, z],
		[0, 0, 0, 1],
	]);
}
/** 平行移動写像 */
export function trans_v3_m4(v3: vc.V3): M4 {
	return trans_m4(v3.x(), v3.y(), v3.z());
}

/** 拡大縮小写像 */
export function scale_m4(x: number, y: number, z: number): M4 {
	return M4Impl.FromRows([
		[x, 0, 0, 0],
		[0, y, 0, 0],
		[0, 0, z, 0],
		[0, 0, 0, 1],
	]);
}
/** 拡大縮小写像 */
export function scale_v3_m4(v3: vc.V3): M4 {
	return scale_m4(v3.x(), v3.y(), v3.z());
}

/** x軸回転写像 */
export function rotX_m4(rad: number): M4 {
	const c = ut.cos(rad);
	const s = ut.sin(rad);
	return M4Impl.FromRows([
		[1, 0, 0, 0],
		[0, c, -s, 0],
		[0, s, c, 0],
		[0, 0, 0, 1],
	]);
}
/** y軸回転写像 */
export function rotY_m4(rad: number): M4 {
	const c = ut.cos(rad);
	const s = ut.sin(rad);
	return M4Impl.FromRows([
		[c, 0, s, 0],
		[0, 1, 0, 0],
		[-s, 0, c, 0],
		[0, 0, 0, 1],
	]);
}
/** z軸回転写像 */
export function rotZ_m4(rad: number): M4 {
	const c = ut.cos(rad);
	const s = ut.sin(rad);
	return M4Impl.FromRows([
		[c, -s, 0, 0],
		[s, c, 0, 0],
		[0, 0, 1, 0],
		[0, 0, 0, 1],
	]);
}

/** x軸ベクトルをv3ベクトルと平行にする回転写像 */
export function rotYZ_x_m4(v3: vc.V3): M4 {
	const x = v3.x();
	const y = v3.y();
	const z = v3.z();
	const radY = -ut.atan2(z, ut.sqrt(x * x + y * y));
	const radZ = ut.atan2(y, x);
	const mxRotY = rotY_m4(radY);
	const mxRotZ = rotZ_m4(radZ);
	return mxRotZ.mul(mxRotY);
}
/** z軸ベクトルをv3ベクトルと平行にする回転写像 */
export function rotYZ_z_m4(v3: vc.V3): M4 {
	const x = v3.x();
	const y = v3.y();
	const z = v3.z();
	const radY = ut.deg90 - ut.atan2(z, ut.sqrt(x * x + y * y));
	const radZ = ut.atan2(y, x);
	const mxRotY = rotY_m4(radY);
	const mxRotZ = rotZ_m4(radZ);
	return mxRotZ.mul(mxRotY);
}

