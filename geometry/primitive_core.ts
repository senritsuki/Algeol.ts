import * as vc from '../algorithm/vector';
import * as mx from '../algorithm/matrix';
import * as sf from './surface_core';

export interface Primitive {
    apply(translation: Translation3|Translation3[]): void;
    to_boolean(): (v: vc.V3) => boolean;
    to_surfaces(): sf.Surfaces;
}
export class BasePrimitive implements Primitive {
    constructor(
        public b3: (v: vc.V3) => boolean,
        public sf: () => sf.Surfaces,
        public translations: Translation3[] = [],
    ){}

    apply(translation: Translation3|Translation3[]): void {
        this.translations = this.translations.concat(translation);
    }
    to_boolean(): (v: vc.V3) => boolean {
        const map = this.merge_translation_rev();
        const b3 = this.b3;
        return v => b3(map.map_v3(v, 1));
    }
    to_surfaces(): sf.Surfaces {
        return sf.apply(this.sf(), this.merge_translation());
    }

    merge_translation(): mx.M4 {
        return mx.compose(this.translations.map(t => t.do()));
    }
    merge_translation_rev(): mx.M4 {
        return mx.compose_rev(this.translations.map(t => t.doRev()));
    }
}

export class Plane {
    constructor(
        public b2: (v: vc.V2) => boolean,
        public sf: vc.V2[],
    ) {}
}

export interface Translation2 {
    do(): mx.M3;
    doRev(): mx.M3;
}
export interface Translation3 {
    do(): mx.M4;
    doRev(): mx.M4;
}

export class BaseTranslation2<T> implements Translation2 {
    constructor(
        public value: T,
        public map: (value: T) => mx.M3,
        public rev: (value: T) => T,
    ) {}

    do(): mx.M3 {
        return this.map(this.value);
    }
    doRev(): mx.M3 {
        return this.map(this.rev(this.value));
    }
}
export class BaseTranslation3<T> implements Translation3 {
    constructor(
        public value: T,
        public map: (value: T) => mx.M4,
        public rev: (value: T) => T,
    ) {}

    do(): mx.M4 {
        return this.map(this.value);
    }
    doRev(): mx.M4 {
        return this.map(this.rev(this.value));
    }
}

export class Translate2 extends BaseTranslation2<vc.V2> {
    constructor(
        v: vc.V2|number[],
    ) {
        super(
            vc.to_v2_if(v),
            mx.affine2_trans,
            v => v.scalar(-1),
        );
    }
}
export class Translate3 extends BaseTranslation3<vc.V3> {
    constructor(
        v: vc.V3|number[],
    ) {
        super(
            vc.to_v3_if(v),
            mx.affine3_trans,
            v => v.scalar(-1),
        );
    }
}
export class Rotate extends BaseTranslation3<number> {
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
export class RotateX extends Rotate {
    constructor(rad: number) {
        super(rad, mx.affine3_rot_x);
    }
}
export class RotateY extends Rotate {
    constructor(rad: number) {
        super(rad, mx.affine3_rot_y);
    }
}
export class RotateZ extends Rotate {
    constructor(rad: number) {
        super(rad, mx.affine3_rot_z);
    }
}
export class Scale extends BaseTranslation3<vc.V3> {
    constructor(
        v: vc.V3|number[],
    ) {
        super(
            vc.to_v3_if(v),
            mx.scale_m4,
            v => vc.v3(1, 1, 1).el_div(v),
        );
    }
}
