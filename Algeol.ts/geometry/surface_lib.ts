/** 複合オブジェクト */

import * as al from "./surface_core";
import * as seq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";

const geometry = (verts: vc.V3[], faces: number[][]) => new al.Surfaces(verts, faces);

/** 二次元配列の一次元化 */
export function flatten<T>(polygons: T[][]): T[] {
    return polygons
        .reduce((a, b) => a.concat(b));
}

function faces_side_common(polygons: vc.V3[][], op: (faces: number[][], i: number[], j: number[]) => void): number[][] {
    const count = polygons.length;
    const n_gonal = polygons[0].length;
    // 6角形3枚の場合、[0, 6], [6, 12]
    const array_i = seq.arithmetic(count - 1).map(i => [i * n_gonal, (i + 1) * n_gonal]);
    // 6角形3枚の場合、[0, 1], [1, 2], ..., [5, 0]
    const array_j = seq.arithmetic(n_gonal).map(j => [j, (j + 1) % n_gonal]);

    const faces: number[][] = [];
    array_i.forEach(i => {
        array_j.forEach(j => {
            op(faces, i, j);
        });
    });
    return faces;
}

function faces_side_prismArray(polygons: vc.V3[][]): number[][] {
    return faces_side_common(polygons, (faces, i, j) => {
        // 側面四角形
        faces.push([i[0] + j[0], i[0] + j[1], i[1] + j[1], i[1] + j[0]]);
    });
}
function faces_side_antiprismArray(polygons: vc.V3[][]): number[][] {
    return faces_side_common(polygons, (faces, i, j) => {
        // 側面三角形 下（△▽の△）
        faces.push([i[0] + j[0], i[0] + j[1], i[1] + j[0]]);
        // 側面三角形 上（△▽の▽）
        faces.push([i[0] + j[1], i[1] + j[1], i[1] + j[0]]);
    });
}

function common_prismArray(polygons: vc.V3[][], faces_side: (polygons: vc.V3[][]) => number[][]): al.Surfaces {
    const verts = flatten(polygons);
    const faces = faces_side(polygons);
    const ix = seq.arithmetic(polygons[0].length);
    faces.push(ix.map(i => i));  // 底面
    faces.push(ix.map(i => (polygons.length - 1) * ix.length + i)); // 上面
    return geometry(verts, faces);
}

/** 連続角柱 */
export function prismArray(polygons: vc.V3[][]): al.Surfaces {
    return common_prismArray(polygons, faces_side_prismArray);
}
/** 連続反角柱 */
export function antiprismArray(polygons: vc.V3[][]): al.Surfaces {
    return common_prismArray(polygons, faces_side_antiprismArray);
}

function common_prismArray_pyramid(polygons: vc.V3[][], v1: vc.V3, faces_side: (polygons: vc.V3[][]) => number[][]): al.Surfaces {
    const count = polygons.length;
    const n_gonal = polygons[0].length;
    const seq_j = seq.arithmetic(n_gonal);
    const seq_j2 = seq_j.map(j => [j, (j + 1) % n_gonal]);

    const verts = flatten(polygons);
    verts.push(v1);

    const v1i = verts.length - 1;
    const i1 = (count - 1) * n_gonal;
    
    const faces = faces_side(polygons);
    seq_j2.forEach(j2 => faces.push([i1 + j2[0], i1 + j2[1], v1i])); // 角錐 上
    faces.push(seq_j); // 底面

    return geometry(verts, faces);
}

/** 連続角柱 + 上に角錐 */
export function prismArray_pyramid(polygons: vc.V3[][], v1: vc.V3): al.Surfaces {
    return common_prismArray_pyramid(polygons, v1, faces_side_prismArray);
}
/** 連続反角柱 + 上に角錐 */
export function antiprismArray_pyramid(polygons: vc.V3[][], v1: vc.V3): al.Surfaces {
    return common_prismArray_pyramid(polygons, v1, faces_side_antiprismArray);
}

