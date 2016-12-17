declare const require: any;
const fs = require('fs');

import * as al from "../../algeol/al";
import * as vc from "../../algeol/math/vector";

import * as wo from "../../algeol/presets/format_wavefrontobj";
import * as prim from "../../algeol/presets/prim_old";

const dummy = prim;

// 簡易目視テスト
function test() {
	const exportGeo = (obj: al._Obj, name: string) => {
		fs.writeFile(`prim_out/${name}.obj`, wo.geo_str(obj.geo()));
	};
	{
		console.log('polygon');
		const verts = [
			vc.v3(0, 0, 0),
			vc.v3(1, 0, 0),
			vc.v3(0, 1, 0),
			vc.v3(0, 0, 1),
		];
		const faces = [
			[0, 1, 3],
			[1, 2, 3],
			[2, 0, 3],
			[2, 1, 0],
		];
		const obj = prim.polygon(verts, faces);
		console.log(obj);
		exportGeo(obj, 'polygon');
	}
	const testObj = (name: string, fn: () => al._Obj) => {
		console.log(name);
		const obj = fn();
		console.log(obj);
		exportGeo(obj, name);
	};
	testObj('tetrahedron', prim.tetrahedron);
	testObj('octahedron', prim.octahedron);
	testObj('cube', prim.cube);
	testObj('dodecahedron', prim.dodecahedron);
	testObj('icosahedron', prim.icosahedron);
}
test();
