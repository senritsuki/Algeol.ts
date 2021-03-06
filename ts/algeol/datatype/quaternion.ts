﻿/**
 * Quaternion - クォータニオン（四元数）の生成と演算
 * 
 * Copyright (c) 2016 senritsuki
 */

import * as vc from './vector';
import * as mx from './matrix';


export function toMatrix3(qt: Quaternion): mx.M3 {
    const r = qt.r();
    const i = qt.i();
    const x = i[0];
    const y = i[1];
    const z = i[2];
    const row1 = [
        1 - 2 * (y * y + z * z),
        2 * (x * y - r * z),
        2 * (x * z + r * y),
    ];
    const row2 = [
        2 * (y * x + r * z),
        1 - 2 * (x * x + z * z),
        2 * (y * z - r * x),
    ];
    const row3 = [
        2 * (z * x - r * y),
        2 * (z * y + r * x),
        1 - 2 * (x * x + y * y),
    ];
    return mx.rows_to_m3([row1, row2, row3]);
}

export function add(a: Quaternion, b: Quaternion): Quaternion {
    const r = a.r() + b.r();
    const i = vc.add_array(a.i(), b.i());
    return new Quaternion(r, i);
}

export function sub(a: Quaternion, b: Quaternion): Quaternion {
    const r = a.r() + b.r();
    const i = vc.sub_array(a.i(), b.i());
    return new Quaternion(r, i);
}

export function mul(a: Quaternion, b: Quaternion): Quaternion {
    const r1 = a.r();
    const r2 = b.r();
    const i1 = a.i();
    const i2 = b.i();
    const r = r1 * r2 - vc.ip_array(i1, i2);
    const i_1 = vc.scalar_array(i2, r1);
    const i_2 = vc.scalar_array(i1, r2);
    const i_3 = vc.cp3_array(i1, i2);
    const i = vc.add_array(vc.add_array(i_1, i_2), i_3);
    return new Quaternion(r, i);
}

export function mul3(a: Quaternion, b: Quaternion, c: Quaternion): Quaternion {
    return mul(mul(a, b), c);
}

export function mulAll(array: Quaternion[]): Quaternion {
    return array.reduce((a, b) => mul(a, b));
}

export function scalar(a: Quaternion, n: number): Quaternion {
    const r = a.r() * n;
    const i = vc.scalar_array(a.i(), n);
    return new Quaternion(r, i);
}


/** Quaternion - クォータニオン・四元数 */
export class Quaternion {
    constructor(
        public real: number,
        public imag: number[]
    ) {
        //this._v = [real, imag[0], imag[1], imag[2]];
        this.imag = imag.slice(0, 3);
    }

    /** 取得: 虚部[0],[1],[2]と実部[3]からなる配列. 複製を返す */
    array(): number[] {
        return this.imag.concat([this.real]);
    }
    /** 取得: Real Part - 実部 */
    r(): number {
        return this.real;
    }
    /** 取得: Imaginary Part - 虚部. 長さ3 */
    i(): number[] {
        return this.imag.slice();
    }
    /** 取得: 複製 */
    clone(): Quaternion {
        return new Quaternion(this.r(), this.i());
    }

    /** 単項演算: Conjugate - 共役 */
    conjugate(): Quaternion {
        return new Quaternion(this.r(), vc.scalar_array(this.i(), -1));
    }
    /** 単項演算: 絶対値の2乗 */
    abs2(): number {
        const array = this.array();
        return vc.ip_array(array, array);
    }
    /** 単項演算: 絶対値 */
    abs(): number {
        return Math.sqrt(this.abs2());
    }
    /** 単項演算: Additive Inverse - 加法逆元 */
    additiveInverse(): Quaternion {
        return this.scalar(-1);
    }
    /** 単項演算: Multiplicative Inverse - 乗法逆元 */
    multiplicativeInverse(): Quaternion {
        return this.conjugate().scalar(1 / this.abs2());
    }
    /** 単項演算: 単位クォータニオン. 実数倍により絶対値を1にする */
    unit(): Quaternion {
        return this.scalar(1 / this.abs());
    }

    /** 変換: 3次元回転行列 */
    mx3(): mx.M3 {
        return toMatrix3(this);
    }

    /** 二項演算: 加算. 戻り値 = 自身 + 引数 */
    add(dist: Quaternion): Quaternion {
        return add(this, dist);
    }
    /** 二項演算: 減算. 戻り値 = 自身 - 引数 */
    sub(dist: Quaternion): Quaternion {
        return sub(this, dist);
    }
    /** 二項演算: 乗算. 戻り値 = 自身 * 引数 */
    mul(dist: Quaternion): Quaternion {
        return mul(this, dist);
    }
    /** 二項演算: スカラー倍. 戻り値 = 自身 * 引数 */
    scalar(n: number): Quaternion {
        return scalar(this, n);
    }

    /** 写像: 3次元ベクトル -> 3次元ベクトル */
    map_ar(v: number[]): number[] {
        const q = mul3(
            this,
            new Quaternion(0, v),
            this.multiplicativeInverse());
        return q.i();
    }
    /** 写像: 3次元ベクトル -> 3次元ベクトル */
    map(v: vc.V3|number[]): vc.V3 {
        return vc.array_to_v3(this.map_ar(vc.to_array_if_not(v)));
    }
    /** 写像: 3次元ベクトル -> 3次元ベクトル */
    map_v3ar(vl: vc.V3[]): vc.V3[] {
        const q1 = this;
        const q3 = this.multiplicativeInverse();
        return vl
            .map(v => mul3(q1, new Quaternion(0, v._v), q3))
            .map(q => vc.array_to_v3(q.i()));
    }
}

/** (実部, 虚部[0],[1],[2]からなる配列) -> クォータニオン */
export function real_imag(real: number, imag: number[]): Quaternion {
    return new Quaternion(real, imag);
}
/** (実部, 虚部, 虚部, 虚部) -> クォータニオン */
export function real_imag3(real: number, imag1: number, imag2: number, imag3: number): Quaternion {
    return new Quaternion(real, [imag1, imag2, imag3]);
}
/** (実部[0]と虚部[1],[2],[3]からなる配列) -> クォータニオン */
export function fromArray(v: number[]): Quaternion {
    return new Quaternion(v[0], v.slice(1));
}

/** 軸vまわりの回転radを表すクォータニオン */
export function axis_rad(axis: vc.V3|number[], rad: number): Quaternion {
    const imag = vc.to_v3_if_not(axis).scalar(Math.sin(rad / 2));
    const real = Math.cos(rad / 2); 
    const qt = new Quaternion(real, imag._v);
    return qt;
}

