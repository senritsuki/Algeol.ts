// Square Matrix 正方行列

import * as ut from "./utility";
import * as vc from "./vector";

export namespace fn {
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

namespace priv {
    export class M2Impl implements M2 {
        static Dim = 2;

        _m: number[][];

        constructor(rows: number[][]) {
            this._m = fn.clone(rows, M2Impl.Dim, M2Impl.Dim);
        }

        static FromRows(rows: number[][]): M2Impl { return new M2Impl(rows); }
        static FromCols(cols: number[][]): M2Impl { return new M2Impl(fn.transpose(cols)); }

        array_rows(): number[][] {
            return fn.clone(this._m, M2Impl.Dim, M2Impl.Dim);
        }
        array_cols(): number[][] {
            return fn.transpose(this._m);
        }
        mul(dist: M2): M2 {
            return M2Impl.FromRows(fn.mul(this._m, dist._m));
        }
        map_v2(v: vc.V2): vc.V2 {
            return vc.array_to_v2(fn.map(this._m, v._v));
        }
    }

    export class M3Impl implements M3 {
        static Dim = 3;

        _m: number[][];

        constructor(rows: number[][]) {
            this._m = fn.clone(rows, M3Impl.Dim, M3Impl.Dim);
        }

        static FromRows(rows: number[][]): M3Impl { return new M3Impl(rows); }
        static FromCols(cols: number[][]): M3Impl { return new M3Impl(fn.transpose(cols)); }

        array_rows(): number[][] {
            return fn.clone(this._m, M3Impl.Dim, M3Impl.Dim);
        }
        array_cols(): number[][] {
            return fn.transpose(this._m);
        }
        mul(dist: M3): M3 {
            return M3Impl.FromRows(fn.mul(this._m, dist._m));
        }
        map_v3(v: vc.V3): vc.V3 {
            return vc.array_to_v3(fn.map(this._m, v._v));
        }
    }

    export class M4Impl implements M4 {
        static Dim = 4;

        _m: number[][];

        constructor(rows: number[][]) {
            this._m = fn.clone(rows, M4Impl.Dim, M4Impl.Dim);
        }

        static FromRows(rows: number[][]): M4Impl { return new M4Impl(rows); }
        static FromCols(cols: number[][]): M4Impl { return new M4Impl(fn.transpose(cols)); }

