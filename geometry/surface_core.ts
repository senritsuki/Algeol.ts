/** Geometry */

import * as vc from "../algorithm/vector";
import * as mx from "../algorithm/matrix";

type IndexList = number[];
type RGB01 = number[];

function shift_offset(face: IndexList, index_offset: number): IndexList {
    return face.map(n => n + index_offset);
}

export interface IMap<T extends IMap<T>> {
    clone(): T;
    map(f: (v: vc.V4) => vc.V4): T;
}

export function apply<T extends IMap<T>>(sf: T, m: mx.M4): T {
    return sf.map(v => m.map(v));
}
export function translate<T extends IMap<T>>(sf: T, v_add: number[]|vc.V3): T {
    return apply(sf, mx.affine3_trans(v_add));
}
export function rotate_x<T extends IMap<T>>(sf: T, rad: number): T {
    return apply(sf, mx.affine3_rot_x(rad));
}
export function rotate_y<T extends IMap<T>>(sf: T, rad: number): T {
    return apply(sf, mx.affine3_rot_y(rad));
}
export function rotate_z<T extends IMap<T>>(sf: T, rad: number): T {
    return apply(sf, mx.affine3_rot_z(rad));
}
export function scale<T extends IMap<T>>(sf: T, v: number[]|vc.V3): T {
    return apply(sf, mx.scale_m4(v));
}


export abstract class MapBase<T extends MapBase<T>> implements IMap<MapBase<T>> {
    constructor(
        public verts: vc.V3[],
    ) {}

    abstract clone(): T;

    clone_update(v: vc.V3[]): T {
        const t = this.clone();
        t.verts = v;
        return t;
    }
    map(f: (v: vc.V4) => vc.V4): T {
        return this.clone_update(this.verts.map(v => vc.v4map_v3(v, 1, f)));
    }
    map3(f: (v: vc.V3) => vc.V3): T {
        return this.clone_update(this.verts.map(v => f(v)));
    }
}

export class Surfaces extends MapBase<Surfaces> {
    constructor(
        verts: vc.V3[],
        public faces: IndexList[],
    ){
        super(verts);
    }
    clone(): Surfaces {
        return new Surfaces(this.verts, this.faces);
    }
}
export class Material {
    constructor(
        public name: string,
        public diffuse: RGB01|null = null,
    ){}
}
export class SurfaceGroup {
    constructor(
        public name: string|null,
        public faces: IndexList[],
        public material: Material|null = null,
    ){}

    clone_offset(index_offset: number): SurfaceGroup {
        const new_faces = this.faces.map(f => shift_offset(f, index_offset));
        return new SurfaceGroup(this.name, new_faces, this.material);
    }
}
export class SurfaceGroups extends MapBase<SurfaceGroups> {
    constructor(
        public name: string|null,
        verts: vc.V3[],
        public faces: SurfaceGroup[],
    ){
        super(verts);
    }
    clone(): SurfaceGroups {
        return new SurfaceGroups(this.name, this.verts, this.faces);
    }
}

export function merge_surfaces(sf: Surfaces|Surfaces[], material: Material|null, name: string|null=null): SurfaceGroups {
    if (sf instanceof Array) {
        return _geos_to_obj(sf, name, _ => material);
    } else {
        return new SurfaceGroups(name, sf.verts, [new SurfaceGroup(name, sf.faces, material)]);
    }
}

export function merge_surfaces_materials(sf: Surfaces[], materials: Material[], name: string|null=null): SurfaceGroups {
    return _geos_to_obj(sf, name, i => materials[i]);
}

function _geos_to_obj(geos: Surfaces[], name: string|null, f_material: (i: number) => Material|null): SurfaceGroups {
    let verts: vc.V3[] = [];
    let faces: SurfaceGroup[] = [];
    let index = 0;
    geos.forEach((geo, i) => {
        verts = verts.concat(geo.verts);
        const f = geo.faces.map(f => shift_offset(f, index));
        const m = f_material(i);
        const m_name = m != null ? m.name : null;
        const fg = new SurfaceGroup(m_name, f, m);
        faces.push(fg);
        index += geo.verts.length;
    });
    return new SurfaceGroups(name, verts, faces);
}

export function concat_surfaces(sf: Surfaces[]): Surfaces {
    let verts: vc.V3[] = [];
    let faces: number[][] = [];
    let index = 0;
    sf.forEach(geo => {
        verts = verts.concat(geo.verts);
        faces = faces.concat(geo.faces.map(f => f.map(i => i + index)));
        index += geo.verts.length;
    });
    return new Surfaces(verts, faces);
}
export function concat_surface_groups(objs: SurfaceGroups[], name: string|null=null): SurfaceGroups {
    let verts: vc.V3[] = [];
    let faces: SurfaceGroup[] = [];
    let index = 0;
    objs.forEach(obj => {
        verts = verts.concat(obj.verts);
        faces = faces.concat(obj.faces.map(f => f.clone_offset(index)));
        index += obj.verts.length;
    });
    return new SurfaceGroups(name, verts, faces);
}


/** 4次元行列リストを写像配列に変換 */
export function m4s_to_v3maps(mm: mx.M4[]): Array<(v: vc.V3) => vc.V3> {
    return mm.map(m => (v: vc.V3) => m.map_v3(v, 1));
}
/** 4次元行列リストを写像配列に変換 */
export function m4s_to_v4maps(mm: mx.M4[]): Array<(v: vc.V4) => vc.V4> {
    return mm.map(m => (v: vc.V4) => m.map(v));
}


/** 写像配列を用いたジオメトリ・オブジェクト配列複製 */
export function duplicate_f<T extends IMap<T>>(obj: T, v4maps: Array<(v: vc.V4) => vc.V4>): T[] {
    return v4maps.map(f => obj.map(v => f(v)));
}

/** 写像配列を用いた3次元ベクトル配列複製 */
export function duplicate_v3(verts: vc.V3[], w: number, v4maps: Array<(v: vc.V4) => vc.V4>): vc.V3[][] {
    return v4maps.map(m => verts.map(v => vc.v4map_v3(v, w, m)));
}

/** 任意のデータ配列を用いた合成写像の生成 */
export function compose_m4<T>(data: T[], lambdas: Array<(d: T) => mx.M4>): mx.M4[] {
    return data.map(d => lambdas.reduce((m, lambda) => lambda(d).mul(m), mx.unit_m4));
}
/** 任意のデータ配列を用いた合成写像の生成 */
export function compose_v3map<T>(data: T[], lambdas: Array<(d: T) => mx.M4>): Array<(v: vc.V3) => vc.V3> {
    return m4s_to_v3maps(compose_m4(data, lambdas));
}
/** 任意のデータ配列を用いた合成写像の生成 */
export function compose_v4map<T>(data: T[], lambdas: Array<(d: T) => mx.M4>): Array<(v: vc.V4) => vc.V4> {
    return m4s_to_v4maps(compose_m4(data, lambdas));
}


