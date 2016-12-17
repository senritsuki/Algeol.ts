import * as vc from "./vector";
export declare namespace fn {
    /** Clone - 複製
        (行列, 行数, 列数) -> 行列の複製結果を表す2次元配列 */
    function clone(m1: number[][], orderR: number, orderC: number): number[][];
    /** Transpose - 転置
        (行列) -> 行列の転置結果を表す2次元配列 */
    function transpose(m1: number[][]): number[][];
    /** Multiplication - 乗算
        (左辺行列, 右辺行列) -> 左辺行列*右辺行列の乗算結果を表す2次元配列 */
    function mul(m1: number[][], m2: number[][]): number[][];
    /** Scalar Product - スカラー倍
        (行列, スカラー値) -> 行列*スカラー値の乗算結果を表す2次元配列 */
    function scalar(m1: number[][], n: number): number[][];
    /** Linear Mapping - 線形写像
        (左辺行列, 右辺ベクトル) -> 左辺行列*右辺ベクトルの演算結果を表す配列 */
    function map(m1: number[][], v1: number[]): number[];
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
    map_v2(v: vc.V2): vc.V2;
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
    map_v3(v: vc.V3): vc.V3;
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
        (3次元ベクトル, 補完w成分) -> 変換後の3次元ベクトル */
    map_v3(v: vc.V3, w: number): vc.V3;
    /** Linear Mapping - 線形写像
        (右辺ベクトル) -> 自身の行列*右辺ベクトルの演算結果を表すベクトル */
    map_v4(v: vc.V4): vc.V4;
}
/** ([列番号][行番号]と表される2次元配列) -> 2次元正方行列オブジェクト */
export declare function cols_m2(cols: number[][]): M2;
/** ([行番号][列番号]と表される2次元配列) -> 2次元正方行列オブジェクト */
export declare function rows_m2(rows: number[][]): M2;
/** ([列番号][行番号]と表される2次元配列) -> 3次元正方行列オブジェクト */
export declare function cols_m3(cols: number[][]): M3;
/** ([行番号][列番号]と表される2次元配列) -> 3次元正方行列オブジェクト */
export declare function rows_m3(rows: number[][]): M3;
/** ([列番号][行番号]と表される2次元配列) -> 4次元正方行列オブジェクト */
export declare function cols_m4(cols: number[][]): M4;
/** ([行番号][列番号]と表される2次元配列) -> 4次元正方行列オブジェクト */
export declare function rows_m4(rows: number[][]): M4;
export declare function v2cols_m2(vl: vc.V2[]): M2;
export declare function v3cols_m3(vl: vc.V3[]): M3;
export declare function v4cols_m4(vl: vc.V4[]): M4;
/** 2次元単位正方行列 */
export declare const unit_m2: M2;
/** 2次元単位正方行列 */
export declare const unit_m3: M3;
/** 4次元単位正方行列 */
export declare const unit_m4: M4;
/** (2次元正方行列) -> 3次元正方行列 */
export declare function m2_m3(m2: M2): M3;
/** (3次元正方行列) -> 2次元正方行列 */
export declare function m3_m2(m3: M3): M2;
/** (3次元正方行列) -> 4次元正方行列 */
export declare function m3_m4(m3: M3): M4;
/** (4次元正方行列) -> 3次元正方行列 */
export declare function m4_m3(m4: M4): M3;
/** 3次元ベクトル配列に対するアフィン写像
    (3次元ベクトル配列, 4次元正方行列, 4次元ベクトルのw成分) -> 変換後の3次元正方行列 */
export declare function map_m4_v3(vl: vc.V3[], m4: M4, w?: number): vc.V3[];
/** 平行移動写像 */
export declare function trans_m4(x: number, y: number, z: number): M4;
/** 平行移動写像 */
export declare function trans_v3_m4(v3: vc.V3): M4;
/** 拡大縮小写像 */
export declare function scale_m3(x: number, y: number, z: number): M3;
/** 拡大縮小写像 */
export declare function scale_m4(x: number, y: number, z: number): M4;
/** 拡大縮小写像 */
export declare function scale_v3_m3(v3: vc.V3): M3;
/** 拡大縮小写像 */
export declare function scale_v3_m4(v3: vc.V3): M4;
/** x軸回転写像 */
export declare function rotX_m3(rad: number): M3;
/** x軸回転写像 */
export declare function rotX_m4(rad: number): M4;
/** y軸回転写像 */
export declare function rotY_m3(rad: number): M3;
/** y軸回転写像 */
export declare function rotY_m4(rad: number): M4;
/** z軸回転写像 */
export declare function rotZ_m3(rad: number): M3;
/** z軸回転写像 */
export declare function rotZ_m4(rad: number): M4;
/** x軸ベクトルをv3ベクトルと平行にする回転写像 */
export declare function rotYZ_x_m3(v3: vc.V3): M3;
/** x軸ベクトルをv3ベクトルと平行にする回転写像 */
export declare function rotYZ_x_m4(v3: vc.V3): M4;
/** z軸ベクトルをv3ベクトルと平行にする回転写像 */
export declare function rotYZ_z_m3(v3: vc.V3): M3;
/** z軸ベクトルをv3ベクトルと平行にする回転写像 */
export declare function rotYZ_z_m4(v3: vc.V3): M4;
