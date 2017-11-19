/** Curve with Parametric Equation - パラメトリック方程式による曲線 */

import * as ut from "./utility";
import * as seq from "./sequence";
import * as vc from "./vector";

export let E = 0.001;


/** 位置ベクトルと方向ベクトルのペア */
export interface CD<T> {
    /** Coordinate Vector - 位置ベクトル */
    c(): T;
    /** Direction Vector - 方向ベクトル */
    d(): T;
}

/** 2次元の位置ベクトルと方向ベクトルのペア */
export interface CD2 extends CD<vc.V2> {}
/** 3次元の位置ベクトルと方向ベクトルのペア */
export interface CD3 extends CD<vc.V3> {}
/** 4次元の位置ベクトルと方向ベクトルのペア */
export interface CD4 extends CD<vc.V4> {}


/** Curve with Parametric Equation - パラメトリック方程式による曲線 */
export interface Curve<T> {
    /** パラメータiに対応する座標 */
    coord(i: number): T;
    /** パラメータiに対応する位置と方向 */
    cd(i: number, delta?: number): CD<T>;

    /** coord(0) と同値 */
    startPoint(): T;
    /** coord(1) と同値 */
    endPoint(): T;
    /** 制御点の配列 */
    controlPoints(): T[];
}

export interface Curve2 extends Curve<vc.V2> {}
export interface Curve3 extends Curve<vc.V3> {}
export interface Curve4 extends Curve<vc.V4> {}


/** 連続曲線 */
export interface CurveArray<T> extends Curve<T> {
    /** 曲線の配列 */
    curves(): Curve<T>[];
    /** 曲線の数 */
    curveNum(): number;
}

export interface CurveArray2 extends CurveArray<vc.V2> {}
export interface CurveArray3 extends CurveArray<vc.V3> {}
export interface CurveArray4 extends CurveArray<vc.V4> {}


namespace priv {
    export class CDImpl<T> implements CD<T> {
        constructor(
            public _c: T,
            public _d: T) { }

        c(): T {
            return this._c;
        }
        d(): T {
            return this._d;
        }
    }
        
    export class CurveArrayImpl<T extends vc.Vector<T>> implements CurveArray<T> {
        constructor(
            public _curves: Curve<T>[]){}

        coord(i: number): T {
            const j = i <= 0 ?
                0 :
                i >= this._curves.length - 1 ?
                    this._curves.length - 1 :
                    ut.floor(i);
            const k = i - j;
            return this._curves[j].coord(k);
        }
        cd(i: number, delta: number = E): CD<T> {
            const c = this.coord(i);
            const d1 = this.coord(i - delta);
            const d2 = this.coord(i + delta);
            return cd<T>(c, d2.sub(d1));
        }

        startPoint(): T {
            return this.coord(0);
        }
        endPoint(): T {
            return this.coord(1);
        }
        controlPoints(): T[] {
            return this._curves.map(c => c.controlPoints()).reduce((a, b) => a.concat(b), <T[]>[]);
        }

        curves(): Curve<T>[] {
            return this._curves.slice(0);
        }
        curveNum(): number {
            return this._curves.length;
        }
    }

    abstract class CurveBase<T extends vc.Vector<T>> implements Curve<T> {
        constructor(
            public _v: T[]) { }

        startPoint(): T {
            return this.coord(0);
        }
        endPoint(): T {
            return this.coord(1);
        }
        controlPoints(): T[] {
            return this._v.slice(0);
        }

        cd(i: number, delta: number = E): CD<T> {
            const c = this.coord(i);
            const d1 = this.coord(i - delta);
            const d2 = this.coord(i + delta);
            return cd(c, d2.sub(d1));
        }
        abstract coord(i: number): T;
    }

    /** (2次元ベクトル配列, 媒介変数) -> 2次元ベクトル を満たす任意の関数で定義される曲線 */
    export class LambdaCurve<T extends vc.Vector<T>> extends CurveBase<T> {
        constructor(
            v: T[],
            public _lambda: (v: T[], i: number) => T) {
            super(v);
        }
        coord(i: number): T {
            return this._lambda(this._v, i);
        }
    }

