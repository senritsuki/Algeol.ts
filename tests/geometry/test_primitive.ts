declare const require: any;
const fs = require('fs');

import * as al from "../../geometry/geo";
import * as prim from "../../geometry/primitive";
import * as wo from "../../decoder/wavefront";


export function save(name: string, geo: al.Geo): void {
	const path = `test_geo_primitive/${name}.obj`;
	fs.writeFile(path, wo.geo_str(geo));
	console.log('save: ' + path);
}

export function test() {
	save('tetrahedron',
		prim.tetrahedron());
	save('octahedron',
		prim.octahedron());
	save('cube',
		prim.cube());
	save('dodecahedron',
		prim.dodecahedron());
	save('icosahedron',
		prim.icosahedron());
	save('prism',
		prim.prism(8));
	save('pyramid',
		prim.pyramid(8));
	save('bipyramid',
		prim.bipyramid(8));
}
test();
