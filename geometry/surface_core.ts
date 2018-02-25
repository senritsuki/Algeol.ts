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
    return apply(sf, mx.affine3_translate(v_add));
}
export function rotate_x<T extends IMap<T>>(sf: T, rad: number): T {
    return apply(sf, mx.affine3_rotate_x(rad));
}
export function rotate_y<T extends IMap<T>>(sf: T, rad: number): T {
    return apply(sf, mx.affine3_rotate_y(rad));
}
export function rotate_z<T extends IMap<T>>(sf: T, rad: number): T {
    return apply(sf, mx.affine3_rotate_z(rad));
}
export function scale<T extends IMap<T>>(sf: T, v: number[]|vc.V3): T {
    return apply(sf, mx.affine3_scale(v));
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

/** マテリアル。名前と拡散光 */
export class Material {
    constructor(
        /** マテリアル名 */
        public name: string,
        /** 拡散光色 */
        public diffuse: RGB01|null = null,
    ){}
}
/** 1つ以上の面、名前、マテリアル */
export class SurfacesMaterial {
    constructor(
        /** 面リスト */
        public faces: IndexList[],
        /** 面リストの名前 */
        public name: string|null,
        /** 面リストに対応するマテリアル */
        public material: Material|null = null,
    ){}

    clone_offset(index_offset: number): SurfacesMaterial {
        const new_faces = this.faces.map(f => shift_offset(f, index_offset));
        return new SurfacesMaterial(new_faces, this.name, this.material);
    }
}
/** 頂点リスト、1つ以上の面 */
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
/**
 * モデル名、頂点リスト、面情報リスト
 * SurfaceModel 1--1 name
 *              1--* verts
 *              1--* faces 1--1 name
 *                         1--1 material
 *                         1--* faces
 */
export class SurfaceModel extends MapBase<SurfaceModel> {
    constructor(
        public name: string|null,
        verts: vc.V3[],
        public faces: SurfacesMaterial[],
    ){
        super(verts);
    }
    clone(): SurfaceModel {
        return new SurfaceModel(this.name, this.verts, this.faces);
    }
}

export function merge_surfaces(sf: Surfaces|Surfaces[], material: Material|null, name: string|null=null): SurfaceModel {
    if (sf instanceof Array) {
        return _geos_to_obj(sf, name, _ => material);
    } else {
        return new SurfaceModel(name, sf.verts, [new SurfacesMaterial(sf.faces, name, material)]);
    }
}

export function merge_surfaces_materials(sf: Surfaces[], materials: Material[], name: string|null=null): SurfaceModel {
    return _geos_to_obj(sf, name, i => materials[i]);
}

function _geos_to_obj(geos: Surfaces[], name: string|null, f_material: (i: number) => Material|null): SurfaceModel {
    let verts: vc.V3[] = [];
    let faces: SurfacesMaterial[] = [];
    let index = 0;
    geos.forEach((geo, i) => {
        verts = verts.concat(geo.verts);
        const f = geo.faces.map(f => shift_offset(f, index));
        const m = f_material(i);
        const m_name = m != null ? m.name : null;
        const fg = new SurfacesMaterial(f, m_name, m);
        faces.push(fg);
        index += geo.verts.length;
    });
    return new SurfaceModel(name, verts, faces);
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
export function concat_surface_models(objs: SurfaceModel[], name: string|null=null): SurfaceModel {
    let verts: vc.V3[] = [];
    let faces: SurfacesMaterial[] = [];
    let index = 0;
    objs.forEach(obj => {
        verts = verts.concat(obj.verts);
        faces = faces.concat(obj.faces.map(f => f.clone_offset(index)));
        index += obj.verts.length;
    });
    return new SurfaceModel(name, verts, faces);
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


