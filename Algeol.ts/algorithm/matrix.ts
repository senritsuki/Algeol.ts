/** 
 * Matrix - 行列の生成と行列演算
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as ut from './utility';
import * as vc from './vector';

/**
 * Clone - 複製
 * @param m1        行列
 * @param orderR    行数
 * @param orderC    列数
 * @return          複製された行列
 */
export function m_clone(m1: number[][], orderR: number, orderC: number): number[][] {
    const m: number[][] = new Array(orderR);
    for (let r = 0; r < orderR; r++) {
        m[r] = new Array(orderC);
        for (let c = 0; c < orderC; c++) {
            m[r][c] = m1[r][c];
        }
    }
    return m;
}

/** 二次元配列行列の転置 */
const transpose = ut.transpose;

/**
 * Addition - 加算
 */
export function m_add(m1: number[][], m2: number[][]): number[][] {
    const orderR = m1.length;
    const orderC = m1[0].length;
    const m: number[][] = new Array(orderR);
    for (let r = 0; r < orderR; r++) {
        m[r] = new Array(orderC);
        for (let c = 0; c < orderC; c++) {
            m[r][c] = m1[r][c] + m2[r][c];
        }
    }
    return m;
}
/**
 * Multiplication - 乗算
 * (左辺行列, 右辺行列) -> 左辺行列*右辺行列の乗算結果を表す2次元配列
 */
export function m_mul(m1: number[][], m2: number[][]): number[][] {
    const m2t = transpose(m2);
    const orderR = m1.length;
    const orderC = m2t.length;
    const m: number[][] = new Array(orderR);
    for (let r = 0; r < orderR; r++) {
        m[r] = new Array(orderC);
        for (let c = 0; c < orderC; c++) {
            m[r][c] = vc.ip_array(m1[r], m2t[c]);
        }
    }
    return m;
}

/**
 * スカラー倍
 */
export function m_scalar(m1: number[][], n1: number): number[][] {
    return m1.map(mm => mm.map(n0 => n0 * n1));
}

/**
 * Linear Mapping - 線形写像
 * (左辺行列, 右辺ベクトル) -> 左辺行列*右辺ベクトルの演算結果を表す配列
 */
export function m_map(m1: number[][], v1: number[]): number[] {
    const orderR = m1.length;
    const v: number[] = new Array(orderR);
    for (let i = 0; i < orderR; i++) {
        v[i] = vc.ip_array(m1[i], v1);
    }
    return v;
}


export interface MatrixCommon {
    /** 生の値. 添え字は[行番号][列番号] */
    _m: number[][];

    dim(): number;
    /** 複製された2次元配列. 添え字は[行番号][列番号] */
    array_rows(): number[][];
    /** 複製された2次元配列. 添え字は[列番号][行番号] */
    array_cols(): number[][];
}

export interface Matrix<M extends Matrix<M, V>, V extends vc.Vector<V>> extends MatrixCommon {
    /** Addition - 加算 */
    add(dist: M): M;
    /** Multiplication - 乗算 */
    mul(dist: M): M;
    /** スカラー倍 */
    scalar(n: number): M;
    /** Linear Mapping - 線形写像 */
    map(v: V|number[]): V;
}

abstract class MatrixBase<M extends Matrix<M, V>, V extends vc.Vector<V>> implements Matrix<M, V> {
    constructor(
        public _m: number[][],
        public _fm: (m: number[][]) => M,
        public _fv: (v: number[]) => V,
    ) {}

    abstract dim(): number;

    array_rows(): number[][] {
        return m_clone(this._m, this.dim(), this.dim());
    }
    array_cols(): number[][] {
        return transpose(this._m);
    }
    add(dist: M): M {
        return this._fm(m_add(this._m, dist._m));
    }
    mul(dist: M): M {
        return this._fm(m_mul(this._m, dist._m));
    }
    scalar(n: number): M {
        return this._fm(m_scalar(this._m, n));
    }
    map(v: V|number[]): V {
        const _v = vc.to_array_if_not(v);
        return this._fv(m_map(this._m, _v));
    }
}

