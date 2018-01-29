// Square Matrix 正方行列

import * as ut from "./utility";
import * as vc from "./vector";

/**
 * Clone - 複製
 * @param m1        行列
 * @param orderR    行数
 * @param orderC    列数
 * @return          複製された行列
 */
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
            m[r][c] = vc.ip(m1[r], m2t[c]);
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
        v[i] = vc.ip(m1[i], v1);
    }
    return v;
}


export interface Matrix<M extends Matrix<M, V>, V extends vc.Vector<V>> {
    /** 生の値. 添え字は[行番号][列番号] */
    _m: number[][];

    /** 複製された2次元配列. 添え字は[行番号][列番号] */
    array_rows(): number[][];
    /** 複製された2次元配列. 添え字は[列番号][行番号] */
    array_cols(): number[][];

    /** Multiplication - 乗算 */
    mul(dist: M): M;
    /** Linear Mapping - 線形写像 */
    map(v: V): V;
}

/** Square Matrix of order 2 - 2次元正方行列 */
export interface M2 extends Matrix<M2Impl, vc.V2> {
}

class M2Impl implements M2 {
    static Dim = 2;

    _m: number[][];

    constructor(rows: number[][]) {
        this._m = clone(rows, M2Impl.Dim, M2Impl.Dim);
    }

    static FromRows(rows: number[][]): M2Impl { return new M2Impl(rows); }
    static FromCols(cols: number[][]): M2Impl { return new M2Impl(transpose(cols)); }

    array_rows(): number[][] {
        return clone(this._m, M2Impl.Dim, M2Impl.Dim);
    }
    array_cols(): number[][] {
        return transpose(this._m);
    }
    mul(dist: M2Impl): M2Impl {
        return M2Impl.FromRows(mul(this._m, dist._m));
    }
    map(v: vc.V2): vc.V2 {
        return vc.array_to_v2(map(this._m, v._v));
    }
}

/** Square Matrix of order 3 - 3次元正方行列 */
export interface M3 extends Matrix<M3Impl, vc.V3> {
}

class M3Impl implements M3 {
    static Dim = 3;

    _m: number[][];

    constructor(rows: number[][]) {
        this._m = clone(rows, M3Impl.Dim, M3Impl.Dim);
    }

    static FromRows(rows: number[][]): M3Impl { return new M3Impl(rows); }
    static FromCols(cols: number[][]): M3Impl { return new M3Impl(transpose(cols)); }

    array_rows(): number[][] {
        return clone(this._m, M3Impl.Dim, M3Impl.Dim);
    }
    array_cols(): number[][] {
        return transpose(this._m);
    }
    mul(dist: M3Impl): M3Impl {
        return M3Impl.FromRows(mul(this._m, dist._m));
    }
    map(v: vc.V3): vc.V3 {
        return vc.array_to_v3(map(this._m, v._v));
    }
}

/** Square Matrix of order 4 - 4次元正方行列 */
export interface M4 extends Matrix<M4Impl, vc.V4> {
    map_v3(v: vc.V3, w: number): vc.V3;
}

class M4Impl implements M4 {
    static Dim = 4;

    _m: number[][];

    constructor(rows: number[][]) {
        this._m = clone(rows, M4Impl.Dim, M4Impl.Dim);
    }

    static FromRows(rows: number[][]): M4Impl { return new M4Impl(rows); }
    static FromCols(cols: number[][]): M4Impl { return new M4Impl(transpose(cols)); }

    array_rows(): number[][] {
        return clone(this._m, M4Impl.Dim, M4Impl.Dim);
    }
    array_cols(): number[][] {
        return transpose(this._m);
    }
    mul(dist: M4Impl): M4Impl {
        return M4Impl.FromRows(mul(this._m, dist._m));
    }
    map(v: vc.V4): vc.V4 {
        return vc.array_to_v4(map(this._m, v._v));
    }
    map_v3(v: vc.V3, w: number): vc.V3 {
        return vc.array_to_v3(map(this._m, v._v.concat(w)));
    }
}


/** ([列番号][行番号]と表される2次元配列) -> 2次元正方行列オブジェクト */
export const cols_to_m2 = (cols: number[][]): M2 => M2Impl.FromCols(cols);
/** ([行番号][列番号]と表される2次元配列) -> 2次元正方行列オブジェクト */
export const rows_to_m2 = (rows: number[][]): M2 => M2Impl.FromRows(rows);

/** ([列番号][行番号]と表される2次元配列) -> 3次元正方行列オブジェクト */
export const cols_to_m3 = (cols: number[][]): M3 => M3Impl.FromCols(cols);
/** ([行番号][列番号]と表される2次元配列) -> 3次元正方行列オブジェクト */
export const rows_to_m3 = (rows: number[][]): M3 => M3Impl.FromRows(rows);

/** ([列番号][行番号]と表される2次元配列) -> 4次元正方行列オブジェクト */
export const cols_to_m4 = (cols: number[][]): M4 => M4Impl.FromCols(cols);
/** ([行番号][列番号]と表される2次元配列) -> 4次元正方行列オブジェクト */
export const rows_to_m4 = (rows: number[][]): M4 => M4Impl.FromRows(rows);