    /** 直線・一次曲線 */
    export class Line<T extends vc.Vector<T>> extends CurveBase<T> {
        constructor(start: T, end: T) {
            super([start, end]);
        }
        coord(i: number): T {
            const c0 = this._v[0].scalar(1 - i);
            const c1 = this._v[1].scalar(i);
            return c0.add(c1);
        }
    }

    /** ベジェ曲線 */
    export class BezierCurve<T extends vc.Vector<T>> extends CurveBase<T> {
        constructor(controlPoints: T[]) {
            super(controlPoints);
        }
        coord(i: number): T {
            return seq.bernstein(this.controlPoints().length, i)
                .map((n, j) => this._v[j].scalar(n))
                .reduce((a, b) => a.add(b));
        }
    }

    /** 楕円 */
    export class Ellipse<T extends vc.Vector<T>> extends CurveBase<T> {
        constructor(o: T, x: T, y: T) {
            super([o, x, y]);
        }
        coord(i: number): T {
            const rad = i * ut.deg360;
            const o = this._v[0];
            const dx = this._v[1].sub(o).scalar(ut.cos(rad));
            const dy = this._v[2].sub(o).scalar(ut.sin(rad));
            return o.add(dx).add(dy);
        }
    }

    /** 螺旋 */
    export class Spiral<T extends vc.Vector<T>> extends CurveBase<T> {
        constructor(o: T, x: T, y: T, z: T) {
            super([o, x, y, z]);
        }
        coord(i: number): T {
            const rad = i * ut.deg360;
            const o = this._v[0];
            const dx = this._v[1].sub(o).scalar(ut.cos(rad));
            const dy = this._v[2].sub(o).scalar(ut.sin(rad));
            const dz = this._v[3].sub(o).scalar(i);
            return o.add(dx).add(dy).add(dz);
        }
    }
}


/** 位置ベクトルと方向ベクトルのペア */
export const cd = <T>(c: T, d: T): CD<T> => new priv.CDImpl<T>(c, d);
/** 2次元の位置ベクトルと方向ベクトルのペア */
export const cd2 = (c: vc.V2, d: vc.V2): CD2 => cd(c, d);
/** 3次元の位置ベクトルと方向ベクトルのペア */
export const cd3 = (c: vc.V3, d: vc.V3): CD3 => cd(c, d);
/** 4次元の位置ベクトルと方向ベクトルのペア */
export const cd4 = (c: vc.V4, d: vc.V4): CD4 => cd(c, d);


/** (始点, 終点) -> 直線 */
export const line = <T extends vc.Vector<T>>(start: T, end: T): Curve<T> => new priv.Line<T>(start, end);
/** (始点, 終点) -> 直線 */
export const line2 = (start: vc.V2, end: vc.V2): Curve2 => line(start, end);
/** (始点, 終点) -> 直線 */
export const line3 = (start: vc.V3, end: vc.V3): Curve3 => line(start, end);
/** (始点, 終点) -> 直線 */
export const line4 = (start: vc.V4, end: vc.V4): Curve4 => line(start, end);


/** (ベクトル配列, 媒介変数) -> ベクトル を満たす任意の関数で定義される曲線 */
export const lambda = <T extends vc.Vector<T>>(v: T[], la: (v: T[], i: number) => T): Curve<T> => new priv.LambdaCurve<T>(v, la);
/** (ベクトル配列, 媒介変数) -> ベクトル を満たす任意の関数で定義される曲線 */
export const lambda2 = (v: vc.V2[], la: (v: vc.V2[], i: number) => vc.V2): Curve2 => lambda(v, la);
/** (ベクトル配列, 媒介変数) -> ベクトル を満たす任意の関数で定義される曲線 */
export const lambda3 = (v: vc.V3[], la: (v: vc.V3[], i: number) => vc.V3): Curve3 => lambda(v, la);
/** (ベクトル配列, 媒介変数) -> ベクトル を満たす任意の関数で定義される曲線 */
export const lambda4 = (v: vc.V4[], la: (v: vc.V4[], i: number) => vc.V4): Curve4 => lambda(v, la);