function common_prismArray_bipyramid(polygons: vc.V3[][], v1: vc.V3, v2: vc.V3, faces_side: (polygons: vc.V3[][]) => number[][]): al.Surfaces {
    const count = polygons.length;
    const n_gonal = polygons[0].length;
    const seq_j2 = seq.arithmetic(n_gonal).map(j => [j, (j + 1) % n_gonal]);

    const verts = flatten(polygons);
    verts.push(v1);
    verts.push(v2);

    const v1i = verts.length - 2;
    const v2i = verts.length - 1;
    const i1 = 0;
    const i2 = (count - 1) * n_gonal;

    const faces = faces_side(polygons);
    seq_j2.forEach(j2 => faces.push([i1 + j2[0], i1 + j2[1], v1i])); // 双角錐 下
    seq_j2.forEach(j2 => faces.push([i2 + j2[0], i2 + j2[1], v2i])); // 双角錐 上

    return geometry(verts, faces);
}

/** 連続角柱 + 上下に角錐 */
export function prismArray_bipyramid(polygons: vc.V3[][], v1: vc.V3, v2: vc.V3): al.Surfaces {
    return common_prismArray_bipyramid(polygons, v1, v2, faces_side_prismArray);
}
/** 連続反角柱 + 上下に角錐 */
export function antiprismArray_bipyramid(polygons: vc.V3[][], v1: vc.V3, v2: vc.V3): al.Surfaces {
    return common_prismArray_bipyramid(polygons, v1, v2, faces_side_antiprismArray);
}

function common_prismRing(polygons: vc.V3[][], faces_side: (polygons: vc.V3[][]) => number[][]): al.Surfaces {
    const verts = flatten(polygons);
    const faces = faces_side(polygons);
    return geometry(verts, faces);
}

/** 角柱の輪 */
export function prismRing(polygons: vc.V3[][]): al.Surfaces {
    return common_prismRing(polygons, faces_side_prismArray);
}
/** 反角柱の輪 */
export function antiprismRing(polygons: vc.V3[][]): al.Surfaces {
    return common_prismRing(polygons, faces_side_antiprismArray);
}

/** 押し出し */
export function extrude3(polygon: vc.V3[], v1: vc.V3, v2: vc.V3): al.Surfaces {
    const p1 = polygon.map(v => v.add(v1));
    const p2 = polygon.map(v => v.add(v2));
    return prismArray([p1, p2]);
}

/** 押し出し */
export function extrude3_cone(polygon: vc.V3[], v1: vc.V3): al.Surfaces {
    return prismArray_pyramid([polygon], v1);
}
/** 押し出し */
export function extrude3_bicone(polygon: vc.V3[], v1: vc.V3, v2: vc.V3): al.Surfaces {
    return prismArray_bipyramid([polygon], v1, v2);
}

/** 押し出し */
export function extrude2(verts: vc.V2[], z: number): al.Surfaces {
    const len = verts.length;
    const new_verts_1 = verts.map(v => vc.v2_to_v3(v, 0));
    const new_verts_2 = verts.map(v => vc.v2_to_v3(v, z));
    const new_verts = new_verts_1.concat(new_verts_2);
    const new_face_1 = seq.arithmetic(len);
    const new_face_2 = seq.arithmetic(len, len);
    const new_side_faces = seq.arithmetic(len).map(n => [n, (n+1)%len, len+(n+1)%len, len+n]);
    const new_faces: number[][] = [];
    new_faces.push(new_face_1);
    new_faces.push(new_face_2);
    new_side_faces.forEach(f => new_faces.push(f));
    return geometry(new_verts, new_faces);
}

/** 押し出し */
export function extrude2_cone(verts: vc.V2[], z: number): al.Surfaces {
    const len = verts.length;
    const new_verts_1 = verts.map(v => vc.v2_to_v3(v, 0));
    const new_verts_2 = vc.v3(0, 0, z);
    const new_verts = new_verts_1.concat(new_verts_2);
    const new_face_1 = seq.arithmetic(len);
    const new_side_faces = seq.arithmetic(len).map(n => [n, (n+1)%len, len]);
    const new_faces: number[][] = [];
    new_faces.push(new_face_1);
    new_side_faces.forEach(f => new_faces.push(f));
    return geometry(new_verts, new_faces);
}