/** Square Matrix of order 1 - 1次元正方行列 */
export interface M1 extends Matrix<M1, vc.V1> {
}

class M1Impl extends MatrixBase<M1Impl, vc.V1> implements M1 {
    constructor(rows: number[][]) {
        super(
            m_clone(rows, M1Impl.Dim, M1Impl.Dim),
            M1Impl.FromRows,
            vc.array_to_v1,
        );
    }

    static Dim = 1;
    static FromRows(rows: number[][]): M1Impl { return new M1Impl(rows); }
    static FromCols(cols: number[][]): M1Impl { return new M1Impl(transpose(cols)); }

    dim(): number {
        return M1Impl.Dim;
    }
}

/** Square Matrix of order 2 - 2次元正方行列 */
export interface M2 extends Matrix<M2, vc.V2> {
}

class M2Impl extends MatrixBase<M2Impl, vc.V2> implements M2 {
    constructor(rows: number[][]) {
        super(
            m_clone(rows, M2Impl.Dim, M2Impl.Dim),
            M2Impl.FromRows,
            vc.array_to_v2,
        );
    }

    static Dim = 2;
    static FromRows(rows: number[][]): M2Impl { return new M2Impl(rows); }
    static FromCols(cols: number[][]): M2Impl { return new M2Impl(transpose(cols)); }

    dim(): number {
        return M2Impl.Dim;
    }
}

/** Square Matrix of order 3 - 3次元正方行列 */
export interface M3 extends Matrix<M3, vc.V3> {
    map_v2(v: vc.V2|number[], w: number): vc.V2;
}

class M3Impl extends MatrixBase<M3Impl, vc.V3> implements M3 {
    constructor(rows: number[][]) {
        super(
            m_clone(rows, M3Impl.Dim, M3Impl.Dim),
            M3Impl.FromRows,
            vc.array_to_v3,
        );
    }

    static Dim = 3;
    static FromRows(rows: number[][]): M3Impl { return new M3Impl(rows); }
    static FromCols(cols: number[][]): M3Impl { return new M3Impl(transpose(cols)); }

    dim(): number {
        return M3Impl.Dim;
    }
    map_v2(v: vc.V2|number[], w: number): vc.V2 {
        const _v = vc.to_array_if_not(v);
        return vc.array_to_v2(m_map(this._m, _v.concat(w)));
    }
}

/** Square Matrix of order 4 - 4次元正方行列 */
export interface M4 extends Matrix<M4, vc.V4> {
    map_v3(v: vc.V3|number[], w: number): vc.V3;
}

class M4Impl extends MatrixBase<M4Impl, vc.V4> implements M4 {
    constructor(rows: number[][]) {
        super(
            m_clone(rows, M4Impl.Dim, M4Impl.Dim),
            M4Impl.FromRows,
            vc.array_to_v4,
        );
    }

    static Dim = 4;
    static FromRows(rows: number[][]): M4Impl { return new M4Impl(rows); }
    static FromCols(cols: number[][]): M4Impl { return new M4Impl(transpose(cols)); }

    dim(): number {
        return M4Impl.Dim;
    }
    map_v3(v: vc.V3|number[], w: number): vc.V3 {
        const _v = vc.to_array_if_not(v);
        return vc.array_to_v3(m_map(this._m, _v.concat(w)));
    }
}

/** 長さ1の2次元配列[列番号][行番号] -> 1次元正方行列 */
export const cols_to_m1 = (cols: number[][]): M1 => M1Impl.FromCols(cols);
/** 長さ1の2次元配列[行番号][列番号] -> 1次元正方行列 */
export const rows_to_m1 = (rows: number[][]): M1 => M1Impl.FromRows(rows);