/** (制御点配列) -> ベジェ曲線. 制御点が3つなら2次、4つなら3次のベジェ曲線となる */
export const bezier = <T extends vc.Vector<T>>(controlPoints: T[]): Curve<T> => new priv.BezierCurve<T>(controlPoints);
/** (制御点配列) -> ベジェ曲線. 制御点が3つなら2次、4つなら3次のベジェ曲線となる */
export const bezier2 = (controlPoints: vc.V2[]): Curve2 => bezier(controlPoints);
/** (制御点配列) -> ベジェ曲線. 制御点が3つなら2次、4つなら3次のベジェ曲線となる */
export const bezier3 = (controlPoints: vc.V3[]): Curve3 => bezier(controlPoints);
/** (制御点配列) -> ベジェ曲線. 制御点が3つなら2次、4つなら3次のベジェ曲線となる */
export const bezier4 = (controlPoints: vc.V4[]): Curve4 => bezier(controlPoints);


/** (中心, x, y) -> 楕円 */
export const ellipse = <T extends vc.Vector<T>>(o: T, x: T, y: T): Curve<T> => new priv.Ellipse<T>(o, x, y);
/** (中心, x, y) -> 楕円 */
export const ellipse2 = (o: vc.V2, x: vc.V2, y: vc.V2): Curve2 => ellipse(o, x, y);
/** (中心, x, y) -> 楕円 */
export const ellipse3 = (o: vc.V3, x: vc.V3, y: vc.V3): Curve3 => ellipse(o, x, y);
/** (中心, x, y) -> 楕円 */
export const ellipse4 = (o: vc.V4, x: vc.V4, y: vc.V4): Curve4 => ellipse(o, x, y);


/** (中心, x, y, z) -> 螺旋 */
export const spiral = <T extends vc.Vector<T>>(o: T, x: T, y: T, z: T): Curve<T> => new priv.Spiral<T>(o, x, y, z);
/** (中心, x, y, z) -> 螺旋 */
export const spiral2 = (o: vc.V2, x: vc.V2, y: vc.V2, z: vc.V2): Curve2 => spiral(o, x, y, z);
/** (中心, x, y, z) -> 螺旋 */
export const spiral3 = (o: vc.V3, x: vc.V3, y: vc.V3, z: vc.V3): Curve3 => spiral(o, x, y, z);
/** (中心, x, y, z) -> 螺旋 */
export const spiral4 = (o: vc.V4, x: vc.V4, y: vc.V4, z: vc.V4): Curve4 => spiral(o, x, y, z);


/** 連続曲線 */
export const curves = <T extends vc.Vector<T>>(curveArray: Curve<T>[]): CurveArray<T> => new priv.CurveArrayImpl<T>(curveArray);
/** 連続曲線 */
export const curves2 = (curveArray: Curve2[]): CurveArray2 => curves(curveArray);
/** 連続曲線 */
export const curves3 = (curveArray: Curve3[]): CurveArray3 => curves(curveArray);
/** 連続曲線 */
export const curves4 = (curveArray: Curve4[]): CurveArray4 => curves(curveArray);


/** 折れ線 */
export const lines = <T extends vc.Vector<T>>(verts: T[]): CurveArray<T> => curves(seq.arith(verts.length - 1, 1).map(i => line(verts[i - 1], verts[i])));
/** 折れ線 */
export const lines2 = (verts: vc.V2[]): CurveArray2 => lines(verts);
/** 折れ線 */
export const lines3 = (verts: vc.V3[]): CurveArray3 => lines(verts);
/** 折れ線 */
export const lines4 = (verts: vc.V4[]): CurveArray4 => lines(verts);
