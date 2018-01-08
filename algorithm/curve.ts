/** Curve with Parametric Equation - パラメトリック方程式による曲線 */

import * as ut from "./utility";
import * as seq from "./sequence";
import * as vc from "./vector";
import * as mx from "./matrix";

export let E = 0.001;

type V2 = vc.V2;
type V3 = vc.V3;
type V4 = vc.V4;


/** 位置ベクトルと方向ベクトルのペア */
export class Ray<T extends vc.Vector<T>> {
    constructor(
        /** 位置ベクトル */
        public c: T,
        /** 方向ベクトル */
        public d: T,
    ) { }

    /** c + td */
    p(t: number): T {
        const d = this.d.scalar(t);
        return this.c.add(d);
    }
    unit(): Ray<T> {
        const d = this.d.unit();
        return new Ray(this.c, d);
    }
    toString(): string {
        return `{ c: ${this.c.toString03f()}, d: ${this.d.toString03f()} }`;
    }
}

export interface Ray2 extends Ray<V2> {}
export interface Ray3 extends Ray<V3> {}
export interface Ray4 extends Ray<V4> {}


/** 位置ベクトルと方向ベクトルのペア */
export function ray<T extends vc.Vector<T>>(c: T, d: T): Ray<T> {
    return new Ray(c, d);
}

export function ray3_to_ray2(ray3: Ray3): Ray2 {
    const c = vc.v3_to_v2(ray3.c);
    const d = vc.v3_to_v2(ray3.d);
    return ray(c, d);
}

export function rot_ray3d_z(ray3: Ray3, rad: number): Ray3 {
    const d = mx.rot_z_m3(rad).map(ray3.d);
    return ray(ray3.c, d);
}

export function map_ray3(ray3: Ray3, f: (v: V4) => V4): Ray3 {
    const c = vc.v4map_v3(ray3.c, 1, f);
    const d = vc.v4map_v3(ray3.d, 0, f);
    return ray(c, d);
}


/** Parametric Equation - パラメトリック方程式による曲線 */
export interface Curve<T extends vc.Vector<T>> {
    /** 制御点の配列（生の参照） */
    v: T[];

    /** パラメータiに対応する座標 */
    coord(t: number): T;
    /** パラメータiに対応する位置と方向 */
    ray(t: number, delta?: number): Ray<T>;

    /** coord(0.0) と同値 */
    start(): T;
    /** coord(1.0) と同値 */
    end(): T;
    /** 制御点の配列 */
    controls(): T[];

    /** 線形変換・非線形変換 */
    translate(fn: (v: T) => T): Curve<T>;
}

interface CurveC<T extends vc.Vector<T>, U extends Curve<T>> extends Curve<T> {
    /** 複製 */
    clone(): U;
}

export interface Curve2 extends Curve<V2> {}
export interface Curve3 extends Curve<V3> {}
export interface Curve4 extends Curve<V4> {}

abstract class CurveBase<T extends vc.Vector<T>, U extends CurveC<T, U>> implements CurveC<T, U> {
    constructor(
        public v: T[],
    ) { }

    start(): T {
        return this.coord(0);
    }
    end(): T {
        return this.coord(1);
    }
    controls(): T[] {
        return this.v.slice(0);
    }

    ray(t: number, delta: number = E): Ray<T> {
        const c = this.coord(t);
        const d1 = this.coord(t - delta);
        const d2 = this.coord(t + delta);
        return new Ray(c, d2.sub(d1));
    }
    translate(fn: (v: T) => T): U {
        const new_curve = this.clone();
        new_curve.v = this.v.map(d => fn(d));
        return new_curve;
    }

    abstract clone(): U;
    abstract coord(i: number): T;

    toString(): string {
        return `[${ this.v.map(v => v.toString03f()).join(', ') }]`;
    }
}

