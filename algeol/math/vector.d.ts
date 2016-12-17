/** ベクトル演算 */
export declare namespace fn {
    function op(a: number[], dim: number, fn: (n1: number) => number): number[];
    function op2(a: number[], b: number[], dim: number, fn: (n1: number, n2: number) => number): number[];
    /** Addition 加算 */
    function add(a: number[], b: number[]): number[];
    /** Subtraction 減算 */
    function sub(a: number[], b: number[]): number[];
    /** スカラー倍 */
    function scalar(a: number[], n: number): number[];
    /** 要素ごとの積, アダマール積 */
    function hadamart(a: number[], b: number[]): number[];
    /** Inner Product, Dot Product 内積 */
    function ip(a: number[], b: number[]): number;
    /** Cross Product 2-D 外積（二次元） */
    function cp2(a: number[], b: number[]): number;
    /** Cross Product 3-D 外積（三次元） */
    function cp3(a: number[], b: number[]): number[];
}
/** 2D Vector - 2次元ベクトル */
export interface V2 {
    /** 取得: x,yからなる長さ2の配列. 生の参照を返すため破壊的変更が可能 */
    _ref(): number[];
    /** 取得: x,yからなる長さ2の配列. 複製を返す */
    array(): number[];
    /** 取得: x値. array()[0]と同値 */
    x(): number;
    /** 取得: y値. array()[1]と同値 */
    y(): number;
    /** 取得: 複製 */
    clone(): V2;
    /** 単項演算: 単位ベクトル化. clone() / length() と同値 */
    unit(): V2;
    /** 単項演算: ベクトルの長さの2乗 */
    lenght2(): number;
    /** 単項演算: ベクトルの長さ */
    length(): number;
    /** 二項演算: 加算 */
    add(dist: V2): V2;
    /** 二項演算: 減算 */
    sub(dist: V2): V2;
    /** 二項演算: 要素同士の積 */
    hadamart(dist: V2): V2;
    /** 二項演算: スカラー倍 */
    scalar(n: number): V2;
    /** 二項演算: 内積 */
    ip(dist: V2): number;
    /** 二項演算: 外積 */
    cp(dist: V2): number;
}
/** 3D Vector - 3次元ベクトル */
export interface V3 {
    /** 取得: x,y,zからなる長さ3の配列. 生の参照を返すため破壊的変更が可能 */
    _ref(): number[];
    /** 取得: x,y,zからなる長さ3の配列. 複製を返す */
    array(): number[];
    /** 取得: x値. array()[0]と同値 */
    x(): number;
    /** 取得: y値. array()[1]と同値 */
    y(): number;
    /** 取得: z値. array()[2]と同値 */
    z(): number;
    /** 取得: 複製 */
    clone(): V3;
    /** 単項演算: 単位ベクトル化. clone() / length() と同値 */
    unit(): V3;
    /** 単項演算: ベクトルの長さの2乗 */
    lenght2(): number;
    /** 単項演算: ベクトルの長さ */
    length(): number;
    /** 二項演算: 加算 */
    add(dist: V3): V3;
    /** 二項演算: 減算 */
    sub(dist: V3): V3;
    /** 二項演算: 要素同士の積 */
    hadamart(dist: V3): V3;
    /** 二項演算: スカラー倍 */
    scalar(n: number): V3;
    /** 二項演算: 内積 */
    ip(dist: V3): number;
    /** 二項演算: 外積 */
    cp(dist: V3): V3;
}
/** 4D Vector - 4次元ベクトル */
export interface V4 {
    /** 取得: x,y,z,wからなる長さ4の配列. 生の参照を返すため破壊的変更が可能 */
    _ref(): number[];
    /** 取得: x,y,z,wからなる長さ4の配列. 複製を返す */
    array(): number[];
    /** 取得: x値. array()[0]と同値 */
    x(): number;
    /** 取得: y値. array()[1]と同値 */
    y(): number;
    /** 取得: z値. array()[2]と同値 */
    z(): number;
    /** 取得: w値. array()[3]と同値 */
    w(): number;
    /** 取得: 複製 */
    clone(): V4;
    /** 単項演算: ベクトルの長さの2乗 */
    lenght2(): number;
    /** 単項演算: ベクトルの長さ */
    length(): number;
    /** 単項演算: 単位ベクトル化. clone() / length() と同値 */
    unit(): V4;
    /** 二項演算: 加算 */
    add(dist: V4): V4;
    /** 二項演算: 減算 */
    sub(dist: V4): V4;
    /** 二項演算: 要素同士の積 */
    hadamart(dist: V4): V4;
    /** 二項演算: スカラー倍 */
    scalar(n: number): V4;
    /** 二項演算: 内積 */
    ip(dist: V4): number;
}
/** (x成分, y成分) -> 2次元ベクトル */
export declare function v2(x: number, y: number): V2;
/** (xyz成分を含む配列) -> 2次元ベクトル */
export declare function ar_v2(v: number[]): V2;
/** (x成分, y成分, z成分) -> 3次元ベクトル */
export declare function v3(x: number, y: number, z: number): V3;
/** (xyz成分を含む配列) -> 3次元ベクトル */
export declare function ar_v3(v: number[]): V3;
/** (x成分, y成分, z成分, w成分) -> 4次元ベクトル */
export declare function v4(x: number, y: number, z: number, w: number): V4;
/** (xyzw成分を含む配列) -> 4次元ベクトル */
export declare function ar_v4(v: number[]): V4;
/** (極形式の長さ, 極形式の偏角(radian)) -> 2次元ベクトル
    偏角は、0でx軸正方向、1/2PIでy軸正方向とする */
