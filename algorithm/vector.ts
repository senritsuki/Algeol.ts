/** Vector - ベクトル */

import * as ut from "./utility";


/** 関数 */
export namespace fn {

    /** 配列の単項演算を行い、新しい配列を返す */
    export function op1(a: number[], dim: number, fn: (n1: number) => number): number[] {
        const v: number[] = [];
        for (let i = 0; i < dim; i++) {
            v.push(fn(a[i]));
        }
        return v;
    }
    /** 配列同士の二項演算を行い、新しい配列を返す */
    export function op2(a: number[], b: number[], dim: number, fn: (n1: number, n2: number) => number): number[] {
        const v: number[] = [];
        for (let i = 0; i < dim; i++) {
            v.push(fn(a[i], b[i]));
        }
        return v;
    }

    /** Addition 加算 */
    export function add(a: number[], b: number[]): number[] {
        return op2(a, b, ut.min(a.length, b.length), (n1, n2) => n1 + n2);
    }
    /** Subtraction 減算 */
    export function sub(a: number[], b: number[]): number[] {
        return op2(a, b, ut.min(a.length, b.length), (n1, n2) => n1 - n2);
    }
    /** スカラー倍 */
    export function scalar(a: number[], n: number): number[] {
        return op1(a, a.length, (n1) => n1 * n);
    }
    /** 要素ごとの積, アダマール積 */
    export function hadamart(a: number[], b: number[]): number[] {
        return op2(a, b, ut.min(a.length, b.length), (n1, n2) => n1 * n2);
    }
    /** Inner Product, Dot Product 内積 */
    export function ip(a: number[], b: number[]): number {
        return hadamart(a, b).reduce((a, b) => a + b);
    }
    /** Cross Product 2-D 外積（二次元） */
    export function cp2(a: number[], b: number[]): number {
        return a[0] * b[1] - a[1] * b[0];
    }
    /** Cross Product 3-D 外積（三次元） */
    export function cp3(a: number[], b: number[]): number[] {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0],
        ];
    }
}


export interface Vector<T extends Vector<T>> {
    /** 生の値 */
    _v: number[];

    /** 取得: 自身のベクトルを表す数値配列. 複製を返す */
    array(): number[];
    /** 取得: 複製 */
    clone(): T;

    /** 単項演算: 単位ベクトル化. clone() / length() と同値 */
    unit(): T;
    /** 単項演算: ベクトルの長さの2乗 */
    length2(): number;
    /** 単項演算: ベクトルの長さ */
    length(): number;

    /** 二項演算: 加算 */
    add(dist: T|number[]): T;
    /** 二項演算: 減算 */
    sub(dist: T|number[]): T;
    /** 二項演算: 要素同士の積 */
    hadamart(dist: T|number[]): T;
    /** 二項演算: スカラー倍 */
    scalar(n: number): T;
    /** 二項演算: 内積 */
    ip(dist: T|number[]): number;
}

/** 2D Vector - 2次元ベクトル */
export interface V2 extends Vector<V2> {
    /** 取得: x値. array()[0]と同値 */
    x(): number;
    /** 取得: y値. array()[1]と同値 */
    y(): number;
    /** 二項演算: 外積 */
    cp(dist: V2|number[]): number;
}

/** 3D Vector - 3次元ベクトル */
export interface V3 extends Vector<V3> {
    /** 取得: x値. array()[0]と同値 */
    x(): number;
    /** 取得: y値. array()[1]と同値 */
    y(): number;
    /** 取得: z値. array()[2]と同値 */
    z(): number;
    /** 二項演算: 外積 */
    cp(dist: V3|number[]): V3;
}

/** 4D Vector - 4次元ベクトル */
export interface V4 extends Vector<V4> {
    /** 取得: x値. array()[0]と同値 */
    x(): number;
    /** 取得: y値. array()[1]と同値 */
    y(): number;
    /** 取得: z値. array()[2]と同値 */
    z(): number;
    /** 取得: w値. array()[3]と同値 */
    w(): number;
}


/** 非公開処理 */
namespace priv {
    const toArray = <T extends Vector<T>>(n: T|number[]): number[] => n instanceof Array ? n : n._v;

    export class V2Impl implements V2 {
        _v: number[];

        constructor(
            x: number,
            y: number) {
            this._v = [x, y];
        }

        static FromArray(v: number[]): V2Impl {
            return new V2Impl(v[0], v[1]);
        }

        // 取得

        array = (): number[] => this._v.slice(0);
        clone = (): V2 => new V2Impl(this.x(), this.y());
        x = (): number => this._v[0];
        y = (): number => this._v[1];

        // 単項演算

        unit = (): V2 => this.scalar(1 / this.length());
        length2 = (): number => this.ip(this);
        length = (): number => ut.sqrt(this.length2());

