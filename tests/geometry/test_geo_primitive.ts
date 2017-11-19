declare const require: any;
const fs = require('fs');

import * as al from "../../algeol/algeol";
import * as wo from "../../algeol/presets/format_wavefrontobj";
import * as prim from "../../algeol/presets/geo_primitive";


function save(name: string, geo: al.Geo): void {
	const path = `test_geo_primitive/${name}.obj`;
	fs.writeFile(path, wo.geo_str(geo));
	console.log('save: ' + path);
}

function test() {
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
