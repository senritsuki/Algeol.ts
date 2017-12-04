/** Geometry */

//import * as ut from "../algorithm/utility";
import * as vc from "../algorithm/vector";
import * as mx from "../algorithm/matrix";
//import * as col from "./math/color";

type V3 = vc.V3;
type IndexList = number[];
type RGB01 = number[];

function shift_offset(face: IndexList, index_offset: number): IndexList {
    return face.map(n => n + index_offset);
}

export class Geo {
    constructor(
        public verts: V3[],
        public faces: IndexList[],
    ){}
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
export class Obj {
    constructor(
        public name: string|null,
        public verts: V3[],
        public faces: FaceGroup[],
    ){}
}

export function geo_to_obj(geo: Geo, name: string|null=null, material: Material|null=null): Obj {
    return new Obj(name, geo.verts, [new FaceGroup(name, geo.faces, material)]);
}

export function merge_geos_materials(geos: Geo[], materials: Material[]=[], name: string|null=null): Obj {
    let verts: V3[] = [];
    let faces: FaceGroup[] = [];
    let index = 0;
    geos.forEach((geo, i) => {
        verts = verts.concat(geo.verts);
        const f = geo.faces.map(f => shift_offset(f, index));
        const fg = new FaceGroup();
    });
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


const map_mm4 = (mm: mx.M4[]) => mm.map(m => (v: vc.V3) => m.map_v3(v, 1));

/** 写像配列を用いた3次元ベクトル配列複製 */
export function duplicateVerts(verts: vc.V3[], maps: Array<(v: vc.V3) => vc.V3>): vc.V3[][] {
    return maps.map(m => verts.map(m));
}
/** アフィン写像配列を用いた3次元ベクトル配列複製 */
export function duplicateVertsAffine(verts: vc.V3[], m4: mx.M4[]): vc.V3[][] {
    return duplicateVerts(verts, map_mm4(m4));
}

export const affines_to_maps = (m4: mx.M4[]): Array<(v: vc.V3) => vc.V3> => map_mm4(m4);

/** 任意のデータ配列を用いた合成写像の生成 */
export function compositeMap<T>(data: T[], lambdas: Array<(d: T) => mx.M4>): mx.M4[] {
    return data.map(d => lambdas.reduce((m, lambda) => lambda(d).mul(m), mx.unit_m4));
}

