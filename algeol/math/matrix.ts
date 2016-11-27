// Square Matrix 正方行列

import * as vc from "./vector";

export namespace fn {
	/** Multiplication - 乗算
		(左辺行列, 右辺行列) -> 左辺行列*右辺行列の乗算結果を表す2次元配列 */
	export function mul(m1rows: number[][], m2cols: number[][]): number[][] {
		const orderR = m1rows.length;
		const orderC = m2cols.length;
		const m: number[][] = new Array(orderR);
		for (let r = 0; r < orderR; r++) {
			m[r] = new Array(orderC);
			for (let c = 0; c < orderC; c++) {
				m[r][c] = vc.fn.ip(m1rows[r], m2cols[c]);
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
	/** Linear Mapping - 線形写像
		(左辺行列, 右辺ベクトル) -> 左辺行列*右辺ベクトルの演算結果を表す配列 */
	export function map(m1: number[][], v1: number[]): number[] {
		const orderR = m1.length;
		const v: number[] = new Array(orderR);
		for (let i = 0; i < orderR; i++) {
			v[i] = vc.fn.ip(m1[i], v);
		}
		return v;
	}

	export function _mul(m1: _Matrix, m2: _Matrix): number[][] {
		const dim = m1.dim();
		const m1rows = m1.rows();
		const m2cols = m2.cols();
		const m: number[][] = [];
		for (let r = 0; r < dim; r++) {
			const v: number[] = [];
			for (let c = 0; c < dim; c++) {
				v.push(vc.fn.ip(m1rows[r], m2cols[c]));
			}
			m.push(v);
		}
		return m;
	}
	export function _scalar(m1: _Matrix, n: number): number[][] {
		const dim = m1.dim();
		const m: number[][] = [];
		for (let r = 0; r < dim; r++) {
			const v: number[] = [];
			for (let c = 0; c < dim; c++) {
				v.push(m1[r][c] * n);
			}
			m.push(v);
		}
		return m;
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


export class _Matrix {
	constructor(
		public mx: number[][]) { }

	static FromRows(rows: number[][]): _Matrix {
		return new _Matrix(rows);
	}
	static FromCols(cols: number[][]): _Matrix {
		return new _Matrix(_Matrix.Transpose(cols));
	}
	static Transpose(cols: number[][]): number[][] {
		const collen = cols.length;
		const rowlen = cols[0].length;
		const rows: number[][] = [];
		for (let r = 0; r < rowlen; r++) {
			const v: number[] = [];
			for (let c = 0; c < collen; c++) {
				v.push(cols[c][r]);
			}
			rows.push(v);
		}
		return rows;
	}

	dim(): number {
		return this.mx.length;
	}

	row(r: number): number[] {
		return this.mx[r];
	}
	rows(): number[][] {
		return this.mx;
	}
	cols(): number[][] {
		const m: number[][] = [];
		for (let c = 0; c < this.dim(); c++) {
			m.push(this.col[c]);
		}
		return m;
	}
	col(c: number): number[] {
		const v: number[] = [];
		for (let r = 0; r < this.dim(); r++) {
			v.push(this.mx[r][c]);
		}
		return v;
	}

	toString(): string {
		const d = this.dim();
		return this.mx.slice(0, d).map(v => `(${v.slice(0, d).join(', ')})`).join(', ');
	}
	
	mul(dist: _Matrix): _Matrix {
		return _Matrix.FromRows(fn._mul(this, dist));
	}
	scalar(n: number): _Matrix {
		return _Matrix.FromRows(fn._scalar(this, n));
	}
}

export interface M4 {
	mul(dist: M4): M4;
}

export class _Matrix2 extends _Matrix {
	static FromRows(rows: number[][]): _Matrix2 {
		return new _Matrix2(rows);
	}
	static FromCols(cols: number[][]): _Matrix2 {
		return new _Matrix2(_Matrix.Transpose(cols));
	}

	dim(): number {
		return 2;
	}

	mul(dist: _Matrix2): _Matrix2 {
		return _Matrix2.FromRows(fn._mul(this, dist));
	}
	scalar(n: number): _Matrix2 {
		return _Matrix2.FromRows(fn._scalar(this, n));
	}
}

export class Matrix3 extends _Matrix {
	static FromRows(rows: number[][]): Matrix3 {
		return new Matrix3(rows);
	}
	static FromCols(cols: number[][]): Matrix3 {
		return new Matrix3(_Matrix.Transpose(cols));
	}

	dim(): number {
		return 3;
	}

	mul(dist: Matrix3): Matrix3 {
		return Matrix3.FromRows(fn._mul(this, dist));
	}
	scalar(n: number): Matrix3 {
		return Matrix3.FromRows(fn._scalar(this, n));
	}
}

export class Matrix4 extends _Matrix {
	static FromRows(rows: number[][]): Matrix4 {
		return new Matrix4(rows);
	}
	static FromCols(cols: number[][]): Matrix4 {
		return new Matrix4(_Matrix.Transpose(cols));
	}

	dim(): number {
		return 4;
	}

	mul(dist: Matrix4): Matrix4 {
		return Matrix4.FromRows(fn._mul(this, dist));
	}
	scalar(n: number): Matrix4 {
		return Matrix4.FromRows(fn._scalar(this, n));
	}
}
