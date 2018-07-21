import * as sq from '../../algorithm/sequence';
import * as vc from '../../algorithm/vector';


export class CurvePlane1<V extends vc.Vector<V>> {
    constructor(
        public v1: V,
        public curve: V[],
    ) {}

    verts(): V[] {
        return this.curve.concat([this.v1]);
    }

    faces(): number[][] {
        const iv1 = this.curve.length;
        return sq.arithmetic(this.curve.length - 1)
            .map(i => [i, i+1, iv1]);
    }
}

export class CurvePlane2<V extends vc.Vector<V>> {
    constructor(
        public v1: V,
        public v2: V,
        public curve: V[],
    ) {}

    verts(): V[] {
        return this.curve.concat([this.v1, this.v2]);
    }

    faces(): number[][] {
        const iv1 = this.curve.length;
        const iv2 = this.curve.length + 1;
        const max = this.curve.length - 1;
        const mid = Math.floor(max / 2);
        const faces1 = sq.arithmetic(mid - 1, 0)
            .map(i => [i, i+1, iv1]);
        const faces2 = sq.arithmetic(max - mid - 1, mid)
            .map(i => [i, i+1, iv2]);
        const faces3 = [[mid, iv1, iv2]];
        return faces1.concat(faces2).concat(faces3);
    }
}