        // 二項演算

        add = (dist: V2|number[]): V2 => V2Impl.FromArray(fn.add(this._v, toArray<V2>(dist)));
        sub = (dist: V2|number[]): V2 => V2Impl.FromArray(fn.sub(this._v, toArray<V2>(dist)));
        hadamart = (dist: V2|number[]): V2 => V2Impl.FromArray(fn.hadamart(this._v, toArray<V2>(dist)));
        scalar = (n: number): V2 => V2Impl.FromArray(fn.scalar(this._v, n));
        ip = (dist: V2|number[]): number => fn.ip(this.array(), toArray<V2>(dist));
        cp = (dist: V2|number[]): number => fn.cp2(this._v, toArray<V2>(dist));
    }

    export class V3Impl implements V3 {
        _v: number[];

        constructor(
            x: number,
            y: number,
            z: number) {
            this._v = [x, y, z];
        }

        static FromArray(v: number[]): V3Impl {
            return new V3Impl(v[0], v[1], v[2]);
        }

        // 単項演算

        length2 = (): number => this.ip(this);
        length = (): number => ut.sqrt(this.length2());
        unit = (): V3 => this.scalar(1 / this.length());

        // 取得

        array = (): number[] => this._v.slice(0);
        clone = (): V3 => new V3Impl(this.x(), this.y(), this.z());
        x = (): number => this._v[0];
        y = (): number => this._v[1];
        z = (): number => this._v[2];

        // 二項演算

        add = (dist: V3|number[]): V3 => V3Impl.FromArray(fn.add(this._v, toArray<V3>(dist)));
        sub = (dist: V3|number[]): V3 => V3Impl.FromArray(fn.sub(this._v, toArray<V3>(dist)));
        hadamart = (dist: V3|number[]): V3 => V3Impl.FromArray(fn.hadamart(this._v, toArray<V3>(dist)));
        scalar = (n: number): V3 => V3Impl.FromArray(fn.scalar(this._v, n));
        ip = (dist: V3|number[]): number => fn.ip(this.array(), toArray<V3>(dist));
        cp = (dist: V3|number[]): V3 => V3Impl.FromArray(fn.cp3(this._v, toArray<V3>(dist)));
    }

    export class V4Impl implements V4 {
        _v: number[];

        constructor(
            x: number,
            y: number,
            z: number,
            w: number) {
            this._v = [x, y, z, w];
        }

        static FromArray(v: number[]): V4Impl {
            return new V4Impl(v[0], v[1], v[2], v[3]);
        }

        // 取得

        array = (): number[] => this._v.slice(0);
        clone = (): V4 => new V4Impl(this.x(), this.y(), this.z(), this.w());
        x = (): number => this._v[0];
        y = (): number => this._v[1];
        z = (): number => this._v[2];
        w = (): number => this._v[3];

        // 単項演算

        unit = (): V4 => this.scalar(1 / this.length());
        length2 = (): number => this.ip(this);
        length = (): number => ut.sqrt(this.length2());

        // 二項演算

        add = (dist: V4|number[]): V4 => V4Impl.FromArray(fn.add(this._v, toArray<V4>(dist)));
        sub = (dist: V4|number[]): V4 => V4Impl.FromArray(fn.sub(this._v, toArray<V4>(dist)));
        hadamart = (dist: V4|number[]): V4 => V4Impl.FromArray(fn.hadamart(this._v, toArray<V4>(dist)));
        scalar = (n: number): V4 => V4Impl.FromArray(fn.scalar(this._v, n));
        ip = (dist: V4|number[]): number => fn.ip(this.array(), toArray<V4>(dist));
    }
}


// --------------------------------------------------------
// 直交座標系による生成

/** (x成分, y成分) -> 2次元ベクトル */
export const v2 = (x: number, y: number): V2 => new priv.V2Impl(x, y);
/** (x成分, y成分, z成分) -> 3次元ベクトル */
export const v3 = (x: number, y: number, z: number): V3 => new priv.V3Impl(x, y, z);
/** (x成分, y成分, z成分, w成分) -> 4次元ベクトル */
export const v4 = (x: number, y: number, z: number, w: number): V4 => new priv.V4Impl(x, y, z, w);

/** ([x成分, y成分]) -> 2次元ベクトル */
export const array_to_v2 = (n: number[]): V2 => priv.V2Impl.FromArray(n);
/** ([x成分, y成分, z成分]) -> 3次元ベクトル */
export const array_to_v3 = (n: number[]): V3 => priv.V3Impl.FromArray(n);
/** ([x成分, y成分, z成分, w成分]) -> 4次元ベクトル */
export const array_to_v4 = (n: number[]): V4 => priv.V4Impl.FromArray(n);

// --------------------------------------------------------
// 極座標系による生成

