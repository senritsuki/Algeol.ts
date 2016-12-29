/** Wavefront .obj */

import * as al from "../algeol";
import * as vc from "../math/vector";

/** 頂点vを文字列化する方法
	デフォルトでは3次元ベクトルを x z -y と並べていますが、変えたい場合は上書きしてください */
export let _vert_str = (v: vc.V3): string => {
	return ['v', v.x(), v.z(), -v.y()].join(' ');
};
/** 面fを文字列化する方法 */
export let _face_str = (f: number[], offset: number): string => {
	return ['f'].concat(f.map(i => '' + (i + offset))).join(' ');
};

function vf_str(verts: vc.V3[], faces: number[][], offset: number = 1): string {
	const strs: string[] = [
		verts.map(v => _vert_str(v)).join('\n'),
		faces.map(f => _face_str(f, offset)).join('\n'),
		'',
	];
	return strs.join('\n') + '\n';
}

class GO<T extends al.GeoRoot> {
	constructor(
		public geo: T,
		public offset: number) { }
}
function array_vfo<T extends al.GeoRoot>(array: T[], offset: number = 1): GO<T>[] {
	const vo: GO<T>[] = [];
	array.forEach(geo => {
		vo.push(new GO(geo, offset));
		offset += geo.verts().length;
	});
	return vo;
}


/** ジオメトリを文字列化 */
export function geo_str(geo: al.GeoRoot, offset: number = 1): string {
	return vf_str(geo.verts(), geo.faces(), offset);
}

/** ジオメトリ配列を文字列化 */
export function geoArray_str(geoArray: al.GeoRoot[], offset: number = 1): string {
	return array_vfo<al.GeoRoot>(geoArray, offset).map(go => geo_str(go.geo, go.offset)).join('\n');
}

/** ジオメトリグループを文字列化 */
export function geoGroup_str(geoGroup: al.GeoGroup, offset: number = 1): string {
	return `g ${geoGroup.name()}\n` + geo_str(geoGroup, offset);
}

/** ジオメトリグループ配列を文字列化 */
export function geoGroupArray_str(geoGroupArray: al.GeoGroup[], offset: number = 1): string {
	return array_vfo<al.GeoGroup>(geoGroupArray, offset).map(go => geoGroup_str(go.geo, go.offset)).join('\n');
}

/** ジオメトリ辞書を文字列化 */
export function geoDict_str(geoDict: al.GeoDict, offset: number = 1): string {
	return geoGroupArray_str(geoDict.geogroups());
}

