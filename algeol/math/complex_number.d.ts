import * as vc from "./vector";
/** Complex Number - 複素数・二元数 */
export interface ComplexNumber {
    /** 取得: 実部[0]と虚部[1]からなる配列. 生の参照を返すため破壊的変更が可能 */
    _ref(): number[];
    /** 取得: 実部[0]と虚部[1]からなる配列. 複製を返す */
    array(): number[];
    /** 取得: Real Part - 実部 */
    r(): number;
    /** 取得: Imaginary Part - 虚部 */
    i(): number;
    /** 取得: 複製 */
    clone(): ComplexNumber;
    /** 単項演算: Conjugate - 共役 */
    conjugate(): ComplexNumber;
    /** 単項演算: 絶対値の2乗 */
    abs2(): number;
    /** 単項演算: 絶対値 */
    abs(): number;
    /** 単項演算: 極形式における偏角(radian) */
    polarRad(): number;
    /** 単項演算: Additive Inverse - 加法逆元 */
    invAdd(): ComplexNumber;
    /** 単項演算: Multiplicative Inverse - 乗法逆元 */
    invMul(): ComplexNumber;
    /** 単項演算: 単位複素数. 実数倍により絶対値を1にする */
    unit(): ComplexNumber;
    /** 変換: 実部xと虚部yからなる2次元ベクトル */
    v2(): vc.V2;
    /** 二項演算: 加算. 戻り値 = 自身 + 引数 */
    add(dist: ComplexNumber): ComplexNumber;
    /** 二項演算: 減算. 戻り値 = 自身 - 引数 */
    sub(dist: ComplexNumber): ComplexNumber;
    /** 二項演算: 乗算. 戻り値 = 自身 * 引数 */
    mul(dist: ComplexNumber): ComplexNumber;
    /** 二項演算: スカラー倍. 戻り値 = 自身 * 引数 */
    scalar(n: number): ComplexNumber;
    /** 写像: 2次元ベクトルを表す配列 -> 2次元ベクトルを表す配列 */
    map_ar(v: number[]): number[];
    /** 写像: 2次元ベクトル -> 2次元ベクトル */
    map_v2(v: vc.V2): vc.V2;
    /** 写像: 2次元ベクトルの配列 -> 2次元ベクトルの配列 */
    map_v2ar(v: vc.V2[]): vc.V2[];
}
/** (実部, 虚部) -> 複素数 */
export declare function ri_cn(real: number, imag: number): ComplexNumber;
/** (実部[0]と虚部[1]からなる配列) -> 複素数 */
export declare function ar_cn(v: number[]): ComplexNumber;
/** (実部xと虚部yからなる2次元ベクトル) -> 複素数 */
export declare function v2_cn(v: vc.V2): ComplexNumber;
/** (極形式の長さ, 極形式の偏角(radian)) -> 複素数 */
export declare function polar_cn(r: number, rad: number): ComplexNumber;
