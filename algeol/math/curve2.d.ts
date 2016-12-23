import * as vc from "./vector";
export declare let _E: number;
/** 位置ベクトルと方向ベクトルのペア */
export interface CD {
    /** Coordinate Vector - 位置ベクトル */
    c(): vc.V2;
    /** Direction Vector - 方向ベクトル */
    d(): vc.V2;
}
/** 位置ベクトルと方向ベクトルのペア */
export declare function cd(c: vc.V2, d: vc.V2): CD;
/** Curve with Parametric Equation - パラメトリック方程式による曲線 */
export interface Curve {
    /** coord(0) と同値 */
    start(): vc.V2;
    /** coord(1) と同値 */
    end(): vc.V2;
    /** パラメータiに対応する位置 */
    coord(i: number): vc.V2;
    /** パラメータiに対応する位置と方向 */
    cd(i: number, delta?: number): CD;
    /** 制御点の配列 */
    controls(): vc.V2[];
}
/** 連続曲線 */
export interface CurveArray extends Curve {
    /** 曲線の配列 */
    curves(): Curve[];
    /** 曲線の数 */
    curveNum(): number;
}
/** (始点, 終点) -> 直線 */
export declare function line(start: vc.V2, end: vc.V2): Curve;
/** ([始点, 終点]) -> 直線 */
export declare function ar_line(v: vc.V2[]): Curve;
/** (2次元ベクトル配列, 媒介変数) -> 2次元ベクトル を満たす任意の関数で定義される曲線 */
export declare function lambda(v: vc.V2[], la: (v: vc.V2[], i: number) => vc.V2): Curve;
/** (始点, 制御点, 終点) -> 2次ベジェ曲線 */
export declare function bezier2(start: vc.V2, mid: vc.V2, end: vc.V2): Curve;
/** ([始点, 制御点, 終点]) -> 2次ベジェ曲線 */
export declare function ar_bezier2(v: vc.V2[]): Curve;
/** (始点, 始点側制御点, 終点側制御点, 終点) -> 3次ベジェ曲線 */
export declare function bezier3(start: vc.V2, mid1: vc.V2, mid2: vc.V2, end: vc.V2): Curve;
/** ([始点, 始点側制御点, 終点側制御点, 終点]) -> 3次ベジェ曲線 */
export declare function ar_bezier3(v: vc.V2[]): Curve;
/** (中心, x, y) -> 楕円 */
export declare function ellipse(o: vc.V2, x: vc.V2, y: vc.V2): Curve;
/** (中心, x, y, z) -> 螺旋 */
export declare function spiral(o: vc.V2, x: vc.V2, y: vc.V2, z: vc.V2): Curve;
/** 連続曲線 */
export declare function multicurve2(curves: Curve[]): CurveArray;