        array_rows(): number[][] {
            return fn.clone(this._m, M4Impl.Dim, M4Impl.Dim);
        }
        array_cols(): number[][] {
            return fn.transpose(this._m);
        }
        mul(dist: M4): M4 {
            return M4Impl.FromRows(fn.mul(this._m, dist._m));
        }
        map_v3(v: vc.V3, w: number): vc.V3 {
            return vc.array_to_v3(fn.map(this._m, v._v.concat(w)));
        }
        map_v4(v: vc.V4): vc.V4 {
            return vc.array_to_v4(fn.map(this._m, v._v));
        }
    }
}

/** Square Matrix of order 2 - 2次元正方行列 */
export interface M2 {
    /** 生の値. 添え字は[行番号][列番号] */
    _m: number[][];

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
    map_v2(v: vc.V2): vc.V2;
}

/** Square Matrix of order 3 - 3次元正方行列 */
export interface M3 {
    /** 生の値. 添え字は[行番号][列番号] */
    _m: number[][];

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
    map_v3(v: vc.V3): vc.V3;
}

/** Square Matrix of order 4 - 4次元正方行列 */
export interface M4 {
    /** 生の値. 添え字は[行番号][列番号] */
    _m: number[][];

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
        (3次元ベクトル, 補完w成分) -> 変換後の3次元ベクトル */
    map_v3(v: vc.V3, w: number): vc.V3;
    /** Linear Mapping - 線形写像
        (右辺ベクトル) -> 自身の行列*右辺ベクトルの演算結果を表すベクトル */
    map_v4(v: vc.V4): vc.V4;
}


/** ([列番号][行番号]と表される2次元配列) -> 2次元正方行列オブジェクト */
export const cols_to_m2 = (cols: number[][]): M2 => priv.M2Impl.FromCols(cols);
/** ([行番号][列番号]と表される2次元配列) -> 2次元正方行列オブジェクト */
export const rows_to_m2 = (rows: number[][]): M2 => priv.M2Impl.FromRows(rows);

/** ([列番号][行番号]と表される2次元配列) -> 3次元正方行列オブジェクト */
export const cols_to_m3 = (cols: number[][]): M3 => priv.M3Impl.FromCols(cols);
/** ([行番号][列番号]と表される2次元配列) -> 3次元正方行列オブジェクト */
export const rows_to_m3 = (rows: number[][]): M3 => priv.M3Impl.FromRows(rows);

/** ([列番号][行番号]と表される2次元配列) -> 4次元正方行列オブジェクト */
export const cols_to_m4 = (cols: number[][]): M4 => priv.M4Impl.FromCols(cols);
/** ([行番号][列番号]と表される2次元配列) -> 4次元正方行列オブジェクト */
export const rows_to_m4 = (rows: number[][]): M4 => priv.M4Impl.FromRows(rows);

export const v2cols_to_m2 = (vl: vc.V2[]): M2 => priv.M2Impl.FromCols(vl.map(v => v._v));
export const v3cols_to_m3 = (vl: vc.V3[]): M3 => priv.M3Impl.FromCols(vl.map(v => v._v));
export const v4cols_to_m4 = (vl: vc.V4[]): M4 => priv.M4Impl.FromCols(vl.map(v => v._v));

/** 2次元単位正方行列 */
export const unit_m2: M2 = priv.M2Impl.FromRows([
    [1, 0],
    [0, 1],
]);
/** 2次元単位正方行列 */
export const unit_m3: M3 = priv.M3Impl.FromRows([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
]);
/** 4次元単位正方行列 */
export const unit_m4: M4 = priv.M4Impl.FromRows([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
]);

/** (2次元正方行列) -> 3次元正方行列 */
export function m2_m3(m2: M2): M3 {
    const m3rows = m2._m.map(row => row.concat(0));
    m3rows.push([0, 0, 1]);
    return priv.M3Impl.FromRows(m3rows);
}
/** (3次元正方行列) -> 2次元正方行列 */
export function m3_m2(m3: M3): M2 {
    return priv.M2Impl.FromRows(m3._m);
}
/** (3次元正方行列) -> 4次元正方行列 */
export function m3_m4(m3: M3): M4 {
    const m4rows = m3._m.map(row => row.concat(0));
    m4rows.push([0, 0, 0, 1]);
    return priv.M4Impl.FromRows(m4rows);
}
/** (4次元正方行列) -> 3次元正方行列 */
export function m4_m3(m4: M4): M3 {
    return priv.M3Impl.FromRows(m4._m);
}

/** 3次元ベクトル配列に対するアフィン写像
    (3次元ベクトル配列, 4次元正方行列, 4次元ベクトルのw成分) -> 変換後の3次元正方行列 */
export function map_m4_v3(vl: vc.V3[], m4: M4, w: number = 1): vc.V3[] {
    return vl.map(v => vc.v4_to_v3(m4.map_v4(vc.v3_to_v4(v, w))));
}

/** 平行移動写像 */
export function trans_m4(x: number, y: number, z: number): M4 {
    return priv.M4Impl.FromRows([
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
export function scale_m3(x: number, y: number, z: number): M3 {
    return priv.M3Impl.FromRows([
        [x, 0, 0],
        [0, y, 0],
        [0, 0, z],
    ]);
}
/** 拡大縮小写像 */
export function scale_m4(x: number, y: number, z: number): M4 {
    return m3_m4(scale_m3(x, y, z));
}
/** 拡大縮小写像 */
export function scale_v3_m3(v3: vc.V3): M3 {
    return scale_m3(v3.x(), v3.y(), v3.z());
}
/** 拡大縮小写像 */
export function scale_v3_m4(v3: vc.V3): M4 {
    return m3_m4(scale_v3_m3(v3));
}

/** x軸回転写像 */
export function rotX_m3(rad: number): M3 {
    const c = ut.cos(rad);
    const s = ut.sin(rad);
    return priv.M3Impl.FromRows([
        [1, 0, 0],
        [0, c, -s],
        [0, s, c],
    ]);
}
/** x軸回転写像 */
export function rotX_m4(rad: number): M4 {
    return m3_m4(rotX_m3(rad));
}

/** y軸回転写像 */
export function rotY_m3(rad: number): M3 {
    const c = ut.cos(rad);
    const s = ut.sin(rad);
    return priv.M3Impl.FromRows([
        [c, 0, s],
        [0, 1, 0],
        [-s, 0, c],
    ]);
}
/** y軸回転写像 */
export function rotY_m4(rad: number): M4 {
    return m3_m4(rotY_m3(rad));
}

/** z軸回転写像 */
export function rotZ_m3(rad: number): M3 {
    const c = ut.cos(rad);
    const s = ut.sin(rad);
    return priv.M3Impl.FromRows([
        [c, -s, 0],
        [s, c, 0],
        [0, 0, 1],
    ]);
}
/** z軸回転写像 */
export function rotZ_m4(rad: number): M4 {
    return m3_m4(rotZ_m3(rad));
}

/** x軸ベクトルをv3ベクトルと平行にする回転写像 */
export function rotYZ_x_m3(v3: vc.V3): M3 {
    const x = v3.x();
    const y = v3.y();
    const z = v3.z();
    const radY = -ut.atan2(z, ut.sqrt(x * x + y * y));
    const radZ = ut.atan2(y, x);
    const mxRotY = rotY_m3(radY);
    const mxRotZ = rotZ_m3(radZ);
    return mxRotZ.mul(mxRotY);
}
/** x軸ベクトルをv3ベクトルと平行にする回転写像 */
export function rotYZ_x_m4(v3: vc.V3): M4 {
    return m3_m4(rotYZ_x_m3(v3));
}

/** z軸ベクトルをv3ベクトルと平行にする回転写像 */
export function rotYZ_z_m3(v3: vc.V3): M3 {
    const x = v3.x();
    const y = v3.y();
    const z = v3.z();
    const radY = ut.deg90 - ut.atan2(z, ut.sqrt(x * x + y * y));
    const radZ = ut.atan2(y, x);
    const mxRotY = rotY_m3(radY);
    const mxRotZ = rotZ_m3(radZ);
    return mxRotZ.mul(mxRotY);
}
/** z軸ベクトルをv3ベクトルと平行にする回転写像 */
export function rotYZ_z_m4(v3: vc.V3): M4 {
    return m3_m4(rotYZ_z_m3(v3));
}


/** オイラー角XYZの回転写像 */
export function rotXYZ_m3(radX: number, radY: number, radZ: number): M3 {
    return rotX_m3(radX)
        .mul(rotY_m3(radY))
        .mul(rotZ_m3(radZ));
}
/** オイラー角XYZの回転写像 */
export function rotXYZ_m4(radX: number, radY: number, radZ: number): M4 {
    return m3_m4(rotXYZ_m3(radX, radY, radZ));
}

/** オイラー角XYZの逆回転写像 */
export function rotInvXYZ_m3(radX: number, radY: number, radZ: number): M3 {
    return rotZ_m3(-radZ)
        .mul(rotY_m3(-radY))
        .mul(rotX_m3(-radX));
}
/** オイラー角XYZの回転写像 */
export function rotInvXYZ_m4(radX: number, radY: number, radZ: number): M4 {
    return m3_m4(rotInvXYZ_m3(radX, radY, radZ));
}


export function compositeLeft_m2(mm: M2[]): M2 {
    return mm.reduce((a, b) => b.mul(a));
}
export function compositeLeft_m3(mm: M3[]): M3 {
    return mm.reduce((a, b) => b.mul(a));
}
export function compositeLeft_m4(mm: M4[]): M4 {
    return mm.reduce((a, b) => b.mul(a));
}

