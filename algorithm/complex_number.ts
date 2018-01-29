// Complex Number - 複素数・二元数

import * as vc from "./vector";


/** Complex Number - 複素数・二元数 */
export interface ComplexNumber {
    /** 生の値. 実部[0]と虚部[1]からなる配列 */
    _v: number[];

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

class ComplexNumberImpl implements ComplexNumber {
    /** 複素数を表す配列 */
    _v: number[];

    constructor(
        real: number,
        imag: number
    ) {
        this._v = [real, imag];
    }

    // 取得

    array(): number[] {
        return this._v.slice(0);
    }
    r(): number {
        return this._v[0];
    }
    i(): number {
        return this._v[1];
    }
    clone(): ComplexNumber {
        return new ComplexNumberImpl(this.r(), this.i());
    }

    // 単項演算

    conjugate(): ComplexNumber {
        return new ComplexNumberImpl(this.r(), -this.i());
    }
    abs2(): number {
        return vc.ip(this._v, this._v);
    }
    abs(): number {
        return Math.sqrt(this.abs2());
    }
    polarRad(): number {
        return Math.atan2(this.i(), this.r());
    }
    invAdd(): ComplexNumber {
        return this.scalar(-1);
    }
    invMul(): ComplexNumber {
        return this.conjugate().scalar(1 / this.abs2());
    }
    unit(): ComplexNumber {
        return this.scalar(1 / this.abs());
    }

    // 変換

    v2(): vc.V2 {
        return vc.v2(this.r(), this.i());
    }
    
    // 二項演算

    add(dist: ComplexNumber): ComplexNumber {
        const v = vc.add(this._v, dist._v);
        return new ComplexNumberImpl(v[0], v[1]);
    }
    sub(dist: ComplexNumber): ComplexNumber {
        const v = vc.sub(this._v, dist._v);
        return new ComplexNumberImpl(v[0], v[1]);
    }
    mul(dist: ComplexNumber): ComplexNumber {
        const r = this.r() * dist.r() - this.i() * dist.i();
        const i = this.r() * dist.i() + this.r() * dist.i();
        return new ComplexNumberImpl(r, i);
    }
    scalar(n: number): ComplexNumber {
        const v = vc.scalar(this._v, n);
        return new ComplexNumberImpl(v[0], v[1]);
    }

    // 写像

    map_ar(v: number[]): number[] {
        return this.mul(new ComplexNumberImpl(v[0], v[1])).array();
    }
    map_v2(v: vc.V2): vc.V2 {
        return this.mul(new ComplexNumberImpl(v.x, v.y)).v2();
    }
    map_v2ar(vl: vc.V2[]): vc.V2[] {
        return vl.map(v => this.map_v2(v));
    }
}

/** (実部, 虚部) -> 複素数 */
export function ri_cn(real: number, imag: number): ComplexNumber {
    return new ComplexNumberImpl(real, imag);
}
/** (実部[0]と虚部[1]からなる配列) -> 複素数 */
export function ar_cn(v: number[]): ComplexNumber {
    return new ComplexNumberImpl(v[0], v[1]);
}
/** (実部xと虚部yからなる2次元ベクトル) -> 複素数 */
export function v2_cn(v: vc.V2): ComplexNumber {
    return new ComplexNumberImpl(v.x, v.y);
}
/** (極形式の長さ, 極形式の偏角(radian)) -> 複素数 */
export function polar_cn(r: number, rad: number): ComplexNumber {
    return new ComplexNumberImpl(r * Math.cos(rad), r * Math.sin(rad));
}
