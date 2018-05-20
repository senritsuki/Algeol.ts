import * as vc from '../algorithm/vector';
import * as mx from '../algorithm/matrix';
import * as sf from './surface_core';


export interface AffineTransformation<V extends vc.Vector<V>, M extends mx.Matrix<M, V>> {
    do(): M;
    doRev(): M;
}
export interface AffineTransformation2 extends AffineTransformation<vc.V3, mx.M3> {}
export interface AffineTransformation3 extends AffineTransformation<vc.V4, mx.M4> {}

class BaseTransformation<V extends vc.Vector<V>, M extends mx.Matrix<M, V>, T> implements AffineTransformation<V, M> {
    constructor(
        public value: T,
        public map: (value: T) => M,
        public rev: (value: T) => T,
    ) {}
    do(): M {
        return this.map(this.value);
    }
    doRev(): M {
        return this.map(this.rev(this.value));
    }
}
class BaseAffineTransformation2<T> extends BaseTransformation<vc.V3, mx.M3, T> {}
class BaseAffineTransformation3<T> extends BaseTransformation<vc.V4, mx.M4, T> {}

class Translate2 extends BaseAffineTransformation2<vc.V2> {
    constructor(
        v: vc.V2|number[],
    ) {
        super(
            vc.to_v2_if(v),
            mx.affine2_translate,
            v => v.scalar(-1),
        );
    }
}
class Translate3 extends BaseAffineTransformation3<vc.V3> {
    constructor(
        v: vc.V3|number[],
    ) {
        super(
            vc.to_v3_if(v),
            mx.affine3_translate,
            v => v.scalar(-1),
        );
    }
}
class Rotate2 extends BaseAffineTransformation2<number> {
    constructor(
        rad: number,
    ) {
        super(
            rad,
            mx.affine2_rotate,
            rad => -rad,
        );
    }
}
class Rotate3 extends BaseAffineTransformation3<number> {
    constructor(
        rad: number,
        map: (rad: number) => mx.M4,
    ) {
        super(
            rad,
            map,
            rad => -rad,
        );
    }
}
class Rotate3X extends Rotate3 {
    constructor(rad: number) {
        super(rad, mx.affine3_rotate_x);
    }
}
class Rotate3Y extends Rotate3 {
    constructor(rad: number) {
        super(rad, mx.affine3_rotate_y);
    }
}
class Rotate3Z extends Rotate3 {
    constructor(rad: number) {
        super(rad, mx.affine3_rotate_z);
    }
}
class Scale2 extends BaseAffineTransformation2<vc.V2> {
    constructor(
        v: vc.V2|number[],
    ) {
        super(
            vc.to_v2_if(v),
            mx.affine2_scale,
            v => vc.v2(1, 1).el_div(v),
        );
    }
}
class Scale3 extends BaseAffineTransformation3<vc.V3> {
    constructor(
        v: vc.V3|number[],
    ) {
        super(
            vc.to_v3_if(v),
            mx.affine3_scale,
            v => vc.v3(1, 1, 1).el_div(v),
        );
    }
}

export interface Primitive<V extends vc.Vector<V>, M extends mx.Matrix<M, V>, P extends Primitive<V, M, P>>{
    affine_maps: AffineTransformation<V, M>[];
    merge_affine_maps(): M;
    merge_affine_maps_rev(): M;
    clone(): P;
}

export interface Primitive2 extends Primitive<vc.V3, mx.M3, Primitive2> {
    to_boolean(): (v: vc.V2) => boolean;
    to_surfaces(): sf.Surfaces;

    bool: (v: vc.V2) => boolean;
    verts: vc.V2[];
}
export interface Primitive3s extends Primitive<vc.V4, mx.M4, Primitive3s> {
    to_boolean(): (v: vc.V3) => boolean;
    to_surfaces(): sf.Surfaces;
}
export interface Primitive3g extends Primitive<vc.V4, mx.M4, Primitive3g> {
    to_surfaces(): sf.SurfaceModel;
}

export function bind<V extends vc.Vector<V>, M extends mx.Matrix<M, V>, P extends Primitive<V, M, P>>(p: Primitive<V, M, P>, affine_maps: AffineTransformation<V, M>[]): P {
    const p_new = p.clone();
    p_new.affine_maps = affine_maps;
    return p_new;
}
export function duplicate<V extends vc.Vector<V>, M extends mx.Matrix<M, V>, P extends Primitive<V, M, P>>(p: Primitive<V, M, P>, affine_maps_list: AffineTransformation<V, M>[][]): P[] {
    return affine_maps_list.map(affine_maps => {
        const p_new = p.clone();
        p_new.affine_maps = affine_maps;
        return p_new;
    });
}
export function compose_affine<T, V extends vc.Vector<V>, M extends mx.Matrix<M, V>>(data: T[], lambda: (d: T) => AffineTransformation<V, M>[]): AffineTransformation<V, M>[][] {
    return data.map(d => lambda(d));
}

