import * as al from "../al";
import * as ut from "../util/util";
import * as vc from "../math/vector";
import * as mx from "../math/matrix";


export namespace fn {
	const deg120_c = ut.cos(120 * ut.pi / 180);
	const deg120_s = ut.sin(120 * ut.pi / 180);
	const deg240_c = ut.cos(240 * ut.pi / 180);
	const deg240_s = ut.sin(240 * ut.pi / 180);

	const tetrahedron_rad = ut.acos(-1 / 3); // 半径:高さ = 3:4
	const tetrahedron_c = ut.cos(tetrahedron_rad);
	const tetrahedron_s = ut.sin(tetrahedron_rad);

	export namespace tetrahedron {
		export function verts(x: number, y: number, z: number): vc.V3[] {
			return [
				vc.v3(0, 0, z), // 上
				vc.v3(x * tetrahedron_s, 0, z * tetrahedron_c), // 下 右
				vc.v3(x * tetrahedron_s * deg120_c, y * tetrahedron_s * deg120_s, z * tetrahedron_c), // 下 左奥
				vc.v3(x * tetrahedron_s * deg240_c, y * tetrahedron_s * deg240_s, z * tetrahedron_c), // 下 左前
			];
		}
		export function faces(): number[][] {
			return [
				[0, 1, 2], // 上 右奥
				[0, 2, 3], // 上 左
				[0, 3, 1], // 上 右前
				[3, 2, 1], // 下
			];
		}
	}
	export namespace octahedron {
		export function verts(x: number, y: number, z: number): vc.V3[] {
			return [
				vc.v3(0, 0, z),	 // 上
				vc.v3(x, 0, 0),	 // 中 右
				vc.v3(0, y, 0),	 // 中 奥
				vc.v3(-x, 0, 0), // 中 左
				vc.v3(0, -y, 0), // 中 前
				vc.v3(0, 0, -z), // 下
			];
		}
		export function faces(): number[][] {
			return [
				[1, 2, 0], // 上 右奥
				[2, 3, 0], // 上 左奥
				[3, 4, 0], // 上 左前
				[4, 1, 0], // 上 右前
				[1, 4, 5], // 下 右前
				[4, 3, 5], // 下 左前
				[3, 2, 5], // 下 左奥
				[2, 1, 5], // 下 右奥
			];
		}
	}
	export namespace cube {
		export function verts(x: number, y: number, z: number): vc.V3[] {
			return [
				vc.v3(x, y, z),	   // 上 右奥
				vc.v3(-x, y, z),   // 上 左奥
				vc.v3(-x, -y, z),  // 上 左前
				vc.v3(x, -y, z),   // 上 右前
				vc.v3(x, y, -z),   // 下 右奥
				vc.v3(-x, y, -z),  // 下 左奥
				vc.v3(-x, -y, -z), // 下 左前
				vc.v3(x, -y, -z),  // 下 右前
			];
		}
		export function faces(): number[][] {
			return [
				[0, 1, 2, 3], // 上
				[7, 6, 5, 4], // 下
				[4, 5, 1, 0], // 奥
				[5, 6, 2, 1], // 左
				[6, 7, 3, 2], // 前
				[7, 4, 0, 3], // 右
			];
		}
	}
	export namespace trirect {
		export function verts(s: number, l: number): vc.V3[] {
			return [
				vc.v3(l, s, 0),
				vc.v3(-l, s, 0),
				vc.v3(-l, -s, 0),
				vc.v3(l, -s, 0),
				vc.v3(0, l, s),
				vc.v3(0, -l, s),
				vc.v3(0, -l, -s),
				vc.v3(0, l, -s),
				vc.v3(s, 0, l),
				vc.v3(s, 0, -l),
				vc.v3(-s, 0, -l),
				vc.v3(-s, 0, l),
			];
		}
	}
	export namespace dodecahedron {
		export function verts(r: number): vc.V3[] {
			const c = r / ut.r3;
			const s = c / ut.phi;
			const l = c * ut.phi;
			return fn.trirect.verts(s, l).concat(fn.cube.verts(c, c, c));
		}
		export function faces(): number[][] {
			const xy = ut.seq(4, 0);
			const yz = ut.seq(4, 4);
			const zx = ut.seq(4, 8);
			const ct = ut.seq(4, 12);
			const cb = ut.seq(4, 16);
			return [
				[xy[0], ct[0], zx[0], ct[3], xy[3]], // 上 右
				[xy[3], cb[3], zx[1], cb[0], xy[0]], // 下 右
				[xy[2], ct[2], zx[3], ct[1], xy[1]], // 上 左
				[xy[1], cb[1], zx[2], cb[2], xy[2]], // 下 左
				[yz[2], cb[3], xy[3], ct[3], yz[1]], // 中 右前
				[yz[1], ct[2], xy[2], cb[2], yz[2]], // 中 左前
				[yz[0], ct[0], xy[0], cb[0], yz[3]], // 中 右奥
				[yz[3], cb[1], xy[1], ct[1], yz[0]], // 中 左奥
				[zx[3], ct[2], yz[1], ct[3], zx[0]], // 上 前
				[zx[0], ct[0], yz[0], ct[1], zx[3]], // 上 奥
				[zx[1], cb[3], yz[2], cb[2], zx[2]], // 下 前
				[zx[2], cb[1], yz[3], cb[0], zx[1]], // 下 奥
			];
		}
	}
	export namespace icosahedron {
		export function verts(r: number): vc.V3[] {
			const s = r / ut.sqrt(2 + ut.phi); // 0^2 + 1^2 + ut.phi^2
			const l = s * ut.phi;
			return fn.trirect.verts(s, l);
		}
		export function faces(): number[][] {
			const xy = ut.seq(4, 0);
			const yz = ut.seq(4, 4);
			const zx = ut.seq(4, 8);
			return [
				[xy[0], zx[0], xy[3]], // 上 右
				[xy[3], zx[1], xy[0]], // 下 右
				[xy[2], zx[3], xy[1]], // 上 左
				[xy[1], zx[2], xy[2]], // 下 左
				[yz[2], xy[3], yz[1]], // 中 前右
				[yz[1], xy[2], yz[2]], // 中 前左
				[yz[0], xy[0], yz[3]], // 中 奥右
				[yz[3], xy[1], yz[0]], // 中 奥左
				[zx[3], yz[1], zx[0]], // 上 前
				[zx[0], yz[0], zx[3]], // 上 奥
				[zx[1], yz[2], zx[2]], // 下 前
				[zx[2], yz[3], zx[1]], // 下 奥
				[zx[0], yz[1], xy[3]], // 中上 右前
				[zx[0], xy[0], yz[0]], // 中上 右奥
				[zx[1], xy[3], yz[2]], // 中下 右前
				[zx[1], yz[3], xy[0]], // 中下 右奥
				[zx[3], xy[2], yz[1]], // 中上 左前
				[zx[3], yz[0], xy[1]], // 中上 左奥
				[zx[2], yz[2], xy[2]], // 中下 左前
				[zx[2], xy[1], yz[3]], // 中下 左奥
			];
		}
	}
	export namespace crystal {
		export function verts(v: number, x: number, y: number, zt: number, zb: number): vc.V3[] {
			const verts_h = ut.seq(v, 0, ut.pi2 / v).map(rad =>
				vc.v3(x * ut.cos(rad), y * ut.sin(rad), 0));
			const verts_v = [
				vc.v3(0, 0, zt), // 上
				vc.v3(0, 0, zb), // 下
			];
			return verts_h.concat(verts_v);
		}
		export function faces(v: number): number[][] {
			const t = v;
			const b = v + 1;
			const faces_t = ut.seq(v).map(i => [i, (i + 1) % v, t]);
			const faces_b = ut.seq(v).map(i => [(i + 1) % v, i, b]);
			return faces_t.concat(faces_b);
		}
	}
	export namespace cone {
		export function verts(v: number, x: number, y: number, z: number): vc.V3[] {
			return fn.crystal.verts(v, x, y, z, 0);
		}
		export function faces(v: number): number[][] {
			return fn.crystal.faces(v);
		}
	}
	export namespace prism {
		export function verts(v: number, x: number, y: number, zt: number, zb: number): vc.V3[] {
			const verts_t = ut.seq(v, 0, ut.pi2 / v).map(rad =>
				vc.v3(x * ut.cos(rad), y * ut.sin(rad), zt));
			const verts_b = ut.seq(v, 0, ut.pi2 / v).map(rad =>
				vc.v3(x * ut.cos(rad), y * ut.sin(rad), zb));
			const verts_v = [
				vc.v3(0, 0, zt), // 上
				vc.v3(0, 0, zb), // 下
			];
			return verts_t.concat(verts_b).concat(verts_v);
		}
		export function faces(v: number): number[][] {
			const t = 2 * v;
			const b = 2 * v + 1;
			const faces_t = ut.seq(v).map(i => [i, (i + 1) % v, t]);
			const faces_b = ut.seq(v).map(i => [v + (i + 1) % v, v + i, b]);
			const faces_side = ut.seq(v).map(i => [i, (i + 1) % v, v + (i + 1) % v, v + i]);
			return faces_t.concat(faces_b).concat(faces_side);
		}
	}
}

