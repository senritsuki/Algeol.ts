/** Geometry */

import * as vc from "../algorithm/vector";
import * as mx from "../algorithm/matrix";

type V3 = vc.V3;
type V4 = vc.V4;
//type M3 = mx.M3;
type M4 = mx.M4;

type IndexList = number[];
type RGB01 = number[];

function shift_offset(face: IndexList, index_offset: number): IndexList {
    return face.map(n => n + index_offset);
}

export interface IMap<T extends IMap<T>> {
    clone(): T;
    map(f: (v: V4) => V4): T;
}

export function apply<T extends IMap<T>>(geo: T, m: M4): T {
    return geo.map(v => m.map(v));
}
export function translate<T extends IMap<T>>(geo: T, v_add: number[]|V3): T {
    return apply(geo, mx.trans_m4(v_add));
}
export function rotate_x<T extends IMap<T>>(geo: T, rad: number): T {
    return apply(geo, mx.rot_x_m4(rad));
}
export function rotate_y<T extends IMap<T>>(geo: T, rad: number): T {
    return apply(geo, mx.rot_y_m4(rad));
}
export function rotate_z<T extends IMap<T>>(geo: T, rad: number): T {
    return apply(geo, mx.rot_z_m4(rad));
}
export function scale<T extends IMap<T>>(geo: T, v: number[]|V3): T {
    return apply(geo, mx.scale_m4(v));
}


export abstract class MapBase<T extends MapBase<T>> implements IMap<MapBase<T>> {
    constructor(
        public verts: V3[],
    ) {}

    abstract clone(): T;

    clone_update(v: V3[]): T {
        const t = this.clone();
        t.verts = v;
        return t;
    }
    map(f: (v: V4) => V4): T {
        return this.clone_update(this.verts.map(v => vc.v4map_v3(v, 1, f)));
    }
    map3(f: (v: V3) => V3): T {
        return this.clone_update(this.verts.map(v => f(v)));
    }
}

export class Geo extends MapBase<Geo> {
    constructor(
        verts: V3[],
        public faces: IndexList[],
    ){
        super(verts);
    }
    clone(): Geo {
        return new Geo(this.verts, this.faces);
    }
}
export class Material {
    constructor(
        public name: string,
        public diffuse: RGB01|null = null,
    ){}
}
export class FaceGroup {
    constructor(
        public name: string|null,
        public faces: IndexList[],
        public material: Material|null = null,
    ){}

    clone_offset(index_offset: number): FaceGroup {
        const new_faces = this.faces.map(f => shift_offset(f, index_offset));
        return new FaceGroup(this.name, new_faces, this.material);
    }
}
export class Obj extends MapBase<Obj> {
    constructor(
        public name: string|null,
        verts: V3[],
        public faces: FaceGroup[],
    ){
        super(verts);
    }
    clone(): Obj {
        return new Obj(this.name, this.verts, this.faces);
    }
}

export function geo_to_obj(geo: Geo, material: Material|null, name: string|null=null): Obj {
    return new Obj(name, geo.verts, [new FaceGroup(name, geo.faces, material)]);
}

export function geos_to_obj(geos: Geo[], material: Material|null, name: string|null=null): Obj {
    return _merge_geos(geos, name, _ => material);
}
export function merge_geos_materials(geos: Geo[], materials: Material[]=[], name: string|null=null): Obj {
    return _merge_geos(geos, name, i => materials[i]);
}
function _merge_geos(geos: Geo[], name: string|null, f_material: (i: number) => Material|null): Obj {
    let verts: V3[] = [];
    let faces: FaceGroup[] = [];
    let index = 0;
    geos.forEach((geo, i) => {
        verts = verts.concat(geo.verts);
        const f = geo.faces.map(f => shift_offset(f, index));
        const m = f_material(i);
        const m_name = m != null ? m.name : null;
        const fg = new FaceGroup(m_name, f, m);
        faces.push(fg);
        index += geo.verts.length;
    });
    return new Obj(name, verts, faces);
}

export function merge_objs(objs: Obj[], name: string|null=null): Obj {
    let verts: V3[] = [];
    let faces: FaceGroup[] = [];
    let index = 0;
    objs.forEach(obj => {
        verts = verts.concat(obj.verts);
        faces = faces.concat(obj.faces.map(f => f.clone_offset(index)));
        index += obj.verts.length;
    });
    return new Obj(name, verts, faces);
}


/** 4次元行列リストを写像配列に変換 */
export function m4s_to_v3maps(mm: M4[]): Array<(v: V3) => V3> {
    return mm.map(m => (v: V3) => m.map_v3(v, 1));
}
/** 4次元行列リストを写像配列に変換 */
export function m4s_to_v4maps(mm: M4[]): Array<(v: V4) => V4> {
    return mm.map(m => (v: V4) => m.map(v));
}


/** 写像配列を用いたジオメトリ・オブジェクト配列複製 */
export function duplicate_f<T extends IMap<T>>(obj: T, v3maps: Array<(v: V3) => V3>): T[] {
    return v3maps.map(f => obj.map(v => vc.v3map_v4(v, f)));
}

/** 写像配列を用いた3次元ベクトル配列複製 */
export function duplicate_v3(verts: V3[], v3maps: Array<(v: V3) => V3>): V3[][] {
    return v3maps.map(m => verts.map(m));
}

/** 任意のデータ配列を用いた合成写像の生成 */
export function compose_m4<T>(data: T[], lambdas: Array<(d: T) => M4>): M4[] {
    return data.map(d => lambdas.reduce((m, lambda) => lambda(d).mul(m), mx.unit_m4));
}
/** 任意のデータ配列を用いた合成写像の生成 */
export function compose_v3map<T>(data: T[], lambdas: Array<(d: T) => M4>): Array<(v: V3) => V3> {
    return m4s_to_v3maps(compose_m4(data, lambdas));
}
/** 任意のデータ配列を用いた合成写像の生成 */
export function compose_v4map<T>(data: T[], lambdas: Array<(d: T) => M4>): Array<(v: V4) => V4> {
    return m4s_to_v4maps(compose_m4(data, lambdas));
}


