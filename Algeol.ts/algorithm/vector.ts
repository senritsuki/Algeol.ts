/**
 * Vector - ベクトルの生成とベクトル演算
 * 
 * Copyright (c) 2016 senritsuki
 */


/** 配列の単項演算を行い、新しい配列を返す */
export function v_op1(a: number[], dim: number, fn: (n1: number) => number): number[] {
    const v: number[] = new Array(dim);
    for (let i = 0; i < dim; i++) {
        v[i] = fn(a[i]);
    }
    return v;
}
/** 配列同士の二項演算を行い、新しい配列を返す */
export function v_op2(a: number[], b: number[], dim: number, fn: (n1: number, n2: number) => number): number[] {
    const v: number[] = new Array(dim);
    for (let i = 0; i < dim; i++) {
        v[i] = fn(a[i], b[i]);
    }
    return v;
}

/** Addition 加算 */
export function add_array(a: number[], b: number[]): number[] {
    return v_op2(a, b, Math.min(a.length, b.length), (n1, n2) => n1 + n2);
}
/** Subtraction 減算 */
export function sub_array(a: number[], b: number[]): number[] {
    return v_op2(a, b, Math.min(a.length, b.length), (n1, n2) => n1 - n2);
}
/** スカラー倍 */
export function scalar_array(a: number[], n: number): number[] {
    return v_op1(a, a.length, (n1) => n1 * n);
}
/** 要素ごとの乗算 */
export function el_mul_array(a: number[], b: number[]): number[] {
    return v_op2(a, b, Math.min(a.length, b.length), (n1, n2) => n1 * n2);
}
/** 要素ごとの除算 */
export function el_div_array(a: number[], b: number[]): number[] {
    return v_op2(a, b, Math.min(a.length, b.length), (n1, n2) => n1 / n2);
}
/** Inner Product, Dot Product 内積 */
export function ip_array(a: number[], b: number[]): number {
    return el_mul_array(a, b).reduce((a, b) => a + b);
}
/** Cross Product 2-D 外積（二次元） */
export function cp2_array(a: number[], b: number[]): number {
    return a[0] * b[1] - a[1] * b[0];
}
/** Cross Product 3-D 外積（三次元） */
export function cp3_array(a: number[], b: number[]): number[] {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];
}
/** 二つの方向ベクトルのなす角 radian */
export function angle_array(a: number[], b: number[]): number {
    // 余弦定理 abs(a)*abs(b)*cos(rad) = ip(a,b) を用いればよい
    const al = Math.sqrt(ip_array(a, a));
    const bl = Math.sqrt(ip_array(b, b));
    const i = ip_array(a, b);
    const rad = Math.acos(i / (al * bl));
    return rad;
}

/** Addition 加算 */
export function add<V extends Vector<V>>(a: V, b: V): V {
    return a.add(b);
}
/** Subtraction 減算 */
export function sub<V extends Vector<V>>(a: V, b: V): V {
    return a.sub(b);
}



/** ベクトルの次元によらない共通インターフェース */
export interface VectorCommon {
    /** 生の値 */
    _v: number[];

    /** 取得: 自身の次元 */
    dim(): number;
    /** 取得: 自身のベクトルを表す数値配列. 複製を返す */
    array(): number[];

    /** 文字列化 */
    toString(): string;
    /** 文字列化. 小数点第三位まで */
    toString03f(): string;

    /** 単項演算: ベクトルの長さの2乗 */
    length2(): number;
    /** 単項演算: ベクトルの長さ */
    length(): number;
}

/** ベクトルの共通インターフェース */
export interface Vector<T extends Vector<T>> extends VectorCommon {
    /** 取得: 複製 */
    clone(): T;
    /** 単項演算: 単位ベクトル化. clone() / length() と同値 */
    unit(): T;

    /** 二項演算: 加算 */
    add(dist: T|number[]): T;
    /** 二項演算: 減算 */
    sub(dist: T|number[]): T;
    /** 二項演算: 要素同士の乗算 */
    el_mul(dist: T|number[]): T;
    /** 二項演算: 要素同士の除算 */
    el_div(dist: T|number[]): T;
    /** 二項演算: スカラー倍 */
    scalar(n: number): T;
    /** 二項演算: 内積 */
    ip(dist: T|number[]): number;
    /** 二項演算: 二つの方向ベクトルのなす角 */
    angle(dist: T|number[]): number;

    length_add(n: number): T;
    length_sub(n: number): T;
}

class VectorBase<T extends Vector<T>> implements Vector<T> {
    constructor(
        public _v: number[],
        public _f: (v: number[]) => T,
    ) {}

