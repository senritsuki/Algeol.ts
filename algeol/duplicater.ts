// Geometry Duplicater and Affine Map Compositer

import * as ut from "./math/util";
import * as vc from "./math/vector";
import * as mx from "./math/matrix";
import * as al from "./al";


export function duplicate_with_affine(geo: al.Geo, m4: mx.M4[]): al.Geo[] {
	const verts = geo.verts();
	const faces = geo.faces();
	return m4.map(m => al.geo(verts.map(v => m.map_v3(v, 1)), faces))
}
export function duplicate_with_lambda(geo: al.Geo, map: (v: vc.V3) => vc.V3[]): al.Geo[] {
	const faces = geo.faces();
	return ut.transpose<vc.V3>(geo.verts().map(map)).map(verts => al.geo(verts, faces));
}

export function composite_affine<T>(data: T[], lambdas: Array<(d: T) => mx.M4>): mx.M4[] {
	return data.map(d => lambdas.reduce((m, lambda) => m.mul(lambda(d)), mx.unit_m4));
}

interface MatricesComposer<T> {
	data(): T[];
	compose(lambdas: Array<(d: T) => mx.M4>): mx.M4[]
}
class MatricesComposerImpl<T> implements MatricesComposer<T> {
	constructor(
		public _data: T[]) { }

	data(): T[] {
		return this._data;
	}
	compose(lambdas: Array<(d: T) => mx.M4>): mx.M4[] {
		return this._data.map(d => lambdas.reduce((m, lambda) => m.mul(lambda(d)), mx.unit_m4));
	}
}

