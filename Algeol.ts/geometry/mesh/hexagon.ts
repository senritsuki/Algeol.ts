import * as sq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';
import * as vsq from '../../algorithm/vector_sequence';

export class XY<V extends vc.Vector<V>> {
    constructor(
        public x: V,
        public y: V,
    ) {}

    at(x: number, y: number): V {
        return vc.add(this.x.scalar(x), this.y.scalar(y))
    }
    hex(ox: number, oy: number, r: number): V[] {
        const o = this.at(ox, oy);
        return [
            o.add(this.at(r, 0)),
            o.add(this.at(r, r)),
            o.add(this.at(0, r)),
            o.add(this.at(-r, 0)),
            o.add(this.at(-r, -r)),
            o.add(this.at(0, -r)),
        ];
    }
    hex_range(ox: number, oy: number, r: number, c: number): V[] {
        const hex = this.hex(ox, oy, r);
        return sq.arithmetic(6)
            .map(i => vsq.range(hex[i], hex[(i+1)%6], c+1, true))
            .reduce((a, b) => a.concat(b));
    }
}

export class HexBasis<V extends vc.Vector<V>> {
    constructor(
        public a: V, 
        public b: V, 
        public c: V,   // d2.sub(d1)
    ) {}

    d0(): XY<V> {
        return new XY(this.a, this.c);
    }
    d1(): XY<V> {
        return new XY(this.b, this.a.scalar(-1));
    }
    d2(): XY<V> {
        return new XY(this.c, this.b.scalar(-1));
    }
    d3(): XY<V> {
        return new XY(this.a.scalar(-1), this.c.scalar(-1));
    }
    d4(): XY<V> {
        return new XY(this.b.scalar(-1), this.a);
    }
    d5(): XY<V> {
        return new XY(this.c.scalar(-1), this.b);
    }
}

export function verts<V extends vc.Vector<V>>(o: V, dx: V, dy: V, r: number): V[] {
    let l = [o];
    if (r <= 0) return l;
    const basis = new HexBasis(dx, dy, dy.sub(dx));
    const xy = basis.d0();
    for (let i = 1; i <= r; i++) {
        l = l.concat(xy.hex_range(0, 0, i, i));
    }
    return l;
}

export function faces_rectangle_u(r: number): number[][] {
    let l = [
        [0, 1, 2],
        [0, 3, 4],
        [0, 5, 6],
    ];
    //let offset = 7;
    for (let i = 1; i < r; i++) {
        for (let j = 0; j < 6; j++) {
            if (j % 2 == 0) {
                for (let k = 0; k < i+1; k++) {

                }
            } else {

            }
        }
        //offset += i * 6;
    }
    return l;
}
