import * as vc from "./vector";
export declare let _E: number;
/** 位置ベクトルと方向ベクトルのペア */
export interface CD {
    /** Coordinate Vector - 位置ベクトル */
    c(): vc.V3;
    /** Direction Vector - 方向ベクトル */
    d(): vc.V3;
}
/** 位置ベクトルと方向ベクトルのペア */
export declare function cd(c: vc.V3, d: vc.V3): CD;
/** Curve with Parametric Equation - パラメトリック方程式による曲線 */
export interface Curve {
    /** coord(0) と同値 */
    start(): vc.V3;
    /** coord(1) と同値 */
    end(): vc.V3;
    /** パラメータiに対応する位置 */
    coord(i: number): vc.V3;
    /** パラメータiに対応する位置と方向 */
    cd(i: number, delta?: number): CD;
    /** 制御点の配列 */
    controls(): vc.V3[];
}
/** 連続曲線 */
export interface CurveArray extends Curve {
    /** 曲線の配列 */
    curves(): Curve[];
    /** 曲線の数 */
    curveNum(): number;
}
/** (始点, 終点) -> 直線 */
export declare function line(start: vc.V3, end: vc.V3): Curve;
/** ([始点, 終点]) -> 直線 */
export declare function ar_line(v: vc.V3[]): Curve;
/** (3次元ベクトル配列, 媒介変数) -> 3次元ベクトル を満たす任意の関数で定義される曲線 */
export declare function lambda(v: vc.V3[], la: (v: vc.V3[], i: number) => vc.V3): Curve;
/** (始点, 制御点, 終点) -> 2次ベジェ曲線 */
export declare function bezier2(start: vc.V3, mid: vc.V3, end: vc.V3): Curve;
/** ([始点, 制御点, 終点]) -> 2次ベジェ曲線 */
export declare function ar_bezier2(v: vc.V3[]): Curve;
/** (始点, 始点側制御点, 終点側制御点, 終点) -> 3次ベジェ曲線 */
export declare function bezier3(start: vc.V3, mid1: vc.V3, mid2: vc.V3, end: vc.V3): Curve;
/** ([始点, 始点側制御点, 終点側制御点, 終点]) -> 3次ベジェ曲線 */
export declare function ar_bezier3(v: vc.V3[]): Curve;
/** (中心, x, y) -> 楕円 */
export declare function ellipse(o: vc.V3, x: vc.V3, y: vc.V3): Curve;
/** (中心, x, y, z) -> 螺旋 */
export declare function spiral(o: vc.V3, x: vc.V3, y: vc.V3, z: vc.V3): Curve;
/** 連続曲線 */
export declare function curves(curves: Curve[]): CurveArray;
/** 折れ線 */
export declare function lines(verts: vc.V3[]): CurveArray;