    dim(): number {
        return this._v.length;
    }
    array(): number[] {
        return this._v.slice(0);
    }
    toString(): string {
        return `[${this._v.join(', ')}]`;
    }
    toString03f(): string {
        return `[${this._v.map(n => Math.round(n*1000)/1000).join(', ')}]`;
    }
    length2(): number {
        return ip_array(this._v, this._v);
    }
    length(): number {
        return Math.sqrt(this.length2());
    }

    clone(): T {
        return this._f(this._v);
    }
    unit(): T {
        return this._f(scalar_array(this._v, 1 / this.length()));
    }

    add(dist: T|number[]): T {
        return this._f(add_array(this._v, to_array_if(dist)));
    }
    sub(dist: T|number[]): T {
        return this._f(sub_array(this._v, to_array_if(dist)));
    }
    el_mul(dist: T|number[]): T {
        return this._f(el_mul_array(this._v, to_array_if(dist)));
    }
    el_div(dist: T|number[]): T {
        return this._f(el_div_array(this._v, to_array_if(dist)));
    }
    scalar(n: number): T {
        return this._f(scalar_array(this._v, n));
    }
    ip(dist: T|number[]): number {
        return ip_array(this.array(), to_array_if(dist));
    }
    angle(dist: T|number[]): number {
        return angle_array(this._v, to_array_if(dist));
    }

    length_add(n: number): T {
        const cur_len = this.length();
        const new_len = cur_len + n;
        return this.scalar(new_len / cur_len);
    }
    length_sub(n: number): T {
        return this.length_add(-n);
    }
}

/** 1D Vector - 1次元ベクトル */
export interface V1 extends Vector<V1> {
    n: number;
}

/** 1D Vector - 1次元ベクトル */
class V1Impl extends VectorBase<V1Impl> implements V1 {
    constructor(
        n: number,
    ) {
        super([n], V1Impl.fm_array);
    }

    static fm_array(v: number[]): V1Impl {
        return new V1Impl(v[0]);
    }

    get n(): number { return this._v[0]; }
    set n(n: number) { this._v[0] = n; }
}

/** 2D Vector - 2次元ベクトル */
export interface V2 extends Vector<V2> {
    x: number;
    y: number;

    /** 二項演算: 外積 */
    cp(dist: V2|number[]): number;
}

/** 2D Vector - 2次元ベクトル */
class V2Impl extends VectorBase<V2Impl> implements V2 {
    constructor(
        x: number,
        y: number,
    ) {
        super([x, y], V2Impl.fm_array);
    }

    static fm_array(v: number[]): V2Impl {
        return new V2Impl(v[0], v[1]);
    }

    get x(): number { return this._v[0]; }
    get y(): number { return this._v[1]; }
    set x(n: number) { this._v[0] = n; }
    set y(n: number) { this._v[1] = n; }

    cp(dist: V2Impl|number[]): number {
        return cp2_array(this._v, to_array_if(dist));
    }
}

/** 3D Vector - 3次元ベクトル */
export interface V3 extends Vector<V3> {
    x: number;
    y: number;
    z: number;

    /** 二項演算: 外積 */
    cp(dist: V3|number[]): V3;
}

class V3Impl extends VectorBase<V3Impl> implements V3 {
    constructor(
        x: number,
        y: number,
        z: number,
    ) {
        super([x, y, z], V3Impl.fm_array);
    }

    static fm_array(v: number[]): V3Impl {
        return new V3Impl(v[0], v[1], v[2]);
    }

    // 取得
    get x(): number { return this._v[0]; }
    get y(): number { return this._v[1]; }
    get z(): number { return this._v[2]; }
    set x(n: number) { this._v[0] = n; }
    set y(n: number) { this._v[1] = n; }
    set z(n: number) { this._v[2] = n; }

    cp(dist: V3Impl|number[]): V3Impl {
        return V3Impl.fm_array(cp3_array(this._v, to_array_if(dist)));
    }
}

/** 4D Vector - 4次元ベクトル */
export interface V4 extends Vector<V4> {
    x: number;
    y: number;
    z: number;
    w: number;
}

class V4Impl extends VectorBase<V4Impl> implements V4 {
    constructor(
        x: number,
        y: number,
        z: number,
        w: number,
    ) {
        super([x, y, z, w], V4Impl.fm_array);
    }

    static fm_array(v: number[]): V4Impl {
        return new V4Impl(v[0], v[1], v[2], v[3]);
    }

    // 取得
    get x(): number { return this._v[0]; }
    get y(): number { return this._v[1]; }
    get z(): number { return this._v[2]; }
    get w(): number { return this._v[3]; }
    set x(n: number) { this._v[0] = n; }
    set y(n: number) { this._v[1] = n; }
    set z(n: number) { this._v[2] = n; }
    set w(n: number) { this._v[3] = n; }
}


