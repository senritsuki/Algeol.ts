/** 複合オブジェクト */

import * as al from "../algeol";
import * as ut from "../math/utility";
import * as vc from "../math/vector";


function verts_flat(polygons: vc.V3[][], n_gonal: number): vc.V3[] {
	const seq = ut.seq.arith(n_gonal);
	return polygons
		.map(polygon => seq.map(i => polygon[i]))
		.reduce((a, b) => a.concat(b), <vc.V3[]>[]);
}

function faces_prismSide(array_i: number[][], array_j: number[][]): number[][] {
	const faces: number[][] = [];
	array_i.forEach(i => {
		array_j.forEach(j => {
			faces.push([i[0] + j[0], i[0] + j[1], i[1] + j[1], i[1] + j[0]]); // 側面四角形
		});
	});
	return faces;
}
function faces_antiprismSide(array_i: number[][], array_j: number[][]): number[][] {
	const faces: number[][] = [];
	array_i.forEach(i => {
		array_j.forEach(j => {
			faces.push([i[0] + j[0], i[0] + j[1], i[1] + j[0]]); // 側面三角形 下（△▽の△）
			faces.push([i[0] + j[1], i[1] + j[1], i[1] + j[0]]); // 側面三角形 上（△▽の▽）
		});
	});
	return faces;
}


function common_prismArray(polygons: vc.V3[][], faces_side: (i: number[][], j: number[][]) => number[][]): al.Geo {
	const count = polygons.length;
	const n_gonal = polygons[0].length;
	const seq_i2 = ut.seq.arith(count - 1).map(i => [i * n_gonal, (i + 1) * n_gonal]);
	const seq_j = ut.seq.arith(n_gonal);
	const seq_j2 = seq_j.map(j => [j, (j + 1) % n_gonal]);

	const verts = verts_flat(polygons, n_gonal);

	const faces = faces_side(seq_i2, seq_j2);
	faces.push(seq_j); // 底面
	faces.push(seq_j.map(j => (count - 1) * n_gonal + j)); // 上面

	return al.geo(verts, faces);
}

/** 連続角柱 */
export function prismArray(polygons: vc.V3[][]): al.Geo {
	return common_prismArray(polygons, faces_prismSide);
}
/** 連続反角柱 */
export function antiprismArray(polygons: vc.V3[][]): al.Geo {
	return common_prismArray(polygons, faces_antiprismSide);
}

function common_prismArray_pyramid(polygons: vc.V3[][], v1: vc.V3, faces_side: (i: number[][], j: number[][]) => number[][]): al.Geo {
	const count = polygons.length;
	const n_gonal = polygons[0].length;
	const seq_i2 = ut.seq.arith(count - 1).map(i => [i * n_gonal, (i + 1) * n_gonal]);
	const seq_j = ut.seq.arith(n_gonal);
	const seq_j2 = seq_j.map(j => [j, (j + 1) % n_gonal]);

	const verts = verts_flat(polygons, n_gonal);
	verts.push(v1);

	const v1i = verts.length - 1;
	const i1 = (count - 1) * n_gonal;
	
	const faces = faces_side(seq_i2, seq_j2);
	seq_j2.forEach(j2 => faces.push([i1 + j2[0], i1 + j2[1], v1i])); // 角錐 上
	faces.push(seq_j); // 底面

	return al.geo(verts, faces);
}

/** 連続角柱 + 上に角錐 */
export function prismArray_pyramid(polygons: vc.V3[][], v1: vc.V3): al.Geo {
	return common_prismArray_pyramid(polygons, v1, faces_prismSide);
}
/** 連続反角柱 + 上に角錐 */
export function antiprismArray_pyramid(polygons: vc.V3[][], v1: vc.V3): al.Geo {
	return common_prismArray_pyramid(polygons, v1, faces_antiprismSide);
}

function common_prismArray_bipyramid(polygons: vc.V3[][], v1: vc.V3, v2: vc.V3, faces_side: (i: number[][], j: number[][]) => number[][]): al.Geo {
	const count = polygons.length;
	const n_gonal = polygons[0].length;
	const seq_i2 = ut.seq.arith(count - 1).map(i => [i * n_gonal, (i + 1) * n_gonal]);
	const seq_j2 = ut.seq.arith(n_gonal).map(j => [j, (j + 1) % n_gonal]);

	const verts = verts_flat(polygons, n_gonal);
	verts.push(v1);
	verts.push(v2);

	const v1i = verts.length - 2;
	const v2i = verts.length - 1;
	const i1 = 0;
	const i2 = (count - 1) * n_gonal;

	const faces = faces_side(seq_i2, seq_j2);
	seq_j2.forEach(j2 => faces.push([i1 + j2[0], i1 + j2[1], v1i])); // 双角錐 下
	seq_j2.forEach(j2 => faces.push([i2 + j2[0], i2 + j2[1], v2i])); // 双角錐 上

	return al.geo(verts, faces);
}

/** 連続角柱 + 上下に角錐 */
export function prismArray_bipyramid(polygons: vc.V3[][], v1: vc.V3, v2: vc.V3): al.Geo {
	return common_prismArray_bipyramid(polygons, v1, v2, faces_prismSide);
}
/** 連続反角柱 + 上下に角錐 */
export function antiprismArray_bipyramid(polygons: vc.V3[][], v1: vc.V3, v2: vc.V3): al.Geo {
	return common_prismArray_bipyramid(polygons, v1, v2, faces_antiprismSide);
}

function common_prismRing(polygons: vc.V3[][], faces_side: (i: number[][], j: number[][]) => number[][]): al.Geo {
	const count = polygons.length;
	const n_gonal = polygons[0].length;
	const seq_i2 = ut.seq.arith(count).map(i => [i * n_gonal, ((i + 1) % count) * n_gonal]);
	const seq_j2 = ut.seq.arith(n_gonal).map(j => [j, (j + 1) % n_gonal]);

	const verts = verts_flat(polygons, n_gonal);
	const faces = faces_side(seq_i2, seq_j2);
	return al.geo(verts, faces);
}

/** 角柱の輪 */
export function prismRing(polygons: vc.V3[][]): al.Geo {
	return common_prismRing(polygons, faces_prismSide);
}
/** 反角柱の輪 */
export function antiprismRing(polygons: vc.V3[][]): al.Geo {
	return common_prismRing(polygons, faces_antiprismSide);
}

/** 押し出し */
export function extrude(polygon: vc.V3[], v1: vc.V3, v2: vc.V3): al.Geo {
	const p1 = polygon.map(v => v.add(v1));
	const p2 = polygon.map(v => v.add(v2));
	return prismArray([p1, p2]);
}

