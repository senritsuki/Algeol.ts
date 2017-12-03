/** Geometry */

//import * as ut from "../algorithm/utility";
import * as vc from "../algorithm/vector";
import * as mx from "../algorithm/matrix";
//import * as col from "./math/color";

type V3 = vc.V3;
type IndexList = number[];
type RGB01 = number[];

export class Geometry {
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
        const new_faces = this.faces.map(nn => nn.map(n => n + index_offset));
        return new FaceGroup(this.name, new_faces, this.material);
    }
}
export class Object {
    constructor(
        public name: string|null,
        public verts: V3[],
        public faces: FaceGroup[],
    ){}
}

export function geo_to_obj(geo: Geometry, name: string|null=null, material: Material|null=null): Object {
    return new Object(name, geo.verts, [new FaceGroup(name, geo.faces, material)]);
}

export function merge(geos: Object[], name: string|null=null): Object {
    let merged_verts: V3[] = [];
    let merged_faces: FaceGroup[] = [];
    let index = 0;
    geos.forEach(geo => {
        merged_verts = merged_verts.concat(geo.verts);
        merged_faces = merged_faces.concat(geo.faces.map(f => f.clone_offset(index)));
        index += geo.verts.length;
    });
    return new Object(name, merged_verts, merged_faces);
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

