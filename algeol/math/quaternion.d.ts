import * as vc from "./vector";
import * as mx from "./matrix";
/** Quaternion - クォータニオン・四元数 */
export interface Quaternion {
    /** 取得: クォータニオンを表す配列. 生の参照を返すため破壊的変更が可能 */
    _ref(): number[];
    /** 取得: 実部[0]と虚部[1],[2],[3]からなる配列. 複製を返す */
    array(): number[];
    /** 取得: Real Part - 実部 */
    r(): number;
    /** 取得: Imaginary Part - 虚部. 長さ3 */
    i(): number[];
    /** 取得: 複製 */
    clone(): Quaternion;
    /** 単項演算: Conjugate - 共役 */
    conjugate(): Quaternion;
    /** 単項演算: 絶対値の2乗 */
    abs2(): number;
    /** 単項演算: 絶対値 */
    abs(): number;
    /** 単項演算: Additive Inverse - 加法逆元 */
    invAdd(): Quaternion;
    /** 単項演算: Multiplicative Inverse - 乗法逆元 */
    invMul(): Quaternion;
    /** 単項演算: 単位クォータニオン. 実数倍により絶対値を1にする */
    unit(): Quaternion;
    /** 変換: 3次元回転行列 */
    mx3(): mx.M3;
    /** 二項演算: 加算. 戻り値 = 自身 + 引数 */
    add(dist: Quaternion): Quaternion;
    /** 二項演算: 減算. 戻り値 = 自身 - 引数 */
    sub(dist: Quaternion): Quaternion;
    /** 二項演算: 乗算. 戻り値 = 自身 * 引数 */
    mul(dist: Quaternion): Quaternion;
    /** 二項演算: スカラー倍. 戻り値 = 自身 * 引数 */
    scalar(n: number): Quaternion;
    /** 写像: 3次元ベクトルを表す配列 -> 3次元ベクトルを表す配列 */
    map_ar(v: number[]): number[];
    /** 写像: 3次元ベクトル -> 3次元ベクトル */
    map_v3(v: vc.V3): vc.V3;
    /** 写像: 3次元ベクトルの配列 -> 3次元ベクトルの配列 */
    map_v3ar(v: vc.V3[]): vc.V3[];
}
/** (実部, 虚部[0],[1],[2]からなる配列) -> クォータニオン */
export declare function qt(real: number, imag: number[]): Quaternion;
/** (実部, 虚部, 虚部, 虚部) -> クォータニオン */
export declare function riii_qt(real: number, imag1: number, imag2: number, imag3: number): Quaternion;
/** (実部[0]と虚部[1],[2],[3]からなる配列) -> クォータニオン */
export declare function ar_qt(v: number[]): Quaternion;