/** (2次元ベクトル配列, 媒介変数) -> 2次元ベクトル を満たす任意の関数で定義される曲線 */
class LambdaCurve<T extends vc.Vector<T>> extends CurveBase<T, LambdaCurve<T>> {
    constructor(
        v: T[],
        public _lambda: (v: T[], i: number) => T) {
        super(v);
    }
    clone(): LambdaCurve<T> {
        return new LambdaCurve(this.v, this._lambda);
    }
    coord(t: number): T {
        return this._lambda(this.v, t);
    }
}

/** 直線（一次曲線） */
class Line<T extends vc.Vector<T>> extends CurveBase<T, Line<T>> {
    constructor(start: T, end: T) {
        super([start, end]);
    }
    clone(): Line<T> {
        return new Line(this.v[0], this.v[1]);
    }
    coord(t: number): T {
        const c0 = this.v[0].scalar(1 - t);
        const c1 = this.v[1].scalar(t);
        return c0.add(c1);
    }
}

/** Bezier Curve - ベジェ曲線 */
class BezierCurve<T extends vc.Vector<T>> extends CurveBase<T, BezierCurve<T>> {
    constructor(controls: T[]) {
        super(controls);
    }
    clone(): BezierCurve<T> {
        return new BezierCurve(this.v);
    }
    coord(t: number): T {
        const n = this.v.length - 1;   // 制御点4つなら3次
        return this.v 
            .map((v, i) => v.scalar(ut.bernstein_basis(n, i, t)))
            .reduce((a, b) => a.add(b));
    }
}

/** B-Spline Curve - Bスプライン曲線 */
class BSplineCurve<T extends vc.Vector<T>> extends CurveBase<T, BSplineCurve<T>> {
    constructor(
        controls: T[], 
        public degree: number,
    ) {
        super(controls);
    }
    clone(): BSplineCurve<T> {
        return new BSplineCurve(this.v, this.degree);
    }
    coord(t: number): T {
        const degree = this.degree;
        const knots = seq.arith(this.v.length + degree + 1);
        return this.v
            .map((v, i) => v.scalar(ut.b_spline_basis(knots, i, degree, t)))
            .reduce((a, b) => a.add(b));
    }
}

/** NURBS: Non-Uniform Rational B-Spline Curve */
class NURBS<T extends vc.Vector<T>> extends CurveBase<T, NURBS<T>> {
    constructor(
        controls: T[], 
        public degree: number,
        public knots: number[],
        public weights: number[],
    ) {
        super(controls);
    }
    clone(): NURBS<T> {
        return new NURBS(this.v, this.degree, this.knots, this.weights);
    }
    coord(t: number): T {
        const controls = this.v;
        const degree = this.degree;
        const knots = this.knots;
        const weights = this.weights;
        const index = seq.arith(controls.length);
        const n1 = index
            .map(i => weights[i] * ut.b_spline_basis(knots, i, degree, t))
            .map((n, i) => controls[i].scalar(n))
            .reduce((a, b) => a.add(b));
        const n2 = index
            .map(i => weights[i] * ut.b_spline_basis(knots, i, degree, t))
            .reduce((a, b) => a + b);
        return n1.scalar(1 / n2);
    }
}

/**
 * 円・楕円
 * dx=x-o, dy=y-o
 * (0) -> o+dx
 * (1/4) -> o+dy
 * (2/4) -> o-dx
 * (3/4) -> o-dy
 * (1) -> o+dx
 */
class Circle<T extends vc.Vector<T>> extends CurveBase<T, Circle<T>> {
    constructor(o: T, x: T, y: T) {
        super([o, x, y]);
    }
    clone(): Circle<T> {
        return new Circle(this.v[0], this.v[1], this.v[2]);
    }
    coord(t: number): T {
        const rad = t * ut.deg360;
        const o = this.v[0];
        const dx = this.v[1].sub(o).scalar(Math.cos(rad));
        const dy = this.v[2].sub(o).scalar(Math.sin(rad));
        return o.add(dx).add(dy);
    }
}