/** Polygon - 多角形 */
export function polygon(verts: vc.V3[], faces: number[][]): al.Obj {
	return al.obj('polygon', verts, (name, verts) => {
		return al.geo(name, verts, faces);
	});
}

function obj(name: string, sp: al.Space, geoVerts: vc.V3[], geoFaces: number[][]): al.Obj {
	return al.obj(name, sp.array(), (name, verts) => {
		return al.geo(name, mx.map_m4_v3(geoVerts, al.ar_space(verts).m4()), geoFaces);
	});
}

/** Tetrahedron - 正4面体 */
export function tetrahedron(sp: al.Space = al.default_space): al.Obj {
	return obj('tetrahedron', sp, fn.tetrahedron.verts(1, 1, 1), fn.tetrahedron.faces());
}

/** Octahedron 正8面体 */
export function octahedron(sp: al.Space = al.default_space): al.Obj {
	return obj('octahedron', sp, fn.octahedron.verts(1, 1, 1), fn.octahedron.faces());
}

/** Cube 正6面体・正方形 */
export function cube(sp: al.Space = al.default_space): al.Obj {
	return obj('cube', sp, fn.cube.verts(1, 1, 1), fn.cube.faces());
}

/** Dodecahedron 正12面体 */
export function dodecahedron(sp: al.Space = al.default_space): al.Obj {
	return obj('dodecahedron', sp, fn.dodecahedron.verts(1), fn.dodecahedron.faces());
}

/** Icosahedron 正20面体 */
export function icosahedron(sp: al.Space = al.default_space): al.Obj {
	return obj('icosahedron', sp, fn.icosahedron.verts(1), fn.icosahedron.faces());
}