/** 長さ2の2次元配列[列番号][行番号] -> 2次元正方行列 */
export const cols_to_m2 = (cols: number[][]): M2 => M2Impl.FromCols(cols);
/** 長さ2の2次元配列[行番号][列番号] -> 2次元正方行列 */
export const rows_to_m2 = (rows: number[][]): M2 => M2Impl.FromRows(rows);

/** 長さ3の2次元配列[列番号][行番号] -> 3次元正方行列 */
export const cols_to_m3 = (cols: number[][]): M3 => M3Impl.FromCols(cols);
/** 長さ3の2次元配列[行番号][列番号] -> 3次元正方行列 */
export const rows_to_m3 = (rows: number[][]): M3 => M3Impl.FromRows(rows);

/** 長さ4の2次元配列[列番号][行番号] -> 4次元正方行列 */
export const cols_to_m4 = (cols: number[][]): M4 => M4Impl.FromCols(cols);
/** 長さ4の2次元配列[行番号][列番号] -> 4次元正方行列 */
export const rows_to_m4 = (rows: number[][]): M4 => M4Impl.FromRows(rows);

export const v1cols_to_m1 = (vl: vc.V1[]): M1 => M1Impl.FromCols(vl.map(v => v._v));
export const v2cols_to_m2 = (vl: vc.V2[]): M2 => M2Impl.FromCols(vl.map(v => v._v));
export const v3cols_to_m3 = (vl: vc.V3[]): M3 => M3Impl.FromCols(vl.map(v => v._v));
export const v4cols_to_m4 = (vl: vc.V4[]): M4 => M4Impl.FromCols(vl.map(v => v._v));

/** 1次元単位正方行列 */
export const unit_m1: M1 = M1Impl.FromRows([
    [1],
]);
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
export function m2_to_m3(m2: M2, v: vc.V2|number[] = [0, 0]): M3 {
    const m3rows = m2._m.map(row => row.concat(0));
    v = vc.to_array_if_not(v);
    v = v.slice(0, 2).concat(1);
    m3rows.push(v);
    return M3Impl.FromRows(m3rows);
}
/** (3次元正方行列) -> 2次元正方行列 */
export function m3_to_m2(m3: M3): M2 {
    return M2Impl.FromRows(m3._m);
}
/** (3次元正方行列) -> 4次元正方行列 */
export function m3_to_m4(m3: M3, v: vc.V3|number[] = [0, 0, 0]): M4 {
    const m4rows = m3._m.map(row => row.concat(0));
    v = vc.to_array_if_not(v);
    v = v.slice(0, 3).concat(1);
    m4rows.push(v);
    return M4Impl.FromRows(m4rows);
}
/** (4次元正方行列) -> 3次元正方行列 */
export function m4_to_m3(m4: M4): M3 {
    return M3Impl.FromRows(m4._m);
}

/** 2次元アフィン変換 */
export function apply_affine2(m: M3, vl: vc.V2[], w: number = 1): vc.V2[] {
    return vl.map(v => vc.v3_to_v2(m.map(vc.v2_to_v3(v, w))));
}

/** 3次元アフィン変換 */
export function apply_affine3(m: M4, vl: vc.V3[], w: number = 1): vc.V3[] {
    return vl.map(v => vc.v4_to_v3(m.map(vc.v3_to_v4(v, w))));
}

/** 平行移動写像 */
export function affine2_translate(v: number[]|vc.V2): M3 {
    v = v instanceof Array ? v : v._v;
    return M3Impl.FromRows([
        [1, 0, v[0]],
        [0, 1, v[1]],
        [0, 0, 1],
    ]);
}
/** 平行移動写像 */
export function affine3_translate(v: number[]|vc.V3): M4 {
    v = v instanceof Array ? v : v._v;
    return M4Impl.FromRows([
        [1, 0, 0, v[0]],
        [0, 1, 0, v[1]],
        [0, 0, 1, v[2]],
        [0, 0, 0, 1],
    ]);
}