/**
 * 螺旋
 * dx=x-o, dy=y-o, dz=z-o
 * (0) -> o+dx
 * (1/4) -> o+dy+(1/4)dz
 * (2/4) -> o-dx+(2/4)dz
 * (3/4) -> o-dy+(3/4)dz
 * (1) -> o+dx+dz
 */
class Spiral<T extends vc.Vector<T>> extends CurveBase<T, Spiral<T>> {
    constructor(o: T, x: T, y: T, z: T) {
        super([o, x, y, z]);
    }
    clone(): Spiral<T> {
        return new Spiral(this.v[0], this.v[1], this.v[2], this.v[3]);
    }
    coord(i: number): T {
        const rad = i * ut.deg360;
        const o = this.v[0];
        const dx = this.v[1].sub(o).scalar(Math.cos(rad));
        const dy = this.v[2].sub(o).scalar(Math.sin(rad));
        const dz = this.v[3].sub(o).scalar(i);
        return o.add(dx).add(dy).add(dz);
    }
}

/**
 * 代数螺旋
 * dx=x-o, dy=y-o, dz=z-o
 * (0) -> o
 * (1/4) -> o+(1/4)dy+(1/4)dz
 * (2/4) -> o-(2/4)dx+(2/4)dz
 * (3/4) -> o-(3/4)dy+(3/4)dz
 * (1) -> o+a*dx+dz
 */
class ArchimedeanSpiral<T extends vc.Vector<T>> extends CurveBase<T, Spiral<T>> {
    constructor(o: T, x: T, y: T, z: T) {
        super([o, x, y, z]);
    }
    clone(): Spiral<T> {
        return new Spiral(this.v[0], this.v[1], this.v[2], this.v[3]);
    }
    coord(i: number): T {
        const rad = i * ut.deg360;
        const o = this.v[0];
        const dx = this.v[1].sub(o).scalar(i * Math.cos(rad));
        const dy = this.v[2].sub(o).scalar(i * Math.sin(rad));
        const dz = this.v[3].sub(o).scalar(i);
        return o.add(dx).add(dy).add(dz);
    }
}

/** 連続曲線 */
export class CurveArray<T extends vc.Vector<T>> {
    constructor(
        public _curves: Curve<T>[]){}

    coord(t: number): T {
        const j = t <= 0 ?
            0 :
            t >= this._curves.length - 1 ?
                this._curves.length - 1 :
                Math.floor(t);
        const k = t - j;
        return this._curves[j].coord(k);
    }
    cd(t: number, delta: number = E): Ray<T> {
        const c = this.coord(t);
        const d1 = this.coord(t - delta);
        const d2 = this.coord(t + delta);
        return new Ray(c, d2.sub(d1));
    }

    start(): T {
        return this.coord(0);
    }
    end(): T {
        return this.coord(1);
    }
    controls(): T[] {
        return this._curves.map(c => c.controls()).reduce((a, b) => a.concat(b), <T[]>[]);
    }

    /** 曲線の配列 */
    curves(): Curve<T>[] {
        return this._curves.slice(0);
    }
    /** 曲線の数 */
    curveNum(): number {
        return this._curves.length;
    }
}

export interface CurveArray2 extends CurveArray<V2> {}
export interface CurveArray3 extends CurveArray<V3> {}
export interface CurveArray4 extends CurveArray<V4> {}



/** 直線 */
export function line<T extends vc.Vector<T>>(start: T, end: T): Curve<T> {
    return new Line<T>(start, end);
}

/** (ベクトル配列, 媒介変数) -> ベクトル を満たす任意の関数で定義される曲線 */
export function lambda<T extends vc.Vector<T>>(v: T[], fn: (v: T[], i: number) => T): Curve<T> {
    return new LambdaCurve<T>(v, fn);
}

