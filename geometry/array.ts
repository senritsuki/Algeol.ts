/** 複合オブジェクト */

import * as al from "./geo";
import * as seq from "../algorithm/sequence";
import * as vc from "../algorithm/vector";

type V3 = vc.V3;
const geometry = (verts: V3[], faces: number[][]) => new al.Geo(verts, faces);

/** 二次元配列の一次元化 */
export function flatten<T>(polygons: T[][]): T[] {
    return polygons
        .reduce((a, b) => a.concat(b));
}

function faces_side_common(polygons: V3[][], op: (faces: number[][], i: number[], j: number[]) => void): number[][] {
    const count = polygons.length;
    const n_gonal = polygons[0].length;
    // 6角形3枚の場合、[0, 6], [6, 12]
    const array_i = seq.arith(count - 1).map(i => [i * n_gonal, (i + 1) * n_gonal]);
    // 6角形3枚の場合、[0, 1], [1, 2], ..., [5, 0]
    const array_j = seq.arith(n_gonal).map(j => [j, (j + 1) % n_gonal]);

    const faces: number[][] = [];
    array_i.forEach(i => {
        array_j.forEach(j => {
            op(faces, i, j);
        });
    });
    return faces;
}

function faces_side_prismArray(polygons: V3[][]): number[][] {
    return faces_side_common(polygons, (faces, i, j) => {
        // 側面四角形
        faces.push([i[0] + j[0], i[0] + j[1], i[1] + j[1], i[1] + j[0]]);
    });
}
function faces_side_antiprismArray(polygons: V3[][]): number[][] {
    return faces_side_common(polygons, (faces, i, j) => {
        // 側面三角形 下（△▽の△）
        faces.push([i[0] + j[0], i[0] + j[1], i[1] + j[0]]);
        // 側面三角形 上（△▽の▽）
        faces.push([i[0] + j[1], i[1] + j[1], i[1] + j[0]]);
    });
}

function common_prismArray(polygons: V3[][], faces_side: (polygons: V3[][]) => number[][]): al.Geo {
    const verts = flatten(polygons);
    const faces = faces_side(polygons);
    const ix = seq.arith(polygons[0].length);
    faces.push(ix.map(i => i));  // 底面
    faces.push(ix.map(i => (polygons.length - 1) * ix.length + i)); // 上面
    return geometry(verts, faces);
}

/** 連続角柱 */
export function prismArray(polygons: V3[][]): al.Geo {
    return common_prismArray(polygons, faces_side_prismArray);
}
/** 連続反角柱 */
export function antiprismArray(polygons: V3[][]): al.Geo {
    return common_prismArray(polygons, faces_side_antiprismArray);
}

function common_prismArray_pyramid(polygons: V3[][], v1: V3, faces_side: (polygons: V3[][]) => number[][]): al.Geo {
    const count = polygons.length;
    const n_gonal = polygons[0].length;
    const seq_j = seq.arith(n_gonal);
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
export function prismArray_pyramid(polygons: V3[][], v1: V3): al.Geo {
    return common_prismArray_pyramid(polygons, v1, faces_side_prismArray);
}
/** 連続反角柱 + 上に角錐 */
export function antiprismArray_pyramid(polygons: V3[][], v1: V3): al.Geo {
    return common_prismArray_pyramid(polygons, v1, faces_side_antiprismArray);
}

function common_prismArray_bipyramid(polygons: V3[][], v1: V3, v2: V3, faces_side: (polygons: V3[][]) => number[][]): al.Geo {
    const count = polygons.length;
    const n_gonal = polygons[0].length;
    const seq_j2 = seq.arith(n_gonal).map(j => [j, (j + 1) % n_gonal]);

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
export function prismArray_bipyramid(polygons: V3[][], v1: V3, v2: V3): al.Geo {
    return common_prismArray_bipyramid(polygons, v1, v2, faces_side_prismArray);
}
/** 連続反角柱 + 上下に角錐 */
export function antiprismArray_bipyramid(polygons: V3[][], v1: V3, v2: V3): al.Geo {
    return common_prismArray_bipyramid(polygons, v1, v2, faces_side_antiprismArray);
}

function common_prismRing(polygons: V3[][], faces_side: (polygons: V3[][]) => number[][]): al.Geo {
    const verts = flatten(polygons);
    const faces = faces_side(polygons);
    return geometry(verts, faces);
}

/** 角柱の輪 */
export function prismRing(polygons: V3[][]): al.Geo {
    return common_prismRing(polygons, faces_side_prismArray);
}
/** 反角柱の輪 */
export function antiprismRing(polygons: V3[][]): al.Geo {
    return common_prismRing(polygons, faces_side_antiprismArray);
}

/** 押し出し */
export function extrude(polygon: V3[], v1: V3, v2: V3): al.Geo {
    const p1 = polygon.map(v => v.add(v1));
    const p2 = polygon.map(v => v.add(v2));
    return prismArray([p1, p2]);
}