export const to_array_if = <T extends Vector<T>>(n: T|number[]): number[] => n instanceof Array ? n : n._v;
export const to_v2_if = (v: V2|number[]): V2 => v instanceof Array ? array_to_v2(v) : v;
export const to_v3_if = (v: V3|number[]): V3 => v instanceof Array ? array_to_v3(v) : v;
export const to_v4_if = (v: V4|number[]): V4 => v instanceof Array ? array_to_v4(v) : v;


// --------------------------------------------------------
// 直交座標系による生成

/** 1次元ベクトル生成 [n] */
export const v1 = (n: number): V1 => new V1Impl(n);
/** 2次元ベクトル生成 [x, y] */
export const v2 = (x: number, y: number): V2 => new V2Impl(x, y);
/** 3次元ベクトル生成 [x, y, z] */
export const v3 = (x: number, y: number, z: number): V3 => new V3Impl(x, y, z);
/** 4次元ベクトル生成 [x, y, z, w] */
export const v4 = (x: number, y: number, z: number, w: number): V4 => new V4Impl(x, y, z, w);

/** 1次元ベクトル生成 [n] */
export const array_to_v1 = (n: number[]): V1 => V1Impl.fm_array(n);
/** 2次元ベクトル生成 [x, y] */
export const array_to_v2 = (n: number[]): V2 => V2Impl.fm_array(n);
/** 3次元ベクトル生成 [x, y, z] */
export const array_to_v3 = (n: number[]): V3 => V3Impl.fm_array(n);
/** 4次元ベクトル生成 [x, y, z, w] */
export const array_to_v4 = (n: number[]): V4 => V4Impl.fm_array(n);

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
    const x = r * Math.cos(rad);
    const y = r * Math.sin(rad);
    return new V2Impl(x, y);
}

/** v2 -> [radius, radian] */
export function v2_to_polar(v: V2): [number, number] {
    const r = v.length();
    const rad = Math.atan2(v.y, v.x);
    return [r, rad];
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
    const x = r * Math.cos(rad);
    const y = r * Math.sin(rad);
    return new V3Impl(x, y, z);
}

/** v3 -> [radius, radian, z] */
export function v3_to_polar(v: V3): [number, number, number] {
    const r = v3_to_v2(v).length();
    const rad = Math.atan2(v.y, v.x);
    return [r, rad, v.z];
}
/** v3 -> [radius, radian_horizontal, radian_vertical] */
export function v3_to_sphere(v: V3): [number, number, number] {
    const r = v.length();
    const r_h = v3_to_v2(v).length();
    const rad_h = Math.atan2(v.y, v.x);
    const rad_v = Math.atan2(v.z, r_h);
    return [r, rad_h, rad_v];
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
    const rh = r * Math.cos(radV);
    const z = r * Math.sin(radV);
    const x = rh * Math.cos(radH);
    const y = rh * Math.sin(radH);
    return new V3Impl(x, y, z);
}

// 変換

/**
 * (2次元ベクトル, z成分) -> 3次元ベクトル
 * <ul>
 * <li> v2_to_v3(v2(1, 2), 3) -> v3(1, 2, 3)
 * </ul>
 */
export const v2_to_v3 = (v2: V2, z: number): V3 => V3Impl.fm_array(v2._v.concat(z));

/**
 * (3次元ベクトル) -> 2次元ベクトル
 * <ul>
 * <li> v3_to_v2(v3(1, 2, 3)) -> v2(1, 2)
 * </ul>
 */
export const v3_to_v2 = (v3: V3): V2 => V2Impl.fm_array(v3._v);

/** 
 * (3次元ベクトル, w成分) -> 4次元ベクトル
 * <ul>
 * <li> v3_to_v4(v3(1, 2, 3), 4) -> v4(1, 2, 3, 4)
 * </ul>
 */
export const v3_to_v4 = (v3: V3, w: number): V4 => V4Impl.fm_array(v3._v.concat(w));

/**
 * (4次元ベクトル) -> 3次元ベクトル
 * <ul>
 * <li> v4_to_v3(v4(1, 2, 3, 4)) -> v3(1, 2, 3)
 * </ul>
 */
export const v4_to_v3 = (v4: V4): V3 => V3Impl.fm_array(v4._v);


export function v3map_v4(v: V4, f: (v: V3) => V3): V4 {
    const w = v.w;
    const v_1 = v4_to_v3(v);
    const v_2 = f(v_1);
    const v_3 = v3_to_v4(v_2, w);
    return v_3;
}
export function v4map_v3(v: V3, w: number, f: (v: V4) => V4): V3 {
    const v_1 = v3_to_v4(v, w);
    const v_2 = f(v_1);
    const v_3 = v4_to_v3(v_2);
    return v_3;
}

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