/**
 * 極座標系から直交座標系の2次元ベクトルを生成する
 * @param r     極形式の長さ
 * @param rad   極形式の偏角(radian). 0でx軸正方向、1/2PIでy軸正方向とする
 * <ul>
 * <li> polar_to_v2(2, 0) -> v2(2, 0)
 * <li> polar_to_v2(2, PI/2) -> v2(0, 2)
 * <li> polar_to_v2(2, PI) -> v2(-2, 0)
 * </ul>
 */
export function polar_to_v2(r: number, rad: number): V2 {
    const x = r * ut.cos(rad);
    const y = r * ut.sin(rad);
    return new priv.V2Impl(x, y);
}

/**
 * 円柱座標系から直交座標系の3次元ベクトルを生成する
 * @param r     極形式のxy成分の長さ
 * @param rad   極形式のxy成分の偏角(radian). 0でx軸正方向、1/2PIでy軸正方向とする
 * @param z     z成分
 * <ul>
 * <li> polar_to_v3(2, 0, 3) -> v3(2, 0, 3)
 * <li> polar_to_v3(2, PI/2, 4) -> v3(0, 2, 4)
 * <li> polar_to_v3(2, PI, 5) -> v3(-2, 0, 5)
 * </ul>
 */
export function polar_to_v3(r: number, rad: number, z: number): V3 {
    const x = r * ut.cos(rad);
    const y = r * ut.sin(rad);
    return new priv.V3Impl(x, y, z);
}

/**
 * 球面座標系から直交座標系の3次元ベクトルを生成する
 * @param r     極形式の長さ
 * @param radH  水平偏角。0でx軸正方向、1/2PIでy軸正方向とする
 * @param radV  垂直偏角。0でz軸と直交、1/2PIでz軸正方向、-1/2PIでz軸負方向とする
 * <ul>
 * <li> sphere_to_v3(2, 0, 0) -> v3(2, 0, 0)
 * <li> sphere_to_v3(2, PI/2, 0) -> v3(0, 2, 0)
 * <li> sphere_to_v3(2, PI, 0) -> v3(-2, 0, 0)
 * <li> sphere_to_v3(2, 0, PI/3) -> v3(1, 0, sqrt(3))
 * <li> sphere_to_v3(2, PI/2, PI/3) -> v3(0, 1, sqrt(3))
 * <li> sphere_to_v3(2, PI, PI/3) -> v3(-1, 0, sqrt(3))
 * </ul>
 */
export function sphere_to_v3(r: number, radH: number, radV: number): V3 {
    const rh = r * ut.cos(radV);
    const z = r * ut.sin(radV);
    const x = rh * ut.cos(radH);
    const y = rh * ut.sin(radH);
    return new priv.V3Impl(x, y, z);
}

// 変換

/**
 * (2次元ベクトル, z成分) -> 3次元ベクトル
 * <ul>
 * <li> v2_to_v3(v2(1, 2), 3) -> v3(1, 2, 3)
 * </ul>
 */
export const v2_to_v3 = (v2: V2, z: number): V3 => priv.V3Impl.FromArray(v2._v.concat(z));

/**
 * (3次元ベクトル) -> 2次元ベクトル
 * <ul>
 * <li> v3_to_v2(v3(1, 2, 3)) -> v2(1, 2)
 * </ul>
 */
export const v3_to_v2 = (v3: V3): V2 => priv.V2Impl.FromArray(v3._v);

/** 
 * (3次元ベクトル, w成分) -> 4次元ベクトル
 * <ul>
 * <li> v3_to_v4(v3(1, 2, 3), 4) -> v4(1, 2, 3, 4)
 * </ul>
 */
export const v3_to_v4 = (v3: V3, w: number): V4 => priv.V4Impl.FromArray(v3._v.concat(w));

/**
 * (4次元ベクトル) -> 3次元ベクトル
 * <ul>
 * <li> v4_to_v3(v4(1, 2, 3, 4)) -> v3(1, 2, 3)
 * </ul>
 */
export const v4_to_v3 = (v4: V4): V3 => priv.V3Impl.FromArray(v4._v);

// 定数

/** 2次元ゼロベクトル v2(0, 0) */
export const v2_zero = v2(0, 0);
/** 3次元ゼロベクトル v3(0, 0, 0 */
export const v3_zero = v3(0, 0, 0);
/** x軸と平行な3次元単位ベクトル v3(1, 0, 0) */
export const v3_unit_x = v3(1, 0, 0);
/** y軸と平行な3次元単位ベクトル v3(0, 1, 0) */
export const v3_unit_y = v3(0, 1, 0);
/** z軸と平行な3次元単位ベクトル v3(0, 0, 1) */
export const v3_unit_z = v3(0, 0, 1);