/** ベジェ曲線. 制御点が3つなら2次、4つなら3次のベジェ曲線となる */
export function bezier<T extends vc.Vector<T>>(controlPoints: T[]): Curve<T> {
    return new BezierCurve<T>(controlPoints);
}
/** B-Spline曲線 */
export function b_spline<T extends vc.Vector<T>>(controlPoints: T[], degree: number): Curve<T> {
    return new BSplineCurve<T>(controlPoints, degree);
}
/** NURBS曲線 */
export function nurbs<T extends vc.Vector<T>>(controlPoints: T[], degree: number, knots: number[], weights: number[]): Curve<T> {
    return new NURBS<T>(controlPoints, degree, knots, weights);
}

/**
 * 円・楕円
 * dx=x-o, dy=y-o
 * (0) -> o+dx
 * (1/4) -> o+dy
 * (2/4) -> o-dx
 * (3/4) -> o-dy
 * (1) -> o+dx
 */
export function circle<T extends vc.Vector<T>>(o: T, x: T, y: T): Curve<T> {
    return new Circle<T>(o, x, y);
}
/**
 * 螺旋
 * dx=x-o, dy=y-o, dz=z-o
 * (0) -> o+dx
 * (1/4) -> o+dy+(1/4)dz
 * (2/4) -> o-dx+(2/4)dz
 * (3/4) -> o-dy+(3/4)dz
 * (1) -> o+dx+dz
 */
export function spiral<T extends vc.Vector<T>>(o: T, x: T, y: T, z: T): Curve<T> {
    return new Spiral<T>(o, x, y, z);
}
/**
 * 代数螺旋
 * dx=x-o, dy=y-o, dz=z-o
 * (0) -> o
 * (1/4) -> o+(1/4)dy+(1/4)dz
 * (2/4) -> o-(2/4)dx+(2/4)dz
 * (3/4) -> o-(3/4)dy+(3/4)dz
 * (1) -> o+a*dx+dz
 */
export function archimedean_spiral<T extends vc.Vector<T>>(o: T, x: T, y: T, z: T): Curve<T> {
    return new ArchimedeanSpiral<T>(o, x, y, z);
}


/** 連続曲線 */
export function curves<T extends vc.Vector<T>>(curveArray: Curve<T>[]): CurveArray<T> {
    return new CurveArray<T>(curveArray);
}

/** 折れ線 */
export function lines<T extends vc.Vector<T>>(verts: T[]): CurveArray<T> {
    return curves(seq.arith(verts.length - 1, 1).map(i => line(verts[i - 1], verts[i])));
}


/** ベジェ曲線で円弧を再現する際の制御点係数. 90度の場合: 0.5522847 */
export const bezier_arc_p = (rad: number): number => 4 / 3 * Math.tan(rad / 4);

/** 三次ベジェのS字カーブ */
export function bezier3_interpolate_s<T extends vc.Vector<T>>(p0: T, p1: T, d: T): Curve<T> {
    const c0 = p0.scalar(2).add(p1).scalar(1/3).sub(d);
    const c1 = p1.scalar(2).add(p0).scalar(1/3).add(d);
    const controls = [p0, c0, c1, p1];
    return bezier(controls);
}
/** 三次ベジェの楕円弧カーブ */
export function bezier3_interpolate_arc(p0: V3, p1: V3, o: V3): Curve3 {
    const d0 = p0.sub(o);
    const d1 = p1.sub(o);
    d0._v[2] = 0;
    d1._v[2] = 0;
    const rad = d0.angle(d1);
    const n = bezier_arc_p(rad) * d0.length();
    const e0 = mx.rot_z_m3(ut.deg90).map(d0).unit().scalar(n);
    const e1 = mx.rot_z_m3(-ut.deg90).map(d1).unit().scalar(n);
    const c0 = p0.add(e0);
    const c1 = p1.add(e1);
    const controls = [p0, c0, c1, p1];
    return bezier(controls);
}