/** 拡大縮小写像 */
export function m2_scale(v: number[]|vc.V2): M2 {
    v = v instanceof Array ? v : v._v;
    return M2Impl.FromRows([
        [v[0], 0],
        [0, v[1]],
    ]);
}
/** 拡大縮小写像 */
export function m3_scale(v: number[]|vc.V3): M3 {
    v = v instanceof Array ? v : v._v;
    return M3Impl.FromRows([
        [v[0], 0, 0],
        [0, v[1], 0],
        [0, 0, v[2]],
    ]);
}
/** 拡大縮小写像 */
export const affine2_scale = ut.compose_2f(m2_scale, m2_to_m3);
/** 拡大縮小写像 */
export const affine3_scale = ut.compose_2f(m3_scale, m3_to_m4);

export function m2_rotate(rad: number): M2 {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return M2Impl.FromRows([
        [c, -s],
        [s, c],
    ]);
}
/** x軸回転写像 */
export function m3_rotate_x(rad: number): M3 {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return M3Impl.FromRows([
        [1, 0, 0],
        [0, c, -s],
        [0, s, c],
    ]);
}
/** y軸回転写像 */
export function m3_rotate_y(rad: number): M3 {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return M3Impl.FromRows([
        [c, 0, s],
        [0, 1, 0],
        [-s, 0, c],
    ]);
}
/** z軸回転写像 */
export function m3_rotate_z(rad: number): M3 {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return M3Impl.FromRows([
        [c, -s, 0],
        [s, c, 0],
        [0, 0, 1],
    ]);
}

export const affine2_rotate = ut.compose_2f(m2_rotate, m2_to_m3);
/** x軸回転写像 */
export const affine3_rotate_x = ut.compose_2f(m3_rotate_x, m3_to_m4);
/** y軸回転写像 */
export const affine3_rotate_y = ut.compose_2f(m3_rotate_y, m3_to_m4);
/** z軸回転写像 */
export const affine3_rotate_z = ut.compose_2f(m3_rotate_z, m3_to_m4);


/** (1, 0) を (v.x, v.y) と平行にする回転写像 */
export function rotate_z_10_to_xy(v: vc.V2|number[]): M2 {
    v = vc.to_v2_if_not(v);
    const radZ = Math.atan2(v.y, v.x);
    return m2_rotate(radZ);
}
/** (1, 0) を (v.x, v.y) と平行にする回転写像 */
export const affine2_rotate_z_10_to_xy = ut.compose_2f(rotate_z_10_to_xy, m2_to_m3);
/** (1, 0) を (v.x, v.y) と平行にする回転写像 */
export const affine3_rotate_z_10_to_xy = ut.compose_2f(affine2_rotate_z_10_to_xy, m3_to_m4);

/** (v.x, v.y) を (1, 0) と平行にする回転写像 */
export function rotate_z_xy_to_10(v: vc.V2|number[]): M2 {
    v = vc.to_v2_if_not(v);
    const radZ = Math.atan2(v.y, v.x);
    return m2_rotate(-radZ);
}
/** (v.x, v.y) を (1, 0) と平行にする回転写像 */
export const affine2_rotate_z_xy_to_10 = ut.compose_2f(rotate_z_xy_to_10, m2_to_m3);
/** (v.x, v.y) を (1, 0) と平行にする回転写像 */
export const affine3_rotate_z_xy_to_10 = ut.compose_2f(affine2_rotate_z_xy_to_10, m3_to_m4);