export const v2cols_to_m2 = (vl: vc.V2[]): M2 => M2Impl.FromCols(vl.map(v => v._v));
export const v3cols_to_m3 = (vl: vc.V3[]): M3 => M3Impl.FromCols(vl.map(v => v._v));
export const v4cols_to_m4 = (vl: vc.V4[]): M4 => M4Impl.FromCols(vl.map(v => v._v));

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
    const m3rows = m2._m.map(row => row.concat(0));
    m3rows.push([0, 0, 1]);
    return M3Impl.FromRows(m3rows);
}
/** (3次元正方行列) -> 2次元正方行列 */
export function m3_m2(m3: M3): M2 {
    return M2Impl.FromRows(m3._m);
}
/** (3次元正方行列) -> 4次元正方行列 */
export function m3_m4(m3: M3): M4 {
    const m4rows = m3._m.map(row => row.concat(0));
    m4rows.push([0, 0, 0, 1]);
    return M4Impl.FromRows(m4rows);
}
/** (4次元正方行列) -> 3次元正方行列 */
export function m4_m3(m4: M4): M3 {
    return M3Impl.FromRows(m4._m);
}

/** 3次元ベクトル配列に対するアフィン写像
    (3次元ベクトル配列, 4次元正方行列, 4次元ベクトルのw成分) -> 変換後の3次元正方行列 */
export function map_m4_v3(vl: vc.V3[], m4: M4, w: number = 1): vc.V3[] {
    return vl.map(v => vc.v4_to_v3(m4.map(vc.v3_to_v4(v, w))));
}

/** 平行移動写像 */
export function trans_m4(v: number[]|vc.V3): M4 {
    v = v instanceof Array ? v : v._v;
    return M4Impl.FromRows([
        [1, 0, 0, v[0]],
        [0, 1, 0, v[1]],
        [0, 0, 1, v[2]],
        [0, 0, 0, 1],
    ]);
}
/** 平行移動写像 */
export function trans_v3_m4(v3: vc.V3): M4 {
    return trans_m4(v3);
}

/** 拡大縮小写像 */
export function scale_m3(v: number[]|vc.V3): M3 {
    v = v instanceof Array ? v : v._v;
    return M3Impl.FromRows([
        [v[0], 0, 0],
        [0, v[1], 0],
        [0, 0, v[2]],
    ]);
}
/** 拡大縮小写像 */
export function scale_m4(v: number[]|vc.V3): M4 {
    return m3_m4(scale_m3(v));
}

/** x軸回転写像 */
export function rot_x_m3(rad: number): M3 {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return M3Impl.FromRows([
        [1, 0, 0],
        [0, c, -s],
        [0, s, c],
    ]);
}
/** x軸回転写像 */
export function rot_x_m4(rad: number): M4 {
    return m3_m4(rot_x_m3(rad));
}

/** y軸回転写像 */
export function rot_y_m3(rad: number): M3 {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return M3Impl.FromRows([
        [c, 0, s],
        [0, 1, 0],
        [-s, 0, c],
    ]);
}
/** y軸回転写像 */
export function rot_y_m4(rad: number): M4 {
    return m3_m4(rot_y_m3(rad));
}

/** z軸回転写像 */
export function rot_z_m3(rad: number): M3 {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return M3Impl.FromRows([
        [c, -s, 0],
        [s, c, 0],
        [0, 0, 1],
    ]);
}
/** z軸回転写像 */
export function rot_z_m4(rad: number): M4 {
    return m3_m4(rot_z_m3(rad));
}

/** x軸ベクトルをv3ベクトルと平行にする回転写像 */
export function rot_yz_x_m3(v3: vc.V3): M3 {
    const x = v3.x;
    const y = v3.y;
    const z = v3.z;
    const radY = -Math.atan2(z, Math.sqrt(x * x + y * y));
    const radZ = Math.atan2(y, x);
    const mxRotY = rot_y_m3(radY);
    const mxRotZ = rot_z_m3(radZ);
    return mxRotZ.mul(mxRotY);
}
/** x軸ベクトルをv3ベクトルと平行にする回転写像 */
export function rot_yz_x_m4(v3: vc.V3): M4 {
    return m3_m4(rot_yz_x_m3(v3));
}

/** z軸ベクトルをv3ベクトルと平行にする回転写像 */
export function rot_yz_z_m3(v3: vc.V3): M3 {
    const x = v3.x;
    const y = v3.y;
    const z = v3.z;
    const radY = ut.deg90 - Math.atan2(z, Math.sqrt(x * x + y * y));
    const radZ = Math.atan2(y, x);
    const mxRotY = rot_y_m3(radY);
    const mxRotZ = rot_z_m3(radZ);
    return mxRotZ.mul(mxRotY);
}
/** z軸ベクトルをv3ベクトルと平行にする回転写像 */
export function rot_yz_z_m4(v3: vc.V3): M4 {
    return m3_m4(rot_yz_z_m3(v3));
}


/** オイラー角XYZの回転写像 */
export function rot_xyz_m3(radX: number, radY: number, radZ: number): M3 {
    return rot_x_m3(radX)
        .mul(rot_y_m3(radY))
        .mul(rot_z_m3(radZ));
}
/** オイラー角XYZの回転写像 */
export function rot_xyz_m4(radX: number, radY: number, radZ: number): M4 {
    return m3_m4(rot_xyz_m3(radX, radY, radZ));
}

/** オイラー角XYZの逆回転写像 */
export function rot_inv_xyz_m3(radX: number, radY: number, radZ: number): M3 {
    return rot_z_m3(-radZ)
        .mul(rot_y_m3(-radY))
        .mul(rot_x_m3(-radX));
}
/** オイラー角XYZの回転写像 */
export function rot_inv_xyz_m4(radX: number, radY: number, radZ: number): M4 {
    return m3_m4(rot_inv_xyz_m3(radX, radY, radZ));
}


/** 行列を合成する */
export function compose<T extends Matrix<T, V>, V extends vc.Vector<V>>(mm: T[]): T {
    return mm.reduce((a, b) => b.mul(a));
}
/** 行列を逆順に合成する */
export function compose_rev<T extends Matrix<T, V>, V extends vc.Vector<V>>(mm: T[]): T {
    return mm.reduce((a, b) => a.mul(b));
}

