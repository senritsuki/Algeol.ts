/** Wavefront .obj */

import * as al from "../algeo";
import * as ut from "../math/util";
import * as vc from "../math/vector";
import * as mx from "../math/matrix";

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
export function geoarray_str(geoarray: al.GeoRoot[], offset: number = 1): string {
	return array_vfo<al.GeoRoot>(geoarray, offset).map(go => geo_str(go.geo, go.offset)).join('\n');
}

/** ジオメトリグループを文字列化 */
export function geogroup_str(geogroup: al.GeoGroup, offset: number = 1): string {
	return `name ${geogroup.name()}\n` + geo_str(geogroup, offset);
}

/** ジオメトリグループ配列を文字列化 */
export function geogrouparray_str(geogrouparray: al.GeoGroup[], offset: number = 1): string {
	return array_vfo<al.GeoGroup>(geogrouparray, offset).map(go => geogroup_str(go.geo, go.offset)).join('\n');
}

