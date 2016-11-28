import * as al from "../al";
import * as ut from "../util/util";
import * as vc from "../math/vector";
import * as mx from "../math/matrix";

const deg120_c = Math.cos(120 * Math.PI / 180);
const deg120_s = Math.sin(120 * Math.PI / 180);
const deg240_c = Math.cos(240 * Math.PI / 180);
const deg240_s = Math.sin(240 * Math.PI / 180);

const tetrahedron_rad = Math.acos(-1 / 3); // 半径:高さ = 3:4
const tetrahedron_c = Math.cos(tetrahedron_rad);
const tetrahedron_s = Math.sin(tetrahedron_rad);

/** Polygon - 多角形 */
export function polygon(verts: vc.V3[], faces: number[][]): al.Obj {
	return al.obj('polygon', verts, (name, verts) => {
		return al.geo(name, verts, faces);
	});
}

/** Tetrahedron - 正4面体 */
export function tetrahedron(sp: al.Space = al.default_space): al.Obj {
	const orig_vers = [
		vc.v3(0, 0, 1),
		vc.v3(0, tetrahedron_s, tetrahedron_c),
		vc.v3(deg120_s, deg120_c * tetrahedron_s, tetrahedron_c),
		vc.v3(deg240_s, deg240_c * tetrahedron_s, tetrahedron_c),
	];
	const faces = [
		[0, 1, 2],
		[0, 2, 3],
		[0, 3, 1],
		[3, 2, 1],
	];
	return al.obj('tetrahedron', sp.array(), (name, verts) => {
		return al.geo(name, mx.map_m4_v3(orig_vers, al.ar_space(verts).m4()), faces);
	});
}