class BasePrimitive3 implements Primitive3s {
    constructor(
        public bf: (v: vc.V3) => boolean,
        public sf: () => sf.Surfaces,
        public affine_maps: AffineTransformation3[] = [],
    ){}

    merge_affine_maps(): mx.M4 {
        return mx.compose(this.affine_maps.map(t => t.do()));
    }
    merge_affine_maps_rev(): mx.M4 {
        return mx.compose_rev(this.affine_maps.map(t => t.doRev()));
    }
    clone(): Primitive3s {
        return new BasePrimitive3(this.bf, this.sf, this.affine_maps);
    }
    to_boolean(): (v: vc.V3) => boolean {
        const map = this.merge_affine_maps_rev();
        const bf = this.bf;
        return v => bf(map.map_v3(v, 1));
    }
    to_surfaces(): sf.Surfaces {
        return sf.apply(this.sf(), this.merge_affine_maps());
    }
}
class BasePrimitive2 implements Primitive2 {
    constructor(
        public bool: (v: vc.V2) => boolean,
        public verts: vc.V2[],
        public affine_maps: AffineTransformation2[] = [],
    ) {}

    merge_affine_maps(): mx.M3 {
        return mx.compose(this.affine_maps.map(t => t.do()));
    }
    merge_affine_maps_rev(): mx.M3 {
        return mx.compose_rev(this.affine_maps.map(t => t.doRev()));
    }
    clone(): Primitive2 {
        return new BasePrimitive2(this.bool, this.verts, this.affine_maps);
    }
    to_boolean(): (v: vc.V2) => boolean {
        const map = this.merge_affine_maps_rev();
        const bf = this.bool;
        return v => bf(map.map_v2(v, 1));
    }
    to_surfaces(): sf.Surfaces {
        const verts = this.verts.map(v => vc.v2_to_v3(v, 0));
        const face_1 = this.verts.map((_, i) => i);
        const faces = [face_1];     // 面は1枚のみ
        return new sf.Surfaces(verts, faces);
    }
}

export interface PrimitiveMaterial {
    primitives: Primitive3s[];
    material: sf.Material|null;
}
export function primitives_material(primitives: Primitive3s[], material: sf.Material|null): PrimitiveMaterial {
    return {
        primitives,
        material,
    };
}

class BasePrimitiveGroup implements Primitive3g {
    constructor(
        public dict: {[name: string]: PrimitiveMaterial},
        public affine_maps: AffineTransformation3[] = [],
    ){}

    merge_affine_maps(): mx.M4 {
        return mx.compose(this.affine_maps.map(t => t.do()));
    }
    merge_affine_maps_rev(): mx.M4 {
        return mx.compose_rev(this.affine_maps.map(t => t.doRev()));
    }
    clone(): Primitive3g {
        return new BasePrimitiveGroup(this.dict, this.affine_maps);
    }
    to_surfaces(): sf.SurfaceModel {
        const list: sf.SurfaceModel[] = [];
        for (const key in this.dict) {
            const pm = this.dict[key];
            const sfs = pm.primitives.map(p => p.to_surfaces());
            const sfm = sf.merge_surfaces(sfs, pm.material);
            list.push(sfm);
        }
        return sf.concat_surface_models(list);
    }
}

export function primitive2(bf: (v: vc.V2) => boolean, verts: vc.V2[]): Primitive2 {
    return new BasePrimitive2(bf, verts);
}
export function primitive3(bf: (v: vc.V3) => boolean, sf: () => sf.Surfaces): Primitive3s {
    return new BasePrimitive3(bf, sf);
}
export function primitive_group(dict: {[name: string]: PrimitiveMaterial}): Primitive3g {
    return new BasePrimitiveGroup(dict);
}


export namespace af2 {
    export function translate(v: vc.V2|number[]): AffineTransformation2 {
        return new Translate2(v);
    }
    export function rotate(rad: number): AffineTransformation2 {
        return new Rotate2(rad);
    }
    export function scale(v: vc.V2|number[]): AffineTransformation2 {
        return new Scale2(v);
    }
}

export namespace af3 {
    export function translate(v: vc.V3|number[]): AffineTransformation3 {
        return new Translate3(v);
    }
    export function rotate_x(rad: number): AffineTransformation3 {
        return new Rotate3X(rad);
    }
    export function rotate_y(rad: number): AffineTransformation3 {
        return new Rotate3Y(rad);
    }
    export function rotate_z(rad: number): AffineTransformation3 {
        return new Rotate3Z(rad);
    }
    export function scale(v: vc.V3|number[]): AffineTransformation3 {
        return new Scale3(v);
    }
}