export declare function polar_v2(r: number, rad: number): V2;
/** (極形式の長さ, 極形式の偏角(radian), z成分) -> 3次元ベクトル
    偏角は、0でx軸正方向、1/2PIでy軸正方向とする */
export declare function polar_v3(r: number, rad: number, z: number): V3;
/** (極形式の長さ, 極形式の水平偏角(radian), 極形式の垂直偏角(radian)) -> 3次元ベクトル
    水平偏角は、0でx軸正方向、1/2PIでy軸正方向とする
    垂直偏角は、0でz軸と直交、1/2PIでz軸正方向、-1/2PIでz軸負方向とする */
export declare function sphere_v3(r: number, radH: number, radV: number): V3;
/** (2次元ベクトル, z成分) -> 3次元ベクトル */
export declare function v2_v3(v2: V2, z: number): V3;
/** (3次元ベクトル) -> 2次元ベクトル */
export declare function v3_v2(v3: V3): V2;
/** (3次元ベクトル, w成分) -> 4次元ベクトル */
export declare function v3_v4(v3: V3, w: number): V4;
/** (4次元ベクトル) -> 3次元ベクトル */
export declare function v4_v3(v4: V4): V3;
/** 2次元ゼロベクトル */
export declare const zero_v2: V2;
/** 3次元ゼロベクトル */
export declare const zero_v3: V3;
/** x軸と平行な3次元単位ベクトル */
export declare const unitX_v3: V3;
/** y軸と平行な3次元単位ベクトル */
export declare const unitY_v3: V3;
/** z軸と平行な3次元単位ベクトル */
export declare const unitZ_v3: V3;
/** Vector ベクトル */
export declare class _Vector {
    v: number[];
    constructor(v: number[]);
    static FromArray(v: number[]): _Vector;
    dim(): number;
    toString(): string;
    add(dist: _Vector): _Vector;
    sub(dist: _Vector): _Vector;
    hadamart(dist: _Vector): _Vector;
    scalar(n: number): _Vector;
    /** Inner Product, Dot Product 内積 */
    ip(dist: _Vector): number;
    /** Unit Vector 単位ベクトル */
    normalize(): _Vector;
    /** 長さの二乗 */
    length2(): number;
    /** 長さ */
    length(): number;
}
export declare class _Vector2 extends _Vector {
    constructor(x: number, y: number);
    static FromArray(v: number[]): _Vector2;
    dim(): number;
    x(): number;
    y(): number;
    add(dist: _Vector2): _Vector2;
    sub(dist: _Vector2): _Vector2;
    hadamart(dist: _Vector2): _Vector2;
    scalar(n: number): _Vector2;
    /** Inner Product, Dot Product 内積 */
    ip(dist: _Vector2): number;
    /** Unit Vector 単位ベクトル */
    normalize(): _Vector2;
    /** Cross Product 外積 */
    cp(dist: _Vector2): number;
}
export declare class _Vector3 extends _Vector {
    constructor(x: number, y: number, z: number);
    static FromArray(v: number[]): _Vector3;
    dim(): number;
    x(): number;
    y(): number;
    z(): number;
    add(dist: _Vector3): _Vector3;
    sub(dist: _Vector3): _Vector3;
    hadamart(dist: _Vector3): _Vector3;
    scalar(n: number): _Vector3;
    /** Inner Product, Dot Product 内積 */
    ip(dist: _Vector3): number;
    /** Unit Vector 単位ベクトル */
    normalize(): _Vector3;
    /** Cross Product 外積 */
    cp(dist: _Vector3): _Vector3;
}
export declare class _Vector4 extends _Vector {
    constructor(x: number, y: number, z: number, w: number);
    static FromArray(v: number[]): _Vector4;
    dim(): number;
    x(): number;
    y(): number;
    z(): number;
    w(): number;
    add(dist: _Vector4): _Vector4;
    sub(dist: _Vector4): _Vector4;
    hadamart(dist: _Vector4): _Vector4;
    scalar(n: number): _Vector4;
    /** Inner Product, Dot Product 内積 */
    ip(dist: _Vector4): number;
    /** Unit Vector 単位ベクトル */
    normalize(): _Vector4;
}