/** (1, 0, 0) を (v.x, v.y, v.z) と平行にする回転写像 */
export function rotate_yz_100_to_xyz(v: vc.V3|number[]): M3 {
    v = vc.to_v3_if_not(v);
    const x = v.x;
    const y = v.y;
    const z = v.z;
    const radY = -Math.atan2(z, Math.sqrt(x * x + y * y));
    const radZ = Math.atan2(y, x);
    const mxRotY = m3_rotate_y(radY);
    const mxRotZ = m3_rotate_z(radZ);
    return mxRotZ.mul(mxRotY);
}
/** (1, 0) を (v.x, v.y) と平行にする回転写像 */
export const affine3_rotate_yz_100_to_xyz = ut.compose_2f(rotate_yz_100_to_xyz, m3_to_m4);

/** (0, 1) を (v.x, v.y) と平行にする回転写像 */
export function rotate_yz_010_to_xyz(v: vc.V3|number[]): M3 {
    v = vc.to_v3_if_not(v);
    const x = v.x;
    const y = v.y;
    const z = v.z;
    const radY = ut.deg90 - Math.atan2(z, Math.sqrt(x * x + y * y));
    const radZ = Math.atan2(y, x);
    const mxRotY = m3_rotate_y(radY);
    const mxRotZ = m3_rotate_z(radZ);
    return mxRotZ.mul(mxRotY);
}
/** (0, 1) を (v.x, v.y) と平行にする回転写像 */
export const affine3_rotate_yz_010_to_xyz = ut.compose_2f(rotate_yz_010_to_xyz, m3_to_m4);


/** オイラー角XYZの回転写像 */
export function rot_xyz_m3(rad_xyz: [number, number, number]): M3 {
    return m3_rotate_x(rad_xyz[0])
        .mul(m3_rotate_y(rad_xyz[1]))
        .mul(m3_rotate_z(rad_xyz[2]));
}
/** オイラー角XYZの回転写像 */
export const rot_xyz_m4 = ut.compose_2f(rot_xyz_m3, m3_to_m4);

/** オイラー角XYZの逆回転写像 */
export function rot_inv_xyz_m3(rad_xyz: [number, number, number]): M3 {
    return m3_rotate_z(-rad_xyz[2])
        .mul(m3_rotate_y(-rad_xyz[1]))
        .mul(m3_rotate_x(-rad_xyz[0]));
}
/** オイラー角XYZの回転写像 */
export const rot_inv_xyz_m4 = ut.compose_2f(rot_inv_xyz_m3, m3_to_m4);


/** 行列合成 reduce((a, b) => mul(b, a)) */
export function compose<T extends Matrix<T, V>, V extends vc.Vector<V>>(mm: T[]): T {
    return mm.reduce((a, b) => b.mul(a));
}
/** 行列合成 reduce((a, b) => mul(a, b)) */
export function compose_rev<T extends Matrix<T, V>, V extends vc.Vector<V>>(mm: T[]): T {
    return mm.reduce((a, b) => a.mul(b));
}


/** ビュー変換行列 */
export function camera_matrix(pos: vc.V3, dir_front: vc.V3, dir_head: vc.V3): M4 {
    const dir_x = dir_front.cp(dir_head).unit();
    const dir_y = dir_front.unit();
    const dir_z = dir_head.unit();
    const m3 = M3Impl.FromRows([dir_x._v, dir_y._v, dir_z._v]);
    const m4 = m3_to_m4(m3, pos);
    return m4;
}

export function rodrigues_K(axis: vc.V3): M3 {
    const k = axis.unit();
    return rows_to_m3([
        [0, -k.z, k.y],
        [k.z, 0, -k.x],
        [-k.y, k.x, 0],
    ]);
}

/**
 * Rodrigues' rotation formula
 * https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
 */
export function rodrigues_m3(axis: vc.V3, rad: number): M3 {
    const k = rodrigues_K(axis);
    const k2 = k.mul(k);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return unit_m3.add(k.scalar(sin)).add(k2.scalar(1 - cos));
}

export function rodrigues_m4(axis: vc.V3, rad: number): M4 {
    return m3_to_m4(rodrigues_m3(axis, rad));
}
