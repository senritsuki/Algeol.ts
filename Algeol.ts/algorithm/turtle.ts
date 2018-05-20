/** Turtle graphics - タートルグラフィックス */

import * as ut from './utility';
import * as vc from './vector';
import * as cv from './curve';


/** タートル（T: タートル実装の型, V: 座標ベクトルの型） */
export interface Turtle<T, V extends vc.Vector<V>> {
    coord(): V;
    move(len: number): TupleTurtleLine<T, V>;
}

export interface TurtleD extends Turtle<TurtleD, vc.V2> {
    degree(): number;
    setDegree(degree: number): TurtleD;
    addDegree(degree: number): TurtleD;
}
export interface TurtleV<V extends vc.Vector<V>> extends Turtle<TurtleV<V>, V> {
    dir(): V;
    setDir(dir: V): TurtleV<V>;
    addDir(dir: V): TurtleV<V>;
}
export interface TurtleV2 extends TurtleV<vc.V2> {}
export interface TurtleV3 extends TurtleV<vc.V3> {}
export interface TurtleV4 extends TurtleV<vc.V4> {}

export interface TupleTurtleLine<T, V extends vc.Vector<V>> {
    turtle: T;
    line: cv.Curve<V>;
}


namespace priv {
    export class TLTupleImpl<T extends Turtle<T, V>, V extends vc.Vector<V>> implements TupleTurtleLine<T, V> {
        constructor(
            public turtle: T,
            public line: cv.Curve<V>,
        ) {}
    }

    export abstract class TurtleImpl<T extends Turtle<T, V>, V extends vc.Vector<V>> implements Turtle<T, V> {
        constructor(
            public _coord: V) {}

        coord(): V {
            return this._coord;
        }
        abstract move(len: number): TupleTurtleLine<T, V>;
    }
    export class TurtleDImpl extends TurtleImpl<TurtleDImpl, vc.V2> implements TurtleD {
        constructor(
            _coord: vc.V2,
            public _degree: number) {
                super(_coord);
        }
        move(len: number): TupleTurtleLine<TurtleDImpl, vc.V2> {
            const src = this._coord;
            const dir = vc.polar_to_v2(len, ut.deg_to_rad(this._degree));
            const dst = this._coord.add(dir);
            const newTurtle = new TurtleDImpl(dst, this._degree);
            const line = cv.line(src, dst);
            return new TLTupleImpl<TurtleDImpl, vc.V2>(newTurtle, line);
        }
        degree(): number {
            return this._degree;
        }
        setDegree(degree: number): TurtleD {
            return new TurtleDImpl(this._coord, degree);
        }
        addDegree(degree: number): TurtleD {
            return new TurtleDImpl(this._coord, this._degree + degree);
        }
    }
    export class TurtleVImpl<V extends vc.Vector<V>> extends TurtleImpl<TurtleVImpl<V>, V> implements TurtleV<V> {
        constructor(
            _coord: V,
            public _dir: V) {
                super(_coord);
        }
        move(len: number): TupleTurtleLine<TurtleVImpl<V>, V> {
            const src = this._coord;
            const dir = this._dir.scalar(len);
            const dst = this._coord.add(dir);
            const newTurtle = new TurtleVImpl(dst, this._dir);
            const line = cv.line<V>(src, dst);
            return new TLTupleImpl<TurtleVImpl<V>, V>(newTurtle, line);
        }
        dir(): V {
            return this._dir;
        }
        setDir(dir: V): TurtleV<V> {
            return new TurtleVImpl(this._coord, dir);
        }
        addDir(dir: V): TurtleV<V> {
            return new TurtleVImpl(this._coord, this._dir.add(dir));
        }
    }
}


export const turtle_with_deg = (coord: vc.V2, degree: number): TurtleD => new priv.TurtleDImpl(coord, degree);

export const turtle_with_dir = <V extends vc.Vector<V>>(coord: V, dir: V): TurtleV<V> => new priv.TurtleVImpl<V>(coord, dir);
export const turtle_with_dir2 = (coord: vc.V2, dir: vc.V2): TurtleV<vc.V2> => turtle_with_dir(coord, dir);
export const turtle_with_dir3 = (coord: vc.V3, dir: vc.V3): TurtleV<vc.V3> => turtle_with_dir(coord, dir);
export const turtle_with_dir4 = (coord: vc.V4, dir: vc.V4): TurtleV<vc.V4> => turtle_with_dir(coord, dir);

